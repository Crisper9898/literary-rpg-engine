import { describe, expect, it } from "vitest";
import { PixiVnAudioOutput } from "../src/engine/audio/PixiVnAudioOutput";

function fakeManager() {
  const media = new Set<string>();
  const channels = new Map<string, { alias: string; volume: number; background: boolean }>();
  const plays: { id: string; source: string; channel: string }[] = [];
  const stops: string[] = [];
  let channelAdds = 0;
  const manager = {
    find: (id: string) => media.has(id) ? { alias: id } : undefined,
    play: async (id: string, source: string, options: { channel: string }) => {
      plays.push({ id, source, channel: options.channel });
      media.add(id);
      return { alias: id };
    },
    stop: (id: string) => { stops.push(id); media.delete(id); },
    pause: () => undefined, resume: () => undefined,
    channels: {
      add: (alias: string, options: { background?: boolean; volume?: number }) => {
        channelAdds++;
        if (channels.has(alias)) return undefined;
        const channel = { alias, background: !!options.background, volume: options.volume ?? 1 };
        channels.set(alias, channel);
        return channel;
      },
      find: (alias: string) => channels.get(alias)!,
      get values() { return [...channels.values()]; },
    },
  };
  return { manager, media, channels, plays, stops, get channelAdds() { return channelAdds; } };
}

describe("Pixi'VN audio output", () => {
  it("waits for a gesture, uses a background channel and prevents duplicate media", async () => {
    const surface = new EventTarget();
    const fake = fakeManager();
    const output = new PixiVnAudioOutput("test-scene", surface, fake.manager);
    output.play("window", "outside-alias");
    output.setVolume("window", 0.35);
    expect(fake.plays).toHaveLength(0);
    surface.dispatchEvent(new Event("pointerdown"));
    await Promise.resolve();
    expect(fake.plays).toEqual([{ id: "test-scene:window", source: "outside-alias",
      channel: "test-scene:window:channel" }]);
    expect(fake.channels.get("test-scene:window:channel")).toMatchObject({ background: true, volume: 0.35 });
    output.play("window", "outside-alias");
    expect(fake.plays).toHaveLength(1);
    output.setVolume("window", 0.4);
    output.setVolume("window", 0.5);
    expect(fake.channelAdds).toBe(1);
    fake.media.clear(); // Pixi'VN replaced its playing media during restore.
    output.play("window", "outside-alias");
    expect(fake.plays).toHaveLength(2);
    output.dispose();
    expect(fake.stops).toContain("test-scene:window");
    output.play("window", "outside-alias");
    expect(fake.plays).toHaveLength(2);
  });

  it("stops a source whose load finishes after scene destruction", async () => {
    const surface = new EventTarget();
    const fake = fakeManager();
    let complete!: (value: { alias: string }) => void;
    fake.manager.play = ((id: string) => new Promise((resolve) => {
      complete = resolve;
      fake.media.add(id);
    })) as typeof fake.manager.play;
    const output = new PixiVnAudioOutput("test-scene", surface, fake.manager);
    surface.dispatchEvent(new Event("keydown"));
    output.play("door", "voice-alias");
    output.dispose();
    complete({ alias: "test-scene:door" });
    await Promise.resolve();
    expect(fake.media.has("test-scene:door")).toBe(false);
  });

  it("keeps a canvas gesture unlocked across scene re-entry", async () => {
    const surface = new EventTarget();
    const fake = fakeManager();
    const first = new PixiVnAudioOutput("first", surface, fake.manager);
    surface.dispatchEvent(new Event("pointerdown"));
    first.play("room", "room.wav");
    await Promise.resolve();
    first.dispose();
    const next = new PixiVnAudioOutput("next", surface, fake.manager);
    next.play("room", "room.wav");
    expect(fake.plays.map((entry) => entry.id)).toEqual(["first:room", "next:room"]);
    next.dispose();
  });

  it("does not stop a newer scene's media when an older load finishes late", async () => {
    const surface = new EventTarget();
    const fake = fakeManager();
    let finish!: () => void;
    fake.manager.play = ((id: string) => {
      if (!finish) return new Promise((resolve) => { finish = () => {
        fake.media.add(id); resolve({ alias: id });
      }; });
      fake.media.add(id);
      return Promise.resolve({ alias: id });
    }) as typeof fake.manager.play;
    const first = new PixiVnAudioOutput("room", surface, fake.manager);
    surface.dispatchEvent(new Event("pointerdown"));
    first.play("ambience", "first.wav");
    first.dispose();
    const second = new PixiVnAudioOutput("room", surface, fake.manager);
    second.play("ambience", "second.wav");
    finish();
    await Promise.resolve();
    expect(fake.media.has("room:ambience")).toBe(true);
    second.dispose();
    expect(fake.media.has("room:ambience")).toBe(false);
  });

  it("adopts media Pixi'VN restored before scene composition and cleans it up", () => {
    const fake = fakeManager();
    fake.media.add("room:ambience");
    const output = new PixiVnAudioOutput("room", new EventTarget(), fake.manager);
    expect(output.isPlaying("ambience")).toBe(true);
    output.setVolume("ambience", 0.3);
    expect(fake.plays).toHaveLength(0);
    output.dispose();
    expect(fake.media.has("room:ambience")).toBe(false);
  });
});

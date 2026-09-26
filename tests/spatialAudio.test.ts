import { describe, expect, it } from "vitest";
import { SpatialAudioController, type AudioOutput } from "../src/engine/audio/SpatialAudioController";

function fakeOutput() {
  const active = new Set<string>();
  const levels = new Map<string, number>();
  const plays: string[] = [];
  const stops: string[] = [];
  let disposed = false;
  let pauses = 0;
  let resumes = 0;
  const output: AudioOutput = {
    isPlaying: (id) => active.has(id),
    play: (id, source) => { plays.push(`${id}:${source}`); active.add(id); },
    setVolume: (id, volume) => { levels.set(id, volume); },
    stop: (id) => { stops.push(id); active.delete(id); },
    pause: () => { pauses++; }, resume: () => { resumes++; },
    dispose: () => { disposed = true; active.clear(); },
  };
  return { output, active, levels, plays, stops, get disposed() { return disposed; },
    get pauses() { return pauses; }, get resumes() { return resumes; } };
}

describe("spatial audio", () => {
  it("raises a zone from its outer edge to its inner area, then fades it out", () => {
    let listener = { x: 20, y: 0 };
    const sink = fakeOutput();
    const controller = new SpatialAudioController(() => listener, [{ id: "window", source: "outdoors.wav",
      volume: 0.8, fadeInMS: 1000, fadeOutMS: 1000,
      zone: { center: () => ({ x: 0, y: 0 }), innerRadius: 4, outerRadius: 20 } }], sink.output);
    controller.update(50);
    expect(sink.plays).toEqual([]);
    listener = { x: 12, y: 0 };
    controller.update(1000);
    expect(controller.getLayerState("window").target).toBeCloseTo(0.4);
    expect(sink.levels.get("window")).toBeCloseTo(0.4);
    listener = { x: 0, y: 0 };
    controller.update(1000);
    expect(sink.levels.get("window")).toBeCloseTo(0.8);
    listener = { x: 30, y: 0 };
    controller.update(1000);
    expect(sink.active.has("window")).toBe(false);
    expect(sink.stops).toEqual(["window"]);
  });

  it("crossfades priority zones while independent layers keep playing", () => {
    let x = 20;
    const sink = fakeOutput();
    const controller = new SpatialAudioController(() => ({ x, y: 0 }), [
      { id: "room", source: "room.wav", volume: 1, group: "ambience", priority: 0 },
      { id: "window", source: "outside.wav", volume: 1, group: "ambience", priority: 10,
        zone: { center: () => ({ x: 0, y: 0 }), innerRadius: 0, outerRadius: 20 } },
      { id: "clock", source: "clock.wav", volume: 0.3 },
    ], sink.output);
    controller.update(50);
    expect(sink.levels.get("room")).toBe(1);
    expect(sink.levels.get("clock")).toBe(0.3);
    x = 10;
    controller.update(50);
    expect(sink.levels.get("room")).toBeCloseTo(0.5);
    expect(sink.levels.get("window")).toBeCloseTo(0.5);
    expect(sink.levels.get("clock")).toBe(0.3);
    x = 0;
    controller.update(50);
    expect(sink.levels.get("room")).toBe(0);
    expect(sink.levels.get("window")).toBe(1);
    expect(sink.active.size).toBe(2);
  });

  it("respects authored fades, dynamic enablement and a generic moving target", () => {
    let enabled = true;
    let camera = { x: 0, y: 0 };
    const sink = fakeOutput();
    const controller = new SpatialAudioController(() => camera, [{ id: "voices", source: "voices.wav",
      volume: 1, fadeInMS: 1000, fadeOutMS: 500, enabled: () => enabled,
      zone: { center: () => ({ x: 0, y: 0 }), innerRadius: 2, outerRadius: 10 } }], sink.output);
    controller.update(250);
    expect(controller.getLayerState("voices").volume).toBeCloseTo(0.25);
    controller.update(250);
    expect(controller.getLayerState("voices").volume).toBeCloseTo(0.5);
    camera = { x: 100, y: 0 };
    enabled = false;
    controller.update(250);
    expect(controller.getLayerState("voices").volume).toBe(0);
    expect(sink.active.size).toBe(0);
    enabled = true;
    camera = { x: 0, y: 0 };
    controller.update(250);
    expect(sink.plays).toHaveLength(2);
  });

  it("does not duplicate playback, reconciles a lost source and cleans up", () => {
    const sink = fakeOutput();
    const controller = new SpatialAudioController(() => ({ x: 0, y: 0 }), [
      { id: "base", source: "base.wav", volume: 0.4 },
    ], sink.output);
    controller.update(16);
    controller.update(16);
    expect(sink.plays).toEqual(["base:base.wav"]);
    sink.active.clear(); // Pixi'VN may replace its playing media during restore.
    controller.update(16);
    expect(sink.plays).toHaveLength(2);
    controller.pause();
    controller.update(100);
    expect(sink.pauses).toBe(1);
    controller.resume();
    expect(sink.resumes).toBe(1);
    controller.dispose();
    expect(sink.disposed).toBe(true);
    controller.update(16);
    expect(sink.plays).toHaveLength(2);
  });

  it("rejects duplicate ids and invalid zone ranges", () => {
    const sink = fakeOutput();
    const base = { id: "one", source: "one.wav", volume: 1 };
    expect(() => new SpatialAudioController(() => ({ x: 0, y: 0 }), [base, base], sink.output))
      .toThrow(RangeError);
    expect(() => new SpatialAudioController(() => ({ x: 0, y: 0 }), [{ ...base,
      zone: { center: () => ({ x: 0, y: 0 }), innerRadius: 5, outerRadius: 4 } }], sink.output))
      .toThrow(RangeError);
  });
});

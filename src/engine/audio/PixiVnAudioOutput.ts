import { sound } from "@drincs/pixi-vn";
import type { AudioOutput } from "./SpatialAudioController";

interface SoundPort {
  find(alias: string): unknown;
  play(alias: string, source: string, options: { channel: string; loop: boolean; volume: number }): Promise<unknown>;
  stop(alias: string): void;
  pause(alias: string): unknown;
  resume(alias: string): unknown;
  channels: {
    add(alias: string, options: { background: boolean; volume: number }): { alias: string; volume: number } | undefined;
    readonly values: { alias: string; volume: number }[];
  };
}

// Browser playback permission belongs to the canvas gesture, not one scene instance.
const unlockedSurfaces = new WeakSet<EventTarget>();
const mediaOwners = new Map<string, PixiVnAudioOutput>();

/** Scene-owned transport using Pixi'VN media/channels, never a second audio manager. */
export class PixiVnAudioOutput implements AudioOutput {
  private readonly listeners = new AbortController();
  private readonly requested = new Map<string, string>();
  private readonly levels = new Map<string, number>();
  private readonly known = new Set<string>();
  private readonly paused = new Set<string>();
  private readonly pending = new Map<string, Promise<unknown>>();
  private unlocked: boolean;
  private disposed = false;

  constructor(private readonly namespace: string, surface: EventTarget,
    private readonly manager: SoundPort = sound) {
    if (!namespace.trim()) throw new RangeError("Audio namespace must not be empty.");
    this.unlocked = unlockedSurfaces.has(surface);
    const unlock = () => {
      if (this.unlocked || this.disposed) return;
      this.unlocked = true;
      unlockedSurfaces.add(surface);
      this.listeners.abort();
      for (const [id, source] of this.requested) this.start(id, source);
    };
    if (!this.unlocked) {
      surface.addEventListener("pointerdown", unlock, { signal: this.listeners.signal });
      surface.addEventListener("keydown", unlock, { signal: this.listeners.signal });
    }
  }

  isPlaying(id: string): boolean {
    this.known.add(id);
    if (this.pending.has(id)) return true;
    if (!this.manager.find(this.alias(id))) return false;
    // Pixi'VN may have recreated tracked media before this scene is composed.
    mediaOwners.set(this.alias(id), this);
    return true;
  }

  play(id: string, source: string): void {
    if (this.disposed) return;
    this.known.add(id);
    mediaOwners.set(this.alias(id), this);
    this.requested.set(id, source);
    if (this.unlocked) this.start(id, source);
  }

  setVolume(id: string, volume: number): void {
    if (this.disposed) return;
    this.known.add(id);
    this.levels.set(id, volume);
    this.channel(id).volume = volume;
  }

  stop(id: string): void {
    this.requested.delete(id);
    this.paused.delete(id);
    const alias = this.alias(id);
    if (mediaOwners.get(alias) !== this) return;
    if (this.manager.find(alias)) this.manager.stop(alias);
    if (!this.pending.has(id)) mediaOwners.delete(alias);
  }
  pause(id: string): void {
    this.paused.add(id);
    if (this.manager.find(this.alias(id))) this.manager.pause(this.alias(id));
  }
  resume(id: string): void {
    this.paused.delete(id);
    if (this.manager.find(this.alias(id))) this.manager.resume(this.alias(id));
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.listeners.abort();
    for (const id of this.known) this.stop(id);
    this.requested.clear();
    this.levels.clear();
    this.paused.clear();
  }

  private alias(id: string): string { return `${this.namespace}:${id}`; }
  private channel(id: string) {
    const alias = `${this.alias(id)}:channel`;
    const existing = this.manager.channels.values.find(channel => channel.alias === alias);
    if (existing) return existing;
    return this.manager.channels.add(alias,
      { background: true, volume: this.levels.get(id) ?? 0 })!;
  }
  private start(id: string, source: string): void {
    if (this.disposed || this.pending.has(id) || this.manager.find(this.alias(id))) return;
    this.channel(id);
    try {
      const load = this.manager.play(this.alias(id), source,
        { channel: `${this.alias(id)}:channel`, loop: true, volume: 1 });
      this.pending.set(id, load);
      void load.then(() => {
        this.pending.delete(id);
        if (this.disposed || !this.requested.has(id)) this.stop(id);
        else if (this.paused.has(id)) this.manager.pause(this.alias(id));
      }, (error: unknown) => {
        this.pending.delete(id);
        console.error("Ambient audio could not start", error);
      });
    } catch (error) { console.error("Ambient audio could not start", error); }
  }
}

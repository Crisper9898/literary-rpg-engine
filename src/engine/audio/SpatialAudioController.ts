import type { Point } from "../movement/MovementController";

export interface AudioZone {
  readonly center: () => Point;
  /** Full gain at or within this distance. */
  readonly innerRadius: number;
  /** Silence at or beyond this distance. */
  readonly outerRadius: number;
}

export interface AudioLayer {
  readonly id: string;
  readonly source: string;
  readonly volume: number;
  readonly zone?: AudioZone;
  /** Layers in one group share gain by descending priority; other groups mix freely. */
  readonly group?: string;
  readonly priority?: number;
  readonly fadeInMS?: number;
  readonly fadeOutMS?: number;
  readonly enabled?: () => boolean;
}

/** Transport only. Pixi'VN or a test adapter owns media and channels. */
export interface AudioOutput {
  isPlaying(id: string): boolean;
  play(id: string, source: string): void;
  setVolume(id: string, volume: number): void;
  stop(id: string): void;
  pause(id: string): void;
  resume(id: string): void;
  dispose(): void;
}

interface LayerState {
  readonly definition: AudioLayer;
  volume: number;
  target: number;
  enabledOverride?: boolean;
  volumeOverride?: number;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Story-neutral spatial mix; fades use simulation time, never media playback time. */
export class SpatialAudioController {
  private readonly layers = new Map<string, LayerState>();
  private paused = false;
  private disposed = false;

  constructor(private readonly listener: () => Point, definitions: readonly AudioLayer[],
    private readonly output: AudioOutput) {
    for (const definition of definitions) {
      const { id, source, volume, zone, priority, fadeInMS, fadeOutMS } = definition;
      if (!id.trim() || !source.trim() || this.layers.has(id) || !Number.isFinite(volume) ||
        volume < 0 || volume > 1 || (priority !== undefined && !Number.isFinite(priority)) ||
        [fadeInMS, fadeOutMS].some((duration) => duration !== undefined &&
          (!Number.isFinite(duration) || duration < 0)) ||
        (zone && (![zone.innerRadius, zone.outerRadius].every(Number.isFinite) ||
          zone.innerRadius < 0 || zone.outerRadius <= zone.innerRadius))) {
        throw new RangeError("Audio layers need unique ids, valid sources, volumes, fades and zones.");
      }
      this.layers.set(id, { definition, volume: 0, target: 0 });
    }
  }

  getLayerState(id: string): Readonly<{ volume: number; target: number }> {
    const state = this.layer(id);
    return { volume: state.volume, target: state.target };
  }

  setEnabled(id: string, enabled: boolean): void { this.layer(id).enabledOverride = enabled; }
  setLayerVolume(id: string, volume: number): void {
    if (!Number.isFinite(volume) || volume < 0 || volume > 1) throw new RangeError("Audio volume must be in [0, 1].");
    this.layer(id).volumeOverride = volume;
  }

  update(elapsedMS: number): void {
    if (this.disposed || this.paused || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
    const position = this.listener();
    if (![position.x, position.y].every(Number.isFinite)) return;
    const raw = new Map<string, number>();
    const groups = new Map<string, LayerState[]>();
    for (const state of this.layers.values()) {
      const definition = state.definition;
      const enabled = state.enabledOverride ?? definition.enabled?.() ?? true;
      let proximity = enabled ? 1 : 0;
      if (proximity && definition.zone) {
        const center = definition.zone.center();
        if (![center.x, center.y].every(Number.isFinite)) proximity = 0;
        else {
          const distance = Math.hypot(position.x - center.x, position.y - center.y);
          const { innerRadius, outerRadius } = definition.zone;
          proximity = clamp01((outerRadius - distance) / (outerRadius - innerRadius));
        }
      }
      raw.set(definition.id, proximity);
      if (definition.group) {
        const group = groups.get(definition.group) ?? [];
        group.push(state);
        groups.set(definition.group, group);
      } else state.target = proximity * (state.volumeOverride ?? definition.volume);
    }
    // A higher-priority zone takes only its available share, leaving a smooth
    // remainder for lower-priority ambience instead of switching it off at an edge.
    for (const group of groups.values()) {
      group.sort((a, b) => (b.definition.priority ?? 0) - (a.definition.priority ?? 0));
      let remainder = 1;
      for (const state of group) {
        const proximity = raw.get(state.definition.id)!;
        state.target = proximity * remainder * (state.volumeOverride ?? state.definition.volume);
        remainder *= 1 - proximity;
      }
    }
    for (const state of this.layers.values()) {
      const { id, source, fadeInMS = 0, fadeOutMS = 0 } = state.definition;
      const duration = state.target > state.volume ? fadeInMS : fadeOutMS;
      const step = duration === 0 ? 1 : elapsedMS / duration;
      state.volume += Math.sign(state.target - state.volume) *
        Math.min(Math.abs(state.target - state.volume), step);
      if (state.volume > 0) {
        if (!this.output.isPlaying(id)) this.output.play(id, source);
        this.output.setVolume(id, state.volume);
      } else if (this.output.isPlaying(id)) {
        this.output.setVolume(id, 0);
        this.output.stop(id);
      }
    }
  }

  pause(): void {
    if (this.paused || this.disposed) return;
    this.paused = true;
    for (const id of this.layers.keys()) if (this.output.isPlaying(id)) this.output.pause(id);
  }
  resume(): void {
    if (!this.paused || this.disposed) return;
    this.paused = false;
    for (const id of this.layers.keys()) if (this.output.isPlaying(id)) this.output.resume(id);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.output.dispose();
  }

  private layer(id: string): LayerState {
    const layer = this.layers.get(id);
    if (!layer) throw new RangeError(`Unknown audio layer: ${id}`);
    return layer;
  }
}

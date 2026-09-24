export interface AtmosphereKeyframe<Channel extends string> {
  readonly progress: number;
  readonly values: Readonly<Record<Channel, number>>;
}

/** Progress drives the atmosphere; elapsed time only softens changes in that input. */
export class AtmosphereController<Channel extends string> {
  private readonly keyframes: readonly AtmosphereKeyframe<Channel>[];
  private readonly channels: readonly Channel[];
  private readonly response: number;
  private readonly values: Record<Channel, number>;
  private currentProgress: number;

  constructor(
    keyframes: readonly AtmosphereKeyframe<Channel>[],
    options: { response?: number; progress?: number } = {},
  ) {
    const response = options.response ?? 1.4;
    const progress = options.progress ?? 0;
    if (!Number.isFinite(response) || response <= 0 || !Number.isFinite(progress)) {
      throw new RangeError("Atmosphere needs a positive finite response and finite initial progress.");
    }
    if (keyframes.length < 2 || keyframes[0].progress !== 0 || keyframes[keyframes.length - 1].progress !== 1) {
      throw new RangeError("Atmosphere needs at least two keyframes spanning progress 0 to 1.");
    }
    const channels = Object.keys(keyframes[0].values) as Channel[];
    let previousProgress = -1;
    for (const frame of keyframes) {
      if (!Number.isFinite(frame.progress) || frame.progress <= previousProgress || frame.progress > 1 ||
        channels.length === 0 || Object.keys(frame.values).length !== channels.length ||
        channels.some((channel) => !Object.hasOwn(frame.values, channel) ||
          !Number.isFinite(frame.values[channel]) || frame.values[channel] < 0 || frame.values[channel] > 1)) {
        throw new RangeError("Atmosphere keyframes must be ordered with matching finite channels in [0, 1].");
      }
      previousProgress = frame.progress;
    }
    this.keyframes = keyframes.map((frame) => ({ progress: frame.progress, values: { ...frame.values } }));
    this.channels = channels;
    this.response = response;
    this.values = { ...keyframes[0].values };
    this.currentProgress = Math.max(0, Math.min(1, progress));
    this.evaluate();
  }

  /** Stable read-only view; no state object is created during updates. */
  get state(): Readonly<Record<Channel, number>> { return this.values; }
  get progress(): number { return this.currentProgress; }

  update(progress: number, elapsedMS: number): void {
    if (!Number.isFinite(progress) || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
    const target = Math.max(0, Math.min(1, progress));
    // Match world simulation stall protection without advancing the journey itself.
    const blend = 1 - Math.exp(-this.response * Math.min(elapsedMS, 50) / 1000);
    this.currentProgress += (target - this.currentProgress) * blend;
    this.evaluate();
  }

  private evaluate(): void {
    let index = 0;
    while (index < this.keyframes.length - 2 && this.currentProgress > this.keyframes[index + 1].progress) index++;
    const from = this.keyframes[index];
    const to = this.keyframes[index + 1];
    const fraction = (this.currentProgress - from.progress) / (to.progress - from.progress);
    const weight = fraction * fraction * (3 - 2 * fraction);
    for (const channel of this.channels) {
      this.values[channel] = weight === 1 ? to.values[channel]
        : from.values[channel] + (to.values[channel] - from.values[channel]) * weight;
    }
  }
}

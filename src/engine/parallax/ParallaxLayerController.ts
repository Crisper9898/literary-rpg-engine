import type { CameraPoint, CameraSize, CameraState } from "../camera/CameraDirector";

export interface ParallaxLayerOptions {
  readonly period: number;
  /** World units/second. Positive travel carries the scenery to the left. */
  readonly speed: number;
  readonly depth: CameraPoint;
  readonly reference: CameraPoint;
}

/** Periodic travel and camera compensation, independent of renderer and story. */
export class ParallaxLayerController {
  private offset = 0;
  private readonly options: ParallaxLayerOptions;

  constructor(options: ParallaxLayerOptions) {
    const { period, speed, depth, reference } = options;
    if (![period, speed, depth.x, depth.y, reference.x, reference.y].every(Number.isFinite) ||
      period <= 0 || depth.x < 0 || depth.y < 0) {
      throw new RangeError("Parallax needs a positive finite period, finite speed/reference and nonnegative depth.");
    }
    this.options = { ...options, depth: { ...depth }, reference: { ...reference } };
  }

  get phase(): number { return this.offset; }

  update(elapsedMS: number): void {
    if (!Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
    const { period, speed } = this.options;
    // Same suspension protection as movement/NPC/camera; never catch up a hidden tab.
    this.offset = ((this.offset + speed * (Math.min(elapsedMS, 50) / 1000)) % period + period) % period;
  }

  layout(camera: Pick<CameraState, "position" | "zoom">, viewport: CameraSize) {
    const { position, zoom } = camera;
    if (![position.x, position.y, zoom, viewport.width, viewport.height].every(Number.isFinite) ||
      zoom <= 0 || viewport.width <= 0 || viewport.height <= 0) {
      throw new RangeError("Parallax camera/viewport must be finite with positive zoom and dimensions.");
    }
    const { period, depth, reference } = this.options;
    // These layers are children of the camera-transformed world. Compensate its
    // movement once, so apparent camera motion is -depth * cameraDelta.
    const x = (1 - depth.x) * (position.x - reference.x) - this.offset;
    const y = (1 - depth.y) * (position.y - reference.y);
    const width = viewport.width / zoom;
    const left = position.x - width / 2;
    const firstTileX = Math.floor((left - x) / period) * period;
    return {
      x, y, firstTileX,
      // Hide pooled neighbours that are entirely outside this camera view.
      tileCount: Math.ceil((left + width - x - firstTileX) / period),
    };
  }
}

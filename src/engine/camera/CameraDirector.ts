export interface CameraPoint { readonly x: number; readonly y: number }
export interface CameraSize { readonly width: number; readonly height: number }
export type CameraTarget = () => CameraPoint;
export interface CameraOptions {
  readonly world: CameraSize;
  readonly viewport: CameraSize;
  readonly position: CameraPoint;
  readonly zoom: number;
  /** Exponential response rate per second; higher values catch up sooner. */
  readonly smoothing: number;
}
export interface CameraState {
  readonly position: CameraPoint;
  readonly zoom: number;
  readonly mode: "follow" | "focus" | "locked";
}

const finitePoint = (point: CameraPoint) => Number.isFinite(point.x) && Number.isFinite(point.y);

/** Transient framing only. No renderer, input, narrative or persistence ownership. */
export class CameraDirector {
  private current: CameraState;
  private readonly world: CameraSize;
  readonly viewport: CameraSize;
  private readonly smoothing: number;
  private readonly minimumZoom: number;
  private desiredZoom: number;
  private target: CameraTarget;
  private player?: CameraTarget;
  private followOffset: CameraPoint = { x: 0, y: 0 };

  constructor({ world, viewport, position, zoom, smoothing }: CameraOptions) {
    if (![world.width, world.height, viewport.width, viewport.height, zoom, smoothing]
      .every((value) => Number.isFinite(value) && value > 0) || !finitePoint(position)) {
      throw new RangeError("Camera dimensions, zoom and smoothing must be finite and positive; position must be finite.");
    }
    this.world = { ...world };
    this.viewport = { ...viewport };
    this.smoothing = smoothing;
    this.minimumZoom = Math.max(viewport.width / world.width, viewport.height / world.height);
    this.desiredZoom = Math.max(zoom, this.minimumZoom);
    const initial = this.constrain(position, this.desiredZoom);
    this.current = { position: initial, zoom: this.desiredZoom, mode: "focus" };
    this.target = () => initial;
  }

  get state(): CameraState { return this.current; }

  follow(target: CameraTarget, offset: CameraPoint = { x: 0, y: 0 }): void {
    if (!finitePoint(offset)) throw new RangeError("Camera offset must be finite.");
    this.player = target;
    this.followOffset = { ...offset };
    this.resumeFollow();
  }

  /** A fixed point produces an eased pan; a provider can track a moving NPC. */
  focus(target: CameraPoint | CameraTarget): void {
    if (typeof target === "function") this.target = target;
    else {
      if (!finitePoint(target)) throw new RangeError("Camera focus must be finite.");
      const point = { ...target };
      this.target = () => point;
    }
    this.current = { ...this.current, mode: "focus" };
  }

  setZoom(zoom: number): void {
    if (!Number.isFinite(zoom) || zoom <= 0) throw new RangeError("Camera zoom must be finite and positive.");
    this.desiredZoom = Math.max(zoom, this.minimumZoom);
  }

  /** Hold position and zoom while the rest of the world continues updating. */
  lock(): void { this.current = { ...this.current, mode: "locked" }; }

  resumeFollow(): void {
    if (!this.player) return;
    this.target = this.player;
    this.current = { ...this.current, mode: "follow" };
  }

  update(elapsedMS: number): CameraState {
    if (this.current.mode === "locked" || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return this.current;
    const amount = -Math.expm1(-this.smoothing * Math.min(elapsedMS, 50) / 1000);
    const zoom = this.current.zoom + (this.desiredZoom - this.current.zoom) * amount;
    const raw = this.target();
    const offset = this.current.mode === "follow" ? this.followOffset : { x: 0, y: 0 };
    const point = { x: raw.x + offset.x, y: raw.y + offset.y };
    // A temporarily unavailable/invalid target cannot poison the world transform.
    const target = this.constrain(finitePoint(point) ? point : this.current.position, zoom);
    const position = this.constrain({
      x: this.current.position.x + (target.x - this.current.position.x) * amount,
      y: this.current.position.y + (target.y - this.current.position.y) * amount,
    }, zoom);
    this.current = { position, zoom, mode: this.current.mode };
    return this.current;
  }

  private constrain(point: CameraPoint, zoom: number): CameraPoint {
    const halfWidth = this.viewport.width / (2 * zoom);
    const halfHeight = this.viewport.height / (2 * zoom);
    return {
      x: Math.max(halfWidth, Math.min(this.world.width - halfWidth, point.x)),
      y: Math.max(halfHeight, Math.min(this.world.height - halfHeight, point.y)),
    };
  }
}

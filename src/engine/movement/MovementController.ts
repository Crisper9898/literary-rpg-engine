import type { WorldLayout } from "../world/worldLayout";

export interface Point { readonly x: number; readonly y: number }
export interface MovementOptions {
  readonly position: Point;
  readonly bounds: WorldLayout["walkableArea"];
  readonly speed: number;
  readonly footprintRadius: number;
}
export interface MovementState {
  readonly position: Point;
  readonly velocity: Point;
  readonly facing: Point;
  readonly isMoving: boolean;
}

export class MovementController {
  private current: MovementState;
  private enabled = true;
  private readonly limits: { left: number; right: number; top: number; bottom: number };
  private readonly speed: number;

  constructor({ position, bounds, speed, footprintRadius: radius }: MovementOptions) {
    if (![position.x, position.y, bounds.x, bounds.y, bounds.width, bounds.height, speed, radius].every(Number.isFinite) ||
        speed <= 0 || radius < 0 || bounds.width <= radius * 2 || bounds.height <= radius * 2) {
      throw new RangeError("Movement requires finite dimensions, positive speed and room for the footprint.");
    }
    this.speed = speed;
    this.limits = { left: bounds.x + radius, right: bounds.x + bounds.width - radius,
      top: bounds.y + radius, bottom: bounds.y + bounds.height - radius };
    this.current = { position: this.constrain(position), velocity: { x: 0, y: 0 }, facing: { x: 0, y: 1 }, isMoving: false };
  }

  get state(): MovementState { return this.current; }

  /** Rehydrate a saved world position without carrying stale movement into the next frame. */
  restore(position: Point): MovementState {
    if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      throw new RangeError("Movement restore requires finite coordinates.");
    }
    this.current = { ...this.current, position: this.constrain(position),
      velocity: { x: 0, y: 0 }, isMoving: false };
    return this.current;
  }

  update(direction: Point, elapsedMS: number): MovementState {
    const length = Math.hypot(direction.x, direction.y);
    if (!this.enabled || !Number.isFinite(elapsedMS) || elapsedMS <= 0 || !Number.isFinite(length) || length === 0) {
      return this.stop();
    }
    // A resumed/blocked tab must not produce a large positional jump.
    const seconds = Math.min(elapsedMS, 50) / 1000;
    const facing = { x: direction.x / length, y: direction.y / length };
    const before = this.current.position;
    const position = this.constrain({ x: before.x + facing.x * this.speed * seconds,
      y: before.y + facing.y * this.speed * seconds });
    const velocity = { x: (position.x - before.x) / seconds, y: (position.y - before.y) / seconds };
    this.current = { position, velocity, facing, isMoving: velocity.x !== 0 || velocity.y !== 0 };
    return this.current;
  }

  /** Dialogue/cinematics may opt out of movement; narration never disables it implicitly. */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stop();
  }

  private stop(): MovementState {
    this.current = { ...this.current, velocity: { x: 0, y: 0 }, isMoving: false };
    return this.current;
  }

  private constrain(point: Point): Point {
    return { x: Math.max(this.limits.left, Math.min(this.limits.right, point.x)),
      y: Math.max(this.limits.top, Math.min(this.limits.bottom, point.y)) };
  }
}

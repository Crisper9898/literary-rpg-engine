import { MovementController, type MovementOptions, type MovementState, type Point } from "../movement/MovementController";

export interface RoutineStop {
  readonly position: Point;
  readonly idleMS: number;
  readonly activity: string;
  readonly facing?: Point;
}
export interface NpcRoutineOptions extends MovementOptions { readonly stops: readonly RoutineStop[] }
export interface NpcRoutineState extends MovementState {
  readonly mode: "idle" | "walking" | "paused";
  readonly activity: string | null;
  readonly stopIndex: number;
  readonly idleRemainingMS: number;
  readonly elapsedMS: number;
}

/** Cyclic authored stops. Movement owns navigation bounds; Pixi'VN owns identity and dialogue. */
export class NpcRoutineController {
  private readonly movement: MovementController;
  private readonly stops: readonly RoutineStop[];
  private readonly speed: number;
  private index = 0;
  private phase: "idle" | "walking" = "walking";
  private paused = false;
  private remaining = 0;
  private elapsed = 0;
  private facing: Point = { x: 0, y: 1 };
  private savedFacing: Point = this.facing;

  constructor(options: NpcRoutineOptions) {
    this.movement = new MovementController(options);
    this.speed = options.speed;
    const { bounds, footprintRadius: r } = options;
    if (options.stops.length === 0) throw new RangeError("An NPC routine needs at least one stop.");
    this.stops = options.stops.map((stop) => {
      const { x, y } = stop.position;
      if (![x, y, stop.idleMS].every(Number.isFinite) || stop.idleMS < 1 || !stop.activity.trim() ||
          x < bounds.x + r || x > bounds.x + bounds.width - r ||
          y < bounds.y + r || y > bounds.y + bounds.height - r) {
        throw new RangeError("NPC stops must fit the footprint bounds and have a finite dwell of at least 1 ms.");
      }
      return { ...stop, position: { x, y }, facing: stop.facing && this.normalized(stop.facing) };
    });
    if (this.distanceToStop() < 1e-7) this.arrive();
  }

  get state(): NpcRoutineState {
    return { ...this.movement.state, facing: this.facing,
      mode: this.paused ? "paused" : this.phase,
      activity: this.phase === "idle" ? this.stops[this.index].activity : null,
      stopIndex: this.index, idleRemainingMS: this.remaining, elapsedMS: this.elapsed };
  }

  /** Compatible with CameraDirector.focus; no camera or renderer dependency. */
  readonly cameraTarget = (): Point => this.movement.state.position;

  pause(): void {
    if (this.paused) return;
    this.savedFacing = this.facing;
    this.paused = true;
    this.movement.setEnabled(false);
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.facing = this.savedFacing;
    this.movement.setEnabled(true);
  }

  face(point: Point): void {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new RangeError("Facing target must be finite.");
    const position = this.movement.state.position;
    const delta = { x: point.x - position.x, y: point.y - position.y };
    if (Math.hypot(delta.x, delta.y) > 1e-7) this.facing = this.normalized(delta);
  }

  update(elapsedMS: number): NpcRoutineState {
    if (this.paused || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return this.state;
    let budget = Math.min(elapsedMS, 50);
    // Carry frame remainder across action boundaries, avoiding FPS-dependent pauses.
    while (budget > 1e-7) {
      if (this.phase === "idle") {
        const used = Math.min(budget, this.remaining);
        this.remaining -= used;
        this.elapsed += used;
        budget -= used;
        if (this.remaining < 1e-7) {
          this.remaining = 0;
          this.index = (this.index + 1) % this.stops.length;
          this.phase = "walking";
          this.elapsed = 0;
        }
      } else {
        const distance = this.distanceToStop();
        if (distance < 1e-7) { this.arrive(); continue; }
        const position = this.movement.state.position;
        const target = this.stops[this.index].position;
        const used = Math.min(budget, distance / this.speed * 1000);
        const motion = this.movement.update({ x: target.x - position.x, y: target.y - position.y }, used);
        this.facing = motion.facing;
        this.elapsed += used;
        budget -= used;
        if (this.distanceToStop() < 1e-7) this.arrive();
      }
    }
    return this.state;
  }

  private distanceToStop(): number {
    const position = this.movement.state.position;
    const target = this.stops[this.index].position;
    return Math.hypot(target.x - position.x, target.y - position.y);
  }

  private arrive(): void {
    this.phase = "idle";
    this.remaining = this.stops[this.index].idleMS;
    this.elapsed = 0;
    this.facing = this.stops[this.index].facing ?? this.facing;
    this.movement.update({ x: 0, y: 0 }, 0);
  }

  private normalized(point: Point): Point {
    const length = Math.hypot(point.x, point.y);
    if (!Number.isFinite(length) || length === 0) throw new RangeError("NPC facing must be a finite nonzero vector.");
    return { x: point.x / length, y: point.y / length };
  }
}

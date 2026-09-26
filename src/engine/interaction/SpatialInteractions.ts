import type { Point } from "../movement/MovementController";

export interface SpatialAction {
  readonly id: string;
  readonly prompt: string;
  readonly target: () => Point;
  readonly range: number;
  readonly priority?: number;
  readonly enabled?: () => boolean;
  readonly execute: () => void | Promise<unknown>;
}

/** Resolves world actions by reach and priority; outcomes belong to the caller. */
export class SpatialInteractions {
  constructor(private readonly origin: () => Point, private readonly actions: readonly SpatialAction[]) {
    for (const action of actions) {
      if (!action.id.trim() || !Number.isFinite(action.range) || action.range < 0 ||
        (action.priority !== undefined && !Number.isFinite(action.priority))) {
        throw new RangeError("Spatial actions need an id, nonnegative range and finite priority.");
      }
    }
  }

  inRange(target: () => Point, range: number): boolean {
    const origin = this.origin();
    const point = target();
    return Number.isFinite(range) && range >= 0 &&
      [origin.x, origin.y, point.x, point.y].every(Number.isFinite) &&
      Math.hypot(origin.x - point.x, origin.y - point.y) <= range;
  }

  available(): SpatialAction | undefined {
    let best: SpatialAction | undefined;
    for (const action of this.actions) {
      if (action.enabled?.() === false || !this.inRange(action.target, action.range)) continue;
      if (!best || (action.priority ?? 0) > (best.priority ?? 0)) best = action;
    }
    return best;
  }
}

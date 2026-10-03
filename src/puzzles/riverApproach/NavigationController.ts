export interface NavigationState {
  progress: number;
  lateral: number;
  heading: number;
  slowMS: number;
  interruptionMS: number;
  contacts: string[];
  whistle: boolean;
}
export interface NavigationOptions {
  length: number; speed: number; steerSpeed: number; radius: number; whistleGate: number;
  obstacles: readonly { id: string; progress: number; lateral: number; radius: number }[];
}
export function validNavigationState(value: unknown): value is NavigationState {
  if (!value || typeof value !== "object") return false;
  const s = value as NavigationState;
  return [s.progress, s.lateral, s.heading, s.slowMS, s.interruptionMS].every(Number.isFinite) &&
    s.progress >= 0 && s.progress <= 1 && Math.abs(s.lateral) <= 1 && Math.abs(s.heading) <= 1 &&
    s.slowMS >= 0 && s.interruptionMS >= 0 && typeof s.whistle === "boolean" &&
    Array.isArray(s.contacts) && s.contacts.every(id => typeof id === "string");
}

/** Slow navigation puzzle only; narrative outcomes and saves belong to content. */
export class NavigationController {
  private current: NavigationState;
  constructor(private readonly options: NavigationOptions, initial: Partial<NavigationState> = {}) {
    if (![options.length, options.speed, options.steerSpeed, options.radius, options.whistleGate].every(Number.isFinite) ||
      options.length <= 0 || options.speed <= 0 || options.steerSpeed <= 0 || options.radius <= 0 || options.radius >= 1 ||
      options.whistleGate <= 0 || options.whistleGate >= 1 ||
      options.obstacles.some(o => ![o.progress, o.lateral, o.radius].every(Number.isFinite) || o.radius < 0))
      throw new RangeError("Navigation requires finite positive dimensions and a bounded channel.");
    this.current = { progress: 0, lateral: 0, heading: 0, slowMS: 0, interruptionMS: 0,
      contacts: [], whistle: false, ...initial };
    this.restore(this.current);
  }
  get state(): Readonly<NavigationState> { return this.current; }
  restore(state: NavigationState): void {
    if (!validNavigationState(state)) throw new RangeError("Invalid navigation checkpoint.");
    this.current = { ...state, contacts: [...state.contacts] };
  }
  interrupt(durationMS: number): void {
    if (Number.isFinite(durationMS) && durationMS > 0) this.current.interruptionMS = durationMS;
  }
  soundWhistle(): void { this.current.whistle = true; }
  update(input: { helm: boolean; steer: number; throttle: number }, elapsedMS: number): Readonly<NavigationState> {
    if (!Number.isFinite(elapsedMS) || elapsedMS <= 0 || ![input.steer, input.throttle].every(Number.isFinite)) return this.state;
    const ms = Math.min(elapsedMS, 100), s = this.current;
    if (s.interruptionMS > 0) { s.interruptionMS = Math.max(0, s.interruptionMS - ms); return this.state; }
    if (!input.helm || s.progress === 1) { s.heading = 0; return this.state; }
    const seconds = ms / 1000;
    s.heading += (Math.max(-1, Math.min(1, input.steer)) - s.heading) * -Math.expm1(-seconds * 2.5);
    const nextLateral = s.lateral + s.heading * this.options.steerSpeed * seconds;
    const limit = 1 - this.options.radius;
    s.lateral = Math.max(-limit, Math.min(limit, nextLateral));
    if (Math.abs(nextLateral) > limit) s.slowMS = Math.max(700, s.slowMS);
    const before = s.progress;
    const throttle = input.throttle > 0 ? 1 : input.throttle < 0 ? .28 : .62;
    const gate = s.whistle ? 1 : this.options.whistleGate;
    s.progress = Math.min(gate, s.progress + this.options.speed / this.options.length * seconds * throttle * (s.slowMS > 0 ? .32 : 1));
    for (const o of this.options.obstacles) {
      if (before <= o.progress && s.progress >= o.progress && !s.contacts.includes(o.id) &&
        Math.abs(s.lateral - o.lateral) < this.options.radius + o.radius) {
        s.contacts.push(o.id); s.slowMS = 1800;
      }
    }
    s.slowMS = Math.max(0, s.slowMS - ms);
    return this.state;
  }
}

import { describe, expect, it } from "vitest";
import { NpcRoutineController, type NpcRoutineOptions } from "../src/engine/npc/NpcRoutineController";

const options: NpcRoutineOptions = {
  position: { x: 20, y: 20 }, bounds: { x: 0, y: 0, width: 200, height: 120 },
  footprintRadius: 10, speed: 100,
  stops: [
    { position: { x: 20, y: 20 }, idleMS: 200, facing: { x: 0, y: 1 }, activity: "work" },
    { position: { x: 120, y: 20 }, idleMS: 300, activity: "look" },
    { position: { x: 80, y: 100 }, idleMS: 150, activity: "rest" },
  ],
};
const advance = (npc: NpcRoutineController, duration: number, delta = 10) => {
  for (let time = 0; time < duration; time += delta) npc.update(Math.min(delta, duration - time));
};

describe("NPC routine", () => {
  it("starts working, waits, walks at its own speed and arrives without oscillation", () => {
    const npc = new NpcRoutineController(options);
    expect(npc.state).toMatchObject({ mode: "idle", activity: "work", position: { x: 20, y: 20 } });
    advance(npc, 190);
    expect(npc.state.position.x).toBe(20);
    advance(npc, 510);
    expect(npc.state).toMatchObject({ mode: "walking", activity: null, facing: { x: 1, y: 0 } });
    expect(npc.state.position.x).toBeCloseTo(70);
    advance(npc, 520);
    expect(npc.state.mode).toBe("idle");
    expect(npc.state.position.x).toBeCloseTo(120);
    expect(npc.state.idleRemainingMS).toBeCloseTo(280);
  });

  it("keeps the same route timing at 30, 60 and 120 fps, including state boundaries", () => {
    const states = [30, 60, 120].map((fps) => {
      const npc = new NpcRoutineController(options);
      advance(npc, 4200, 1000 / fps);
      return npc.state;
    });
    for (const state of states.slice(1)) {
      expect(state.mode).toBe(states[0].mode);
      expect(state.stopIndex).toBe(states[0].stopIndex);
      expect(state.position.x).toBeCloseTo(states[0].position.x, 7);
      expect(state.position.y).toBeCloseTo(states[0].position.y, 7);
    }
  });

  it("completes many triangular cycles with normalized facing and no boundary escapes", () => {
    const npc = new NpcRoutineController(options);
    const visited = new Set<number>();
    let returns = 0;
    let previous = -1;
    for (let frame = 0; frame < 2400; frame++) {
      const state = npc.update(25);
      expect(state.position.x).toBeGreaterThanOrEqual(10);
      expect(state.position.x).toBeLessThanOrEqual(190);
      expect(state.position.y).toBeGreaterThanOrEqual(10);
      expect(state.position.y).toBeLessThanOrEqual(110);
      expect(Math.hypot(state.facing.x, state.facing.y)).toBeCloseTo(1);
      if (state.mode === "idle") {
        visited.add(state.stopIndex);
        if (state.stopIndex === 0 && previous !== 0) returns++;
        previous = state.stopIndex;
      }
    }
    expect([...visited].sort()).toEqual([0, 1, 2]);
    expect(returns).toBeGreaterThan(10);
  });

  it.each([100, 650])("pauses at %i ms, faces a player, then resumes the interrupted action", (time) => {
    const npc = new NpcRoutineController(options);
    const uninterrupted = new NpcRoutineController(options);
    advance(npc, time);
    advance(uninterrupted, time);
    const before = npc.state;
    npc.pause();
    npc.face({ x: before.position.x - 50, y: before.position.y });
    advance(npc, 5000);
    expect(npc.state).toMatchObject({ mode: "paused", position: before.position, facing: { x: -1, y: 0 }, isMoving: false });
    expect(npc.state.idleRemainingMS).toBe(before.idleRemainingMS);
    expect(npc.cameraTarget()).toEqual(before.position);
    npc.resume();
    advance(npc, 800);
    advance(uninterrupted, 800);
    expect(npc.state).toEqual(uninterrupted.state);
  });

  it.each([20, 20.01])("handles a destination at %s without hanging or overshooting", (x) => {
    const npc = new NpcRoutineController({ ...options, stops: [
      { position: { x: 20, y: 20 }, idleMS: 1, activity: "a" },
      { position: { x, y: 20 }, idleMS: 1, activity: "b" },
    ] });
    advance(npc, 1000, 50);
    expect(npc.state.position.x).toBeGreaterThanOrEqual(20);
    expect(npc.state.position.x).toBeLessThanOrEqual(x);
  });

  it("does not jump on stalls or consume idle time for invalid frames", () => {
    const npc = new NpcRoutineController(options);
    const before = npc.state;
    for (const delta of [0, -1, NaN, Infinity]) expect(npc.update(delta)).toEqual(before);
    npc.update(5000);
    expect(npc.state.idleRemainingMS).toBe(150);
  });

  it("rejects empty, unreachable or invalid route data before starting", () => {
    expect(() => new NpcRoutineController({ ...options, stops: [] })).toThrow(RangeError);
    for (const position of [{ x: 0, y: 20 }, { x: 200, y: 20 }, { x: 20, y: NaN }]) {
      expect(() => new NpcRoutineController({ ...options, stops: [{ ...options.stops[0], position }] })).toThrow(RangeError);
    }
    for (const idleMS of [0, -1, Infinity, NaN]) {
      expect(() => new NpcRoutineController({ ...options, stops: [{ ...options.stops[0], idleMS }] })).toThrow(RangeError);
    }
  });
});

import { describe, expect, it } from "vitest";
import { NavigationController, validNavigationState } from "../src/puzzles/riverApproach/NavigationController";

const options = { length: 100, speed: 10, steerSpeed: .6, radius: .07,
  obstacles: [{ id: "log", progress: .2, lateral: 0, radius: .12 }], whistleGate: .86 };
describe("slow river navigation", () => {
  it("needs the helm, steers progressively, stays in the channel and cannot teleport after a stall", () => {
    const c = new NavigationController(options);
    c.update({ helm: false, steer: 1, throttle: 1 }, 1000);
    expect(c.state.progress).toBe(0); expect(c.state.lateral).toBe(0);
    c.update({ helm: true, steer: 1, throttle: 1 }, 1000);
    expect(c.state.progress).toBeLessThan(.03); expect(c.state.lateral).toBeGreaterThan(0);
    for (let i = 0; i < 80; i++) c.update({ helm: true, steer: 1, throttle: -1 }, 100);
    expect(c.state.lateral).toBeLessThanOrEqual(.93);
  });
  it("sweeps obstacles once and slows contacts without killing or reversing the voyage", () => {
    const hit = new NavigationController(options, { progress: .195 });
    hit.update({ helm: true, steer: 0, throttle: 1 }, 100);
    expect(hit.state.contacts).toEqual(["log"]); expect(hit.state.slowMS).toBeGreaterThan(0);
    const before = hit.state.progress;
    for (let i = 0; i < 20; i++) hit.update({ helm: true, steer: 0, throttle: 1 }, 100);
    expect(hit.state.contacts).toEqual(["log"]); expect(hit.state.progress).toBeGreaterThan(before);
    const avoid = new NavigationController(options, { progress: .195, lateral: .5 });
    avoid.update({ helm: true, steer: 0, throttle: 1 }, 100);
    expect(avoid.state.contacts).toEqual([]);
  });
  it("restores the interruption, gates escape on a whistle and ends at exactly one", () => {
    const c = new NavigationController(options, { progress: .65, interruptionMS: 200 });
    c.update({ helm: true, steer: 1, throttle: 1 }, 100);
    expect(c.state.progress).toBe(.65); expect(c.state.interruptionMS).toBe(100);
    c.restore({ ...c.state, progress: .86, interruptionMS: 0 });
    c.update({ helm: true, steer: 0, throttle: 1 }, 100);
    expect(c.state.progress).toBe(.86);
    c.soundWhistle();
    for (let i = 0; i < 80; i++) c.update({ helm: true, steer: 0, throttle: 1 }, 100);
    expect(c.state.progress).toBe(1); expect(validNavigationState(c.state)).toBe(true);
    expect(validNavigationState({ ...c.state, lateral: NaN })).toBe(false);
    expect(validNavigationState({ ...c.state, progress: 2 })).toBe(false);
  });
});

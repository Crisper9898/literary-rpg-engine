import { describe, expect, it } from "vitest";
import { AtmosphereController, type AtmosphereKeyframe } from "../src/engine/weather/AtmosphereController";

type Channel = "fog" | "shade";
const stages: readonly AtmosphereKeyframe<Channel>[] = [
  { progress: 0, values: { fog: 0.05, shade: 0 } },
  { progress: 0.5, values: { fog: 0.4, shade: 0.2 } },
  { progress: 1, values: { fog: 0.8, shade: 0.45 } },
];

describe("progress-driven atmosphere", () => {
  it("reproduces all authored stages and clamps initial progress", () => {
    for (const stage of stages) {
      const controller = new AtmosphereController(stages, { progress: stage.progress });
      expect(controller.state).toEqual(stage.values);
      expect(controller.progress).toBe(stage.progress);
    }
    expect(new AtmosphereController(stages, { progress: -1 }).state).toEqual(stages[0].values);
    expect(new AtmosphereController(stages, { progress: 2 }).state).toEqual(stages[2].values);
  });

  it("interpolates monotonically through the intermediate level without stage jumps", () => {
    let previous = { fog: 0, shade: 0 };
    for (let step = 0; step <= 100; step++) {
      const state = new AtmosphereController(stages, { progress: step / 100 }).state;
      expect(state.fog).toBeGreaterThanOrEqual(previous.fog);
      expect(state.shade).toBeGreaterThanOrEqual(previous.shade);
      expect(state.fog).toBeLessThanOrEqual(0.8);
      previous = state;
    }
    const before = new AtmosphereController(stages, { progress: 0.4999 }).state;
    const after = new AtmosphereController(stages, { progress: 0.5001 }).state;
    expect(after.fog - before.fog).toBeLessThan(0.000001);
    expect(new AtmosphereController(stages, { progress: 0.25 }).state.fog).toBeCloseTo(0.225);
  });

  it("never advances atmosphere from elapsed time alone", () => {
    const controller = new AtmosphereController(stages, { progress: 0.3 });
    const initial = { ...controller.state };
    for (let frame = 0; frame < 7200; frame++) controller.update(0.3, 1000 / 60);
    expect(controller.progress).toBe(0.3);
    expect(controller.state).toEqual(initial);
  });

  it("eases a sudden progress change consistently at 30, 60 and 120 fps", () => {
    const results = [30, 60, 120].map((fps) => {
      const controller = new AtmosphereController(stages);
      for (let frame = 0; frame < fps * 2; frame++) controller.update(1, 1000 / fps);
      return controller;
    });
    expect(results[0].progress).toBeGreaterThan(0.9);
    expect(results[0].progress).toBeLessThan(1);
    for (const controller of results.slice(1)) {
      expect(controller.progress).toBeCloseTo(results[0].progress, 12);
      expect(controller.state.fog).toBeCloseTo(results[0].state.fog, 12);
    }
  });

  it("supports smooth reversal and clamps incoming progress", () => {
    const controller = new AtmosphereController(stages, { progress: 1 });
    const clamped = new AtmosphereController(stages, { progress: 1 });
    controller.update(-10, 50);
    clamped.update(0, 50);
    expect(controller.progress).toBe(clamped.progress);
    expect(controller.progress).toBeGreaterThan(0.9);
    expect(controller.progress).toBeLessThan(1);
    controller.update(10, 50);
    clamped.update(1, 50);
    expect(controller.state).toEqual(clamped.state);
  });

  it("caps suspension stalls and ignores invalid samples", () => {
    const controller = new AtmosphereController(stages);
    const reference = new AtmosphereController(stages);
    controller.update(1, 5000);
    reference.update(1, 50);
    expect(controller.state).toEqual(reference.state);
    for (const elapsed of [NaN, Infinity, -1, 0]) controller.update(1, elapsed);
    for (const progress of [NaN, Infinity, -Infinity]) controller.update(progress, 50);
    expect(controller.state).toEqual(reference.state);
    expect(controller.progress).toBe(reference.progress);
  });

  it("keeps the state object stable and supports future effect channels", () => {
    const controller = new AtmosphereController([
      { progress: 0, values: { fog: 0, rain: 0, stormLight: 1 } },
      { progress: 1, values: { fog: 1, rain: 0.8, stormLight: 0.2 } },
    ]);
    const state = controller.state;
    for (let frame = 0; frame < 240; frame++) controller.update(1, 1000 / 60);
    expect(controller.state).toBe(state);
    expect(state.rain).toBeGreaterThan(0.79);
    expect(state.stormLight).toBeLessThan(0.21);
  });

  it("copies authored data so later caller edits cannot alter the progression", () => {
    const mutable = stages.map((stage) => ({ progress: stage.progress, values: { ...stage.values } }));
    const controller = new AtmosphereController(mutable);
    mutable[2].values.fog = 0;
    mutable[1].progress = 0;
    for (let frame = 0; frame < 240; frame++) controller.update(1, 1000 / 60);
    expect(controller.state.fog).toBeGreaterThan(0.79);
  });

  it("rejects incomplete, unordered or nonfinite authored profiles", () => {
    const invalid: AtmosphereKeyframe<Channel>[][] = [
      [], [stages[0]],
      [{ ...stages[0], progress: 0.1 }, stages[2]],
      [stages[0], { ...stages[2], progress: 0.9 }],
      [stages[0], stages[1], stages[1], stages[2]],
      [stages[0], { ...stages[1], progress: NaN }, stages[2]],
      [stages[0], { ...stages[1], progress: 1.5 }, stages[2]],
      [stages[0], { ...stages[1], values: { fog: Infinity, shade: 0 } }, stages[2]],
      [stages[0], { ...stages[1], values: { fog: -0.1, shade: 0 } }, stages[2]],
      [stages[0], { ...stages[1], values: { fog: 1.1, shade: 0 } }, stages[2]],
    ];
    for (const profile of invalid) expect(() => new AtmosphereController(profile)).toThrow(RangeError);
    expect(() => new AtmosphereController<string>([
      { progress: 0, values: { fog: 0 } },
      { progress: 1, values: { fog: 1, rain: 1 } },
    ])).toThrow(RangeError);
    for (const response of [0, -1, NaN, Infinity]) {
      expect(() => new AtmosphereController(stages, { response })).toThrow(RangeError);
    }
    expect(() => new AtmosphereController(stages, { progress: NaN })).toThrow(RangeError);
  });
});

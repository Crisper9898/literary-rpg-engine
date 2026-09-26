import { describe, expect, it } from "vitest";
import { SpatialInteractions } from "../src/engine/interaction/SpatialInteractions";

describe("spatial interactions", () => {
  it("selects enabled nearby actions by priority without knowing their story meaning", () => {
    let position = { x: 10, y: 10 };
    let examined = false;
    const actions = new SpatialInteractions(() => position, [
      { id: "talk", prompt: "Talk", target: () => ({ x: 14, y: 10 }), range: 8,
        execute: () => undefined },
      { id: "inspect", prompt: "Inspect", target: () => ({ x: 11, y: 10 }), range: 3,
        priority: 10, enabled: () => !examined, execute: () => { examined = true; } },
    ]);
    expect(actions.available()?.id).toBe("inspect");
    actions.available()?.execute();
    expect(examined).toBe(true);
    expect(actions.available()?.id).toBe("talk");
    position = { x: 30, y: 10 };
    expect(actions.available()).toBeUndefined();
    expect(actions.inRange(() => ({ x: 32, y: 10 }), 3)).toBe(true);
  });

  it("ignores invalid targets and rejects unusable action definitions", () => {
    const actions = new SpatialInteractions(() => ({ x: 0, y: 0 }), [
      { id: "hidden", prompt: "Hidden", target: () => ({ x: NaN, y: 0 }), range: 4,
        execute: () => undefined },
    ]);
    expect(actions.available()).toBeUndefined();
    expect(() => new SpatialInteractions(() => ({ x: 0, y: 0 }), [
      { id: "bad", prompt: "Bad", target: () => ({ x: 0, y: 0 }), range: -1,
        execute: () => undefined },
    ])).toThrow(RangeError);
  });
});

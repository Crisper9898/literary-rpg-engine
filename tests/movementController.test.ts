import { describe, expect, it } from "vitest";
import { MovementController } from "../src/engine/movement/MovementController";

const options = {
  position: { x: 650, y: 760 },
  bounds: { x: 400, y: 660, width: 1120, height: 200 },
  speed: 240,
  footprintRadius: 20,
};

describe("movement controller", () => {
  it("restores exact world coordinates, stops stale velocity and constrains bounds", () => {
    const controller = new MovementController(options);
    controller.update({ x: 1, y: 0 }, 50);
    expect(controller.restore({ x: 842.25, y: 733.5 }).position).toEqual({ x: 842.25, y: 733.5 });
    expect(controller.state.velocity).toEqual({ x: 0, y: 0 });
    expect(controller.state.isMoving).toBe(false);
    expect(controller.restore({ x: 9999, y: -100 }).position).toEqual({ x: 1500, y: 680 });
    expect(() => controller.restore({ x: NaN, y: 760 })).toThrow(RangeError);
  });

  it.each([30, 60, 120])("moves 240 units per second at %i fps", (fps) => {
    const controller = new MovementController(options);
    for (let frame = 0; frame < fps; frame++) controller.update({ x: 1, y: 0 }, 1000 / fps);
    expect(controller.state.position.x).toBeCloseTo(890);
    expect(controller.state.position.y).toBe(760);
  });

  it("normalizes diagonal input to the same speed", () => {
    const controller = new MovementController(options);
    controller.update({ x: 1, y: -1 }, 50);
    expect(Math.hypot(controller.state.position.x - 650, controller.state.position.y - 760)).toBeCloseTo(12);
    expect(Math.hypot(controller.state.velocity.x, controller.state.velocity.y)).toBeCloseTo(240);
  });

  it.each([
    [{ x: -1, y: -1 }, { x: 420, y: 680 }],
    [{ x: 1, y: 1 }, { x: 1500, y: 840 }],
  ])("keeps the footprint inside every deck edge", (direction, expected) => {
    const controller = new MovementController(options);
    for (let frame = 0; frame < 300; frame++) controller.update(direction, 50);
    expect(controller.state.position).toEqual(expected);
    expect(controller.state.isMoving).toBe(false);
  });

  it("stops on release and preserves facing for future animation", () => {
    const controller = new MovementController(options);
    controller.update({ x: -1, y: 0 }, 50);
    controller.update({ x: 0, y: 0 }, 50);
    expect(controller.state.position).toEqual({ x: 638, y: 760 });
    expect(controller.state.velocity).toEqual({ x: 0, y: 0 });
    expect(controller.state.facing).toEqual({ x: -1, y: 0 });
    expect(controller.state.isMoving).toBe(false);
  });

  it("caps a stalled frame instead of teleporting", () => {
    const controller = new MovementController(options);
    controller.update({ x: 1, y: 0 }, 5000);
    expect(controller.state.position.x).toBe(662);
  });

  it("can explicitly disable movement without pausing the world", () => {
    const controller = new MovementController(options);
    controller.update({ x: 1, y: 0 }, 50);
    controller.setEnabled(false);
    expect(controller.state.isMoving).toBe(false);
    controller.update({ x: 1, y: 0 }, 50);
    expect(controller.state.position.x).toBe(662);
    controller.setEnabled(true);
    controller.update({ x: 1, y: 0 }, 50);
    expect(controller.state.position.x).toBe(674);
  });

  it.each([0, -1, NaN, Infinity])("ignores unusable elapsed time %s", (delta) => {
    const controller = new MovementController(options);
    controller.update({ x: 1, y: 0 }, delta);
    expect(controller.state.position).toEqual({ x: 650, y: 760 });
  });

  it("rejects a footprint that cannot fit the walkable area", () => {
    expect(() => new MovementController({ ...options, footprintRadius: 101 })).toThrow(RangeError);
  });
});

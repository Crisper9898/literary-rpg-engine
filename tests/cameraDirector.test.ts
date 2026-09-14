import { describe, expect, it } from "vitest";
import { CameraDirector } from "../src/engine/camera/CameraDirector";

const options = {
  world: { width: 2000, height: 1200 }, viewport: { width: 1000, height: 600 },
  position: { x: 1000, y: 600 }, zoom: 1, smoothing: 6,
};
const advance = (camera: CameraDirector, frames = 240) => {
  for (let i = 0; i < frames; i++) camera.update(1000 / 60);
};

describe("camera director", () => {
  it("follows without snapping or overshooting and settles without jitter", () => {
    const target = { x: 1300, y: 700 };
    const camera = new CameraDirector(options);
    camera.follow(() => target);
    const first = camera.update(1000 / 60);
    expect(first.position.x).toBeGreaterThan(1000);
    expect(first.position.x).toBeLessThan(1300);
    expect(first.position.y).toBeGreaterThan(600);
    let last = first.position.x;
    for (let i = 0; i < 240; i++) {
      const { position } = camera.update(1000 / 60);
      expect(position.x).toBeGreaterThanOrEqual(last);
      expect(position.x).toBeLessThanOrEqual(1300);
      last = position.x;
    }
    expect(last).toBeCloseTo(1300, 5);
  });

  it("has the same easing at 30, 60 and 120 fps", () => {
    const positions = [30, 60, 120].map((fps) => {
      const camera = new CameraDirector(options);
      camera.focus({ x: 1400, y: 700 });
      for (let i = 0; i < fps; i++) camera.update(1000 / fps);
      return camera.state.position.x;
    });
    expect(positions[0]).toBeCloseTo(positions[1], 8);
    expect(positions[1]).toBeCloseTo(positions[2], 8);
  });

  it.each([
    [{ x: -100, y: -100 }, { x: 500, y: 300 }],
    [{ x: 2500, y: 2000 }, { x: 1500, y: 900 }],
  ])("keeps the entire view inside the world at an edge", (target, expected) => {
    const camera = new CameraDirector(options);
    camera.focus(target);
    advance(camera);
    expect(camera.state.position.x).toBeCloseTo(expected.x, 5);
    expect(camera.state.position.y).toBeCloseTo(expected.y, 5);
  });

  it("smoothly zooms out while keeping every intermediate view in bounds", () => {
    const camera = new CameraDirector({ ...options, position: { x: 1700, y: 1000 }, zoom: 2 });
    camera.setZoom(0.1);
    const first = camera.update(16);
    expect(first.zoom).toBeLessThan(2);
    expect(first.zoom).toBeGreaterThan(0.5);
    for (let i = 0; i < 300; i++) {
      const { position, zoom } = camera.update(16);
      expect(position.x - 500 / zoom).toBeGreaterThanOrEqual(-1e-6);
      expect(position.x + 500 / zoom).toBeLessThanOrEqual(2000 + 1e-6);
      expect(position.y - 300 / zoom).toBeGreaterThanOrEqual(-1e-6);
      expect(position.y + 300 / zoom).toBeLessThanOrEqual(1200 + 1e-6);
    }
    expect(camera.state.zoom).toBeCloseTo(0.5, 5);
  });

  it("covers a viewport larger than the world without blank borders", () => {
    const camera = new CameraDirector({ ...options, viewport: { width: 3000, height: 2400 } });
    expect(camera.state.zoom).toBe(2);
    expect(camera.state.position).toEqual({ x: 1000, y: 600 });
  });

  it("focuses a moving target, locks framing and resumes the current player with its offset", () => {
    const camera = new CameraDirector(options);
    const player = { x: 1200, y: 700 };
    const npc = { x: 800, y: 500 };
    camera.follow(() => player, { x: 0, y: -100 });
    camera.focus(() => npc);
    npc.x = 700;
    advance(camera);
    expect(camera.state.position.x).toBeCloseTo(700, 5);
    camera.lock();
    const locked = camera.state;
    npc.x = 900;
    camera.setZoom(1.5);
    advance(camera);
    expect(camera.state).toEqual(locked);
    player.x = 1400;
    camera.resumeFollow();
    const first = camera.update(16);
    expect(first.position.x).toBeGreaterThan(700);
    expect(first.position.x).toBeLessThan(1400);
    advance(camera);
    expect(camera.state.position.x).toBeCloseTo(1400, 5);
    expect(camera.state.position.y).toBeCloseTo(600, 5);
    expect(camera.state.zoom).toBeCloseTo(1.5, 5);
  });

  it("ignores invalid frame times and caps a stalled frame", () => {
    const a = new CameraDirector(options);
    const b = new CameraDirector(options);
    a.focus({ x: 1400, y: 700 });
    b.focus({ x: 1400, y: 700 });
    for (const delta of [0, -1, NaN, Infinity]) expect(a.update(delta).position).toEqual(options.position);
    expect(a.update(5000)).toEqual(b.update(50));
  });

  it("rejects invalid dimensions, zoom and targets without corrupting framing", () => {
    expect(() => new CameraDirector({ ...options, smoothing: 0 })).toThrow(RangeError);
    expect(() => new CameraDirector({ ...options, viewport: { width: 0, height: 600 } })).toThrow(RangeError);
    const camera = new CameraDirector(options);
    expect(() => camera.setZoom(NaN)).toThrow(RangeError);
    expect(() => camera.focus({ x: Infinity, y: 0 })).toThrow(RangeError);
    camera.follow(() => ({ x: NaN, y: 600 }));
    expect(camera.update(16).position).toEqual(options.position);
  });
});

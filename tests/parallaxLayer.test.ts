import { describe, expect, it } from "vitest";
import { ParallaxLayerController } from "../src/engine/parallax/ParallaxLayerController";

const options = { period: 1280, speed: 58, depth: { x: 0.4, y: 0.7 }, reference: { x: 960, y: 540 } };
const camera = { position: { x: 900, y: 600 }, zoom: 1.5 };
const viewport = { width: 1920, height: 1080 };

describe("periodic voyage layers", () => {
  it("exposes signed journey distance independently of tile wrapping and camera motion", () => {
    const layer = new ParallaxLayerController({ ...options, period: 10, speed: 100 });
    for (let i = 0; i < 7; i++) layer.update(50);
    expect(layer.distance).toBeCloseTo(35);
    expect(layer.phase).toBeCloseTo(5);
    layer.layout(camera, viewport);
    expect(layer.distance).toBeCloseTo(35);
    for (const dt of [0, -1, NaN, Infinity]) layer.update(dt);
    expect(layer.distance).toBeCloseTo(35);
    const reverse = new ParallaxLayerController({ ...options, speed: -100 });
    reverse.update(1000);
    expect(reverse.distance).toBe(-5);
    const stopped = new ParallaxLayerController({ ...options, speed: 0 });
    stopped.update(50);
    expect(stopped.distance).toBe(0);
  });

  it("travels at the authored speed at 30, 60 and 120fps and wraps without growing coordinates", () => {
    for (const fps of [30, 60, 120]) {
      const layer = new ParallaxLayerController(options);
      for (let i = 0; i < fps * 90; i++) layer.update(1000 / fps);
      expect(layer.phase).toBeCloseTo((58 * 90) % 1280, 6);
      expect(layer.phase).toBeGreaterThanOrEqual(0);
      expect(layer.phase).toBeLessThan(1280);
    }
  });

  it("keeps reverse travel periodic and caps suspension stalls like the existing world simulation", () => {
    const layer = new ParallaxLayerController({ ...options, speed: -100 });
    layer.update(5000);
    expect(layer.phase).toBe(1275);
    for (const dt of [NaN, Infinity, -1, 0]) layer.update(dt);
    expect(layer.phase).toBe(1275);
  });

  it("separates voyage from camera motion and applies the authored depth in screen space", () => {
    const layer = new ParallaxLayerController(options);
    const a = layer.layout(camera, viewport);
    const b = layer.layout({ ...camera, position: { x: 1000, y: 700 } }, viewport);
    expect((b.x - 1000) - (a.x - 900)).toBeCloseTo(-40);
    expect((b.y - 700) - (a.y - 600)).toBeCloseTo(-70);
    layer.update(50);
    const c = layer.layout(camera, viewport);
    expect(c.x - a.x).toBeCloseTo(-2.9);
    expect(c.y).toBe(a.y);
  });

  it("covers both viewport edges at all phases, camera positions and zoom levels", () => {
    const layer = new ParallaxLayerController(options);
    for (const x of [-10000, 0, 420, 1500, 10000]) for (const zoom of [0.5, 1, 1.5, 3]) {
      for (let step = 0; step < 100; step++) {
        layer.update(50);
        const state = layer.layout({ position: { x, y: 600 }, zoom }, viewport);
        const left = x - viewport.width / (2 * zoom);
        const right = x + viewport.width / (2 * zoom);
        expect(state.x + state.firstTileX).toBeLessThanOrEqual(left);
        expect(state.x + state.firstTileX + state.tileCount * options.period).toBeGreaterThanOrEqual(right);
        expect(state.tileCount).toBeLessThanOrEqual(Math.ceil(viewport.width / zoom / options.period) + 2);
      }
    }
  });

  it("wraps by a full tile so the visible repeating pattern is continuous across a seam", () => {
    const layer = new ParallaxLayerController({ ...options, period: 10, speed: 100 });
    layer.update(50);
    const before = layer.layout(camera, viewport);
    layer.update(50);
    const after = layer.layout(camera, viewport);
    const delta = (after.x + after.firstTileX) - (before.x + before.firstTileX);
    expect(((delta + 5) % 10 + 10) % 10).toBeCloseTo(0);
    expect(layer.phase).toBe(0);
  });

  it("renders only tiles intersecting the view, including exact tile edges", () => {
    const layer = new ParallaxLayerController({ ...options, period: 1920, depth: { x: 1, y: 1 } });
    expect(layer.layout({ position: { x: 960, y: 540 }, zoom: 1.5 }, viewport).tileCount).toBe(1);
    expect(layer.layout({ position: { x: 960, y: 540 }, zoom: 1 }, viewport).tileCount).toBe(1);
    expect(layer.layout({ position: { x: 1500, y: 540 }, zoom: 1.5 }, viewport).tileCount).toBe(2);
    layer.update(50);
    expect(layer.layout({ position: { x: 960, y: 540 }, zoom: 1 }, viewport).tileCount).toBe(2);
  });

  it("rejects invalid dimensions and camera inputs rather than poisoning transforms", () => {
    for (const period of [0, -1, NaN, Infinity]) {
      expect(() => new ParallaxLayerController({ ...options, period })).toThrow(RangeError);
    }
    expect(() => new ParallaxLayerController({ ...options, speed: NaN })).toThrow(RangeError);
    expect(() => new ParallaxLayerController({ ...options, depth: { x: -1, y: 1 } })).toThrow(RangeError);
    const layer = new ParallaxLayerController(options);
    expect(() => layer.layout({ ...camera, zoom: 0 }, viewport)).toThrow(RangeError);
    expect(() => layer.layout(camera, { width: Infinity, height: 1080 })).toThrow(RangeError);
  });
});

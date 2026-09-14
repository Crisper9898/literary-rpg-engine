import { expect, it } from "vitest";
import { Container, Ticker, UPDATE_PRIORITY } from "pixi.js";
import { attachWorldCamera } from "../src/engine/camera/attachWorldCamera";

it("updates after movement, before render, and detaches when its world is destroyed", () => {
  const world = new Container();
  const ticker = new Ticker();
  const target = { x: 1000, y: 600 };
  const camera = attachWorldCamera(world, ticker, {
    world: { width: 2000, height: 1200 }, viewport: { width: 1000, height: 600 },
    position: target, zoom: 1.5, smoothing: 6,
  });
  camera.follow(() => target);
  // Even if movement is registered later, the camera consumes this frame's position.
  ticker.add(() => { target.x += 20; });
  let renderedCenter = 0;
  const renderProbe = () => { renderedCenter = world.pivot.x; };
  ticker.add(renderProbe, undefined, UPDATE_PRIORITY.LOW);
  ticker.lastTime = 0;
  ticker.update(16);
  expect(renderedCenter).toBeGreaterThan(1000);
  expect(renderedCenter).toBeLessThan(1020);
  expect(world.x).toBe(500);
  expect(world.y).toBe(300);
  expect(world.scale.x).toBe(1.5);
  const stopped = camera.state;
  ticker.remove(renderProbe);
  world.destroy();
  ticker.update(32);
  expect(camera.state).toEqual(stopped);
  ticker.destroy();
});

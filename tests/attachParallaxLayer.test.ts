import { expect, it } from "vitest";
import { Container, Ticker, UPDATE_PRIORITY } from "pixi.js";
import { attachParallaxLayer } from "../src/engine/parallax/attachParallaxLayer";

it("reads the current camera before render, reuses tiles across wraps/zooms, and disposes with the world", () => {
  const world = new Container();
  const ticker = new Ticker();
  const camera = { state: { position: { x: 960, y: 540 }, zoom: 1.5, mode: "follow" as const },
    viewport: { width: 1920, height: 1080 } };
  let created = 0;
  const { layer, controller } = attachParallaxLayer(world, ticker, camera, {
    id: "river", period: 1280, speed: 100, depth: { x: 0.5, y: 1 }, reference: { x: 960, y: 540 },
    createTile: () => { created++; return new Container(); },
  });
  ticker.add(() => { camera.state.position.x += 10; }, undefined, UPDATE_PRIORITY.NORMAL - 1);
  let renderedX = 0;
  const render = () => { renderedX = layer.x; };
  ticker.add(render, undefined, UPDATE_PRIORITY.LOW);
  ticker.lastTime = 0;
  ticker.update(50);
  expect(controller.phase).toBeCloseTo(5);
  expect(renderedX).toBeCloseTo(0); // +5 camera compensation, -5 voyage.
  expect(created).toBe(2);
  camera.state.zoom = 0.75;
  ticker.update(100);
  expect(created).toBe(3);
  for (let time = 150; time < 15000; time += 50) ticker.update(time);
  expect(created).toBe(3);
  camera.state.zoom = 1.5;
  ticker.update(15000);
  expect(layer.children.filter((tile) => tile.visible)).toHaveLength(2);
  const stopped = controller.phase;
  ticker.remove(render);
  world.destroy({ children: true });
  ticker.update(15050);
  expect(controller.phase).toBe(stopped);
  expect(layer.destroyed).toBe(true);
  ticker.destroy();
});

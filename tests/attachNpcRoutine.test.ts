import { expect, it } from "vitest";
import { Container, Ticker } from "pixi.js";
import { attachNpcRoutine } from "../src/engine/npc/attachNpcRoutine";
import { attachWorldCamera } from "../src/engine/camera/attachWorldCamera";

it("moves a real actor, supplies its pose, supports camera focus and detaches on destruction", () => {
  const ticker = new Ticker();
  const world = new Container();
  const actor = new Container();
  world.addChild(actor);
  let poseX = 0;
  const npc = attachNpcRoutine(actor, ticker, {
    position: { x: 100, y: 100 }, bounds: { x: 0, y: 0, width: 800, height: 600 },
    speed: 100, footprintRadius: 10,
    stops: [{ position: { x: 300, y: 200 }, idleMS: 300, activity: "work" }],
  }, (state) => { poseX = state.position.x; });
  const camera = attachWorldCamera(world, ticker, {
    world: { width: 800, height: 600 }, viewport: { width: 200, height: 100 },
    position: { x: 100, y: 100 }, zoom: 1, smoothing: 6,
  });
  camera.focus(npc.cameraTarget);
  ticker.lastTime = 0;
  ticker.update(50);
  expect(actor.x).toBeGreaterThan(100);
  expect(actor.y).toBeGreaterThan(100);
  expect(poseX).toBe(actor.x);
  expect(camera.state.position.x).toBeGreaterThan(100);
  const before = npc.state;
  world.destroy({ children: true });
  ticker.update(100);
  expect(npc.state).toEqual(before);
  ticker.destroy();
});

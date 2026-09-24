import { expect, it } from "vitest";
import { Container, Ticker } from "pixi.js";
import { attachAtmosphere } from "../src/engine/weather/attachAtmosphere";

it("reads current voyage progress after travel, applies it before render and stops with its owner", () => {
  const owner = new Container();
  const ticker = new Ticker();
  let distance = 0;
  let renderedFog = -1;
  const fog = new Container();
  owner.addChild(fog);
  const weather = attachAtmosphere(owner, ticker, {
    keyframes: [{ progress: 0, values: { fog: 0 } }, { progress: 1, values: { fog: 1 } }],
    progress: () => distance / 100,
    apply: (state) => { fog.alpha = state.fog; },
  });
  ticker.add(() => { distance = 100; }, undefined, -2);
  ticker.add(() => { renderedFog = fog.alpha; }, undefined, -25);
  ticker.lastTime = 0;
  ticker.update(50);
  expect(renderedFog).toBeGreaterThan(0);
  expect(renderedFog).toBeLessThan(.1);
  expect(renderedFog).toBe(weather.state.fog);
  const stopped = weather.progress;
  owner.destroy({ children: true });
  ticker.update(100);
  expect(weather.progress).toBe(stopped);
  ticker.destroy();
});

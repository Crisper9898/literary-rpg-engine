import { Container, Ticker } from "pixi.js";
import { expect, it } from "vitest";
import { attachSpatialAudio } from "../src/engine/audio/attachSpatialAudio";
import type { AudioOutput } from "../src/engine/audio/SpatialAudioController";

it("attaches to the shared ticker and disposes when its scene is destroyed", () => {
  const owner = new Container();
  const ticker = new Ticker();
  const active = new Set<string>();
  let plays = 0;
  let disposed = false;
  const output: AudioOutput = {
    isPlaying: id => active.has(id),
    play: id => { plays++; active.add(id); },
    setVolume: () => {}, stop: id => { active.delete(id); },
    pause: () => {}, resume: () => {},
    dispose: () => { disposed = true; active.clear(); },
  };
  const controller = attachSpatialAudio(owner, ticker, new EventTarget(), {
    namespace: "test-room", listener: () => ({ x: 0, y: 0 }),
    layers: [{ id: "room", source: "room.wav", volume: 0.5 }], output,
  });
  expect(plays).toBe(1);
  ticker.update(50);
  expect(controller.getLayerState("room").volume).toBe(0.5);
  owner.destroy();
  ticker.update(100);
  expect(disposed).toBe(true);
  expect(active.size).toBe(0);
  expect(plays).toBe(1);
  ticker.destroy();
});

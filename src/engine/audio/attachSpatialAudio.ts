import type { Container, Ticker } from "pixi.js";
import type { Point } from "../movement/MovementController";
import { PixiVnAudioOutput } from "./PixiVnAudioOutput";
import { SpatialAudioController, type AudioLayer, type AudioOutput } from "./SpatialAudioController";

/** Bind a story-provided soundscape to any position source and scene lifetime. */
export function attachSpatialAudio(owner: Container, ticker: Ticker, surface: EventTarget, options: {
  namespace: string;
  listener: () => Point;
  layers: readonly AudioLayer[];
  output?: AudioOutput;
}): SpatialAudioController {
  const output = options.output ?? new PixiVnAudioOutput(options.namespace, surface);
  const controller = new SpatialAudioController(options.listener, options.layers, output);
  const update = (frame: Ticker) => controller.update(frame.deltaMS);
  ticker.add(update, undefined, -4);
  owner.once("destroyed", () => {
    ticker.remove(update);
    controller.dispose();
  });
  controller.update(0.001);
  return controller;
}

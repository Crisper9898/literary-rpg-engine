import { type Container, type Ticker } from "pixi.js";
import { AtmosphereController, type AtmosphereKeyframe } from "./AtmosphereController";

/** The caller supplies voyage/zone progress and maps channels to its own effects. */
export function attachAtmosphere<Channel extends string>(owner: Container, ticker: Ticker, options: {
  keyframes: readonly AtmosphereKeyframe<Channel>[];
  progress: () => number;
  apply: (state: Readonly<Record<Channel, number>>) => void;
}) {
  const controller = new AtmosphereController(options.keyframes, { progress: options.progress() });
  const update = (frame: Ticker) => {
    controller.update(options.progress(), frame.deltaMS);
    options.apply(controller.state);
  };
  options.apply(controller.state);
  // Read this frame's voyage after parallax (-2), before rendering (-25).
  ticker.add(update, undefined, -3);
  owner.once("destroyed", () => ticker.remove(update));
  return controller;
}

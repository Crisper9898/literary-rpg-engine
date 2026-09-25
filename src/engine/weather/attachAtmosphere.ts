import { type Container, type Ticker } from "pixi.js";
import { AtmosphereController, type AtmosphereKeyframe } from "./AtmosphereController";
import type { CheckpointChannel } from "../world/CheckpointChannel";

/** The caller supplies voyage/zone progress and maps channels to its own effects. */
export function attachAtmosphere<Channel extends string>(owner: Container, ticker: Ticker, options: {
  keyframes: readonly AtmosphereKeyframe<Channel>[];
  progress: () => number;
  apply: (state: Readonly<Record<Channel, number>>) => void;
  checkpoint?: CheckpointChannel<number>;
}) {
  const saved = options.checkpoint?.read();
  const controller = new AtmosphereController(options.keyframes, { progress: saved ?? options.progress() });
  let lastWritten = controller.progress;
  options.checkpoint?.write(lastWritten);
  const update = (frame: Ticker) => {
    const restored = options.checkpoint?.read();
    if (restored !== undefined && restored !== lastWritten) controller.restoreProgress(restored);
    controller.update(options.progress(), frame.deltaMS);
    if (options.checkpoint && controller.progress !== lastWritten) {
      lastWritten = controller.progress;
      options.checkpoint.write(lastWritten);
    }
    options.apply(controller.state);
  };
  options.apply(controller.state);
  // Read this frame's voyage after parallax (-2), before rendering (-25).
  ticker.add(update, undefined, -3);
  owner.once("destroyed", () => ticker.remove(update));
  return controller;
}

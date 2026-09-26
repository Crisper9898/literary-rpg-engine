import type { Container, Ticker } from "pixi.js";
import { MovementController, type MovementOptions } from "./MovementController";
import { keyboardMovement, type MovementBindings } from "./keyboardMovement";
import type { CheckpointChannel } from "../world/CheckpointChannel";
import type { Point } from "./MovementController";

/** Uses the existing Pixi'VN application's ticker. No second render loop. */
export function attachPlayerMovement(actor: Container, ticker: Ticker, surface: HTMLElement,
  options: MovementOptions, checkpoint?: CheckpointChannel<Point>, bindings?: MovementBindings) {
  const controller = new MovementController(options);
  const saved = checkpoint?.read();
  if (saved) controller.restore(saved);
  let lastWritten = { ...controller.state.position };
  checkpoint?.write(lastWritten);
  const input = keyboardMovement(surface, bindings);
  const update = (frame: Ticker) => {
    const restored = checkpoint?.read();
    if (restored && (restored.x !== lastWritten.x || restored.y !== lastWritten.y)) {
      controller.restore(restored);
    }
    const { position } = controller.update(input.read(), frame.deltaMS);
    actor.position.set(position.x, position.y);
    if (checkpoint && (position.x !== lastWritten.x || position.y !== lastWritten.y)) {
      lastWritten = { ...position };
      checkpoint.write(lastWritten);
    }
  };
  actor.position.set(controller.state.position.x, controller.state.position.y);
  ticker.add(update);
  actor.once("destroyed", () => {
    ticker.remove(update);
    input.dispose();
  });
  return controller;
}

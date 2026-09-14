import type { Container, Ticker } from "pixi.js";
import { MovementController, type MovementOptions } from "./MovementController";
import { keyboardMovement } from "./keyboardMovement";

/** Uses the existing Pixi'VN application's ticker. No second render loop. */
export function attachPlayerMovement(actor: Container, ticker: Ticker, surface: HTMLElement, options: MovementOptions) {
  const controller = new MovementController(options);
  const input = keyboardMovement(surface);
  const update = (frame: Ticker) => {
    const { position } = controller.update(input.read(), frame.deltaMS);
    actor.position.set(position.x, position.y);
  };
  actor.position.set(controller.state.position.x, controller.state.position.y);
  ticker.add(update);
  actor.once("destroyed", () => {
    ticker.remove(update);
    input.dispose();
  });
  return controller;
}

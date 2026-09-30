import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";

/** Small presentation-only gait layered over the existing movement controller. */
export function attachMarlowArt(actor: Container, ticker: Ticker): void {
  const sprite = actor.getChildByLabel("marlow-art") as Container;
  const scale = sprite.scale.y;
  let previous = { x: actor.x, y: actor.y };
  let elapsedMS = 0;
  let facing = 1;
  const update = (frame: Ticker) => {
    const dx = actor.x - previous.x;
    const dy = actor.y - previous.y;
    const moving = Math.hypot(dx, dy) > 0.05;
    if (Math.abs(dx) > 0.05) facing = Math.sign(dx);
    elapsedMS += frame.deltaMS;
    const gait = moving ? Math.sin(elapsedMS * 0.019) : 0;
    sprite.scale.x = scale * facing;
    sprite.y = moving ? -Math.abs(gait) * 2 : 0;
    sprite.rotation = moving ? Math.max(-0.045, Math.min(0.045, dx * 0.003)) : 0;
    previous = { x: actor.x, y: actor.y };
  };
  ticker.add(update, undefined, UPDATE_PRIORITY.NORMAL - 1);
  actor.once("destroyed", () => ticker.remove(update));
}

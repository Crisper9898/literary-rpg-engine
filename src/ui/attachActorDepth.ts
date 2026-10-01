import { Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";

/** Painter order follows an actor's feet; the scene still owns movement and collisions. */
export function attachActorDepth(layer: Container, ticker: Ticker, actors: readonly Container[]) {
  layer.sortableChildren = true;
  const update = () => {
    let changed = false;
    for (const actor of actors) {
      if (actor.zIndex !== actor.y) {
        actor.zIndex = actor.y;
        changed = true;
      }
    }
    if (changed) layer.sortChildren();
  };
  update();
  ticker.add(update, undefined, UPDATE_PRIORITY.NORMAL - 3);
  layer.once("destroyed", () => ticker.remove(update));
}

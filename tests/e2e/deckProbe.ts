import { canvas } from "@drincs/pixi-vn";
import { UPDATE_PRIORITY, type Container, type Ticker } from "pixi.js";

// Served only by Vite during E2E, never imported into the application bundle.
export function inspectDeck() {
  const layer = canvas.layers.get("journey-deck");
  if (!layer) return null;
  const world = layer.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  return {
    layers: world.children.map((child) => child.label),
    actors: actors.children.map((child) => ({ id: child.label, x: child.x, y: child.y })),
    title: layer.getChildByLabel("deck-title")?.label,
  };
}

/** Measure the live actor after the movement callback, without using controller math. */
export function pauseMovementSampling(): void {
  canvas.app.ticker.stop();
}

export function measureMovementFrames(frameCount = 6): Promise<{ distance: number; seconds: number }> {
  const layer = canvas.layers.get("journey-deck")!;
  const world = layer.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const actor = actors.getChildByLabel("playerSpawn")!;
  const ticker = canvas.app.ticker;
  return new Promise((resolve, reject) => {
    let previous = { x: actor.x, y: actor.y };
    let distance = 0;
    let seconds = 0;
    let frames = 0;
    const cleanup = () => { ticker.remove(sample); clearTimeout(timeout); };
    const sample = (frame: Ticker) => {
      distance += Math.hypot(actor.x - previous.x, actor.y - previous.y);
      seconds += Math.min(frame.deltaMS, 50) / 1000;
      previous = { x: actor.x, y: actor.y };
      if (++frames === frameCount) {
        cleanup();
        resolve({ distance, seconds });
      }
    };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Movement sampling timed out")); }, 5000);
    ticker.add(sample, undefined, UPDATE_PRIORITY.LOW);
    ticker.start();
  });
}

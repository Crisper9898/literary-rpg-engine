import { canvas } from "@drincs/pixi-vn";
import { Graphics, UPDATE_PRIORITY, type Container, type Ticker } from "pixi.js";

// Served only by Vite during E2E, never imported into the application bundle.
export function inspectDeck() {
  if (!document.querySelector("#root canvas")) return null;
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

export function inspectJourneyStaging() {
  const scene = canvas.layers.get("journey-deck")!;
  const world = scene.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const environment = world.getChildByLabel("environment") as Container;
  const player = actors.getChildByLabel("playerSpawn") as Container;
  const deckhand = actors.getChildByLabel("journey-deckhand") as Container;
  const ground = world.getChildByLabel("ground") as Container;
  const foreground = world.getChildByLabel("foreground") as Container;
  return {
    inkedRiver: environment.getChildByLabel("river-base") instanceof Graphics,
    inkedDeck: ground.getChildByLabel("deck-surface") instanceof Graphics,
    riverBeat: ground.getChildByLabel("river-beat-light") instanceof Graphics,
    cargoBeat: ground.getChildByLabel("cargo-beat-light") instanceof Graphics,
    foregroundRail: foreground.getChildByLabel("deck-fittings") instanceof Graphics,
    marlowHeight: player.getChildByLabel("marlow-art")?.height ?? 0,
    deckhandHeight: deckhand.getChildByLabel("deckhand-body")?.height ?? 0,
  };
}

export function inspectJourneyBeat() {
  const scene = canvas.layers.get("journey-deck")!;
  const world = scene.getChildByLabel("world") as Container;
  const ground = world.getChildByLabel("ground") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const player = actors.getChildByLabel("playerSpawn") as Container;
  const deckhand = actors.getChildByLabel("journey-deckhand") as Container;
  return {
    river: ground.getChildByLabel("river-beat-light")!.alpha,
    cargo: ground.getChildByLabel("cargo-beat-light")!.alpha,
    title: scene.getChildByLabel("deck-title")!.alpha,
    playerName: player.getChildByLabel("marlow-name")!.alpha,
    deckhandName: deckhand.getChildByLabel("deckhand-name")!.alpha,
  };
}

/** Measure the live actor after the movement callback, without using controller math. */
export function pauseMovementSampling(): void {
  canvas.app.ticker.stop();
}

export function measureMovementFrames(frameCount = 6): Promise<{
  distance: number; seconds: number; simultaneousFrames: number;
}> {
  const layer = canvas.layers.get("journey-deck")!;
  const world = layer.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const actor = actors.getChildByLabel("playerSpawn")!;
  const npc = actors.getChildByLabel("journey-deckhand")!;
  const ticker = canvas.app.ticker;
  return new Promise((resolve, reject) => {
    let previous = { x: actor.x, y: actor.y };
    let previousNpc = { x: npc.x, y: npc.y };
    let simultaneousFrames = 0;
    let distance = 0;
    let seconds = 0;
    let frames = 0;
    const cleanup = () => { ticker.remove(sample); clearTimeout(timeout); };
    const sample = (frame: Ticker) => {
      const moved = Math.hypot(actor.x - previous.x, actor.y - previous.y);
      if (moved > 0 && Math.hypot(npc.x - previousNpc.x, npc.y - previousNpc.y) > 0) simultaneousFrames++;
      distance += moved;
      previousNpc = { x: npc.x, y: npc.y };
      seconds += Math.min(frame.deltaMS, 50) / 1000;
      previous = { x: actor.x, y: actor.y };
      if (++frames === frameCount) {
        cleanup();
        resolve({ distance, seconds, simultaneousFrames });
      }
    };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Movement sampling timed out")); }, 5000);
    ticker.add(sample, undefined, UPDATE_PRIORITY.LOW);
    ticker.start();
  });
}

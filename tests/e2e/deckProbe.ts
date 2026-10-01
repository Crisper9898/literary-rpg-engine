import { canvas } from "@drincs/pixi-vn";
import { Graphics, Sprite, UPDATE_PRIORITY, type Container, type Ticker } from "pixi.js";

// Served only by Vite during E2E, never imported into the application bundle.
export function inspectDeck() {
  if (!document.querySelector("#root canvas")) return null;
  const layer = canvas.layers.get("journey-deck");
  if (!layer) return null;
  const world = layer.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  return {
    layers: world.children.map((child) => child.label),
    actors: ["playerSpawn", "journey-deckhand"].map((id) => {
      const child = actors.getChildByLabel(id)!;
      return { id, x: child.x, y: child.y };
    }),
    title: layer.getChildByLabel("deck-title")?.label,
  };
}

export function inspectJourneyDepth() {
  const scene = canvas.layers.get("journey-deck")!;
  const world = scene.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  return actors.children.map((actor) => ({ id: actor.label, y: actor.y, zIndex: actor.zIndex }));
}

export function inspectJourneyArtSlots() {
  const scene = canvas.layers.get("journey-deck")!;
  const world = scene.getChildByLabel("world") as Container;
  const environment = world.getChildByLabel("environment") as Container;
  const ground = world.getChildByLabel("ground") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const foreground = world.getChildByLabel("foreground") as Container;
  const moving = (parent: Container, id: string) =>
    (parent.getChildByLabel(`parallax-${id}`) as Container)?.children[0] as Container | undefined;
  const slots: [string, Container | null | undefined, string][] = [
    ["skyWater", environment.getChildByLabel("river-base"), "river-base"],
    ["distantRidge", moving(environment, "distant-ridge"), "distantRidge-art"],
    ["farVegetation", moving(environment, "far-vegetation"), "farVegetation-art"],
    ["nearBank", moving(environment, "near-bank"), "nearBank-art"],
    ["riverCurrent", moving(environment, "river-current"), "riverCurrent-art"],
    ["foregroundReeds", moving(foreground, "foreground-reeds"), "foreground-reeds-art"],
    ["deckBase", ground.getChildByLabel("deck-surface"), "deck-surface"],
    ["deckFittings", foreground.getChildByLabel("deck-fittings"), "deck-fittings"],
    ["cargo", ground.getChildByLabel("cargo-art"), "cargo-art"],
    ["marlowSheet", actors.getChildByLabel("playerSpawn")?.getChildByLabel("marlow-art"), "marlow-art"],
    ["deckhandSheet", actors.getChildByLabel("journey-deckhand")?.getChildByLabel("deckhand-body"), "deckhand-body"],
  ];
  return Object.fromEntries(slots.map(([key, container, label]) => [key,
    container?.getChildByLabel(`${label}-image`) instanceof Sprite &&
      !container?.getChildByLabel(`${label}-fallback`)?.visible]));
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
    inkedRiver: environment.getChildByLabel("river-base")?.getChildByLabel("river-base-image") instanceof Sprite,
    inkedDeck: ground.getChildByLabel("deck-surface")?.getChildByLabel("deck-surface-image") instanceof Sprite,
    riverBeat: ground.getChildByLabel("river-beat-light") instanceof Graphics,
    cargoBeat: ground.getChildByLabel("cargo-beat-light") instanceof Graphics,
    foregroundRail: foreground.getChildByLabel("deck-fittings")?.getChildByLabel("deck-fittings-image") instanceof Sprite,
    marlowHeight: player.getChildByLabel("marlow-art")?.height ?? 0,
    deckhandHeight: deckhand.getChildByLabel("deckhand-body")?.height ?? 0,
    noActorNameTags: !player.getChildByLabel("marlow-name") && !deckhand.getChildByLabel("deckhand-name"),
  };
}

export function inspectJourneyBeat() {
  const scene = canvas.layers.get("journey-deck")!;
  const world = scene.getChildByLabel("world") as Container;
  const ground = world.getChildByLabel("ground") as Container;
  return {
    river: ground.getChildByLabel("river-beat-light")!.alpha,
    cargo: ground.getChildByLabel("cargo-beat-light")!.alpha,
    title: scene.getChildByLabel("deck-title")!.alpha,
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

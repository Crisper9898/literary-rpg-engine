import { canvas } from "@drincs/pixi-vn";
import type { Container } from "pixi.js";

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

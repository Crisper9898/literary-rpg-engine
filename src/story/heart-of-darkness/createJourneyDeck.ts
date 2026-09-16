import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { journeyDeck } from "./deck";
import { drawDeckScenery } from "./deckScenery";
import { createDeckhand } from "./createDeckhand";

export function createJourneyDeck() {
  validateWorldLayout(journeyDeck);
  const presentation = new Container({ label: "journey-deck" });
  const layers = createWorldLayers();
  drawDeckScenery(layers);
  presentation.addChild(layers.root);

  const captions = {
    playerSpawn: { text: "Marlow", color: 0xdfc495 },
  };
  for (const [id, point] of Object.entries(journeyDeck.anchors)) {
    if (id !== "playerSpawn") continue;
    const caption = captions[id as keyof typeof captions];
    const marker = new Container({ label: id, x: point.x, y: point.y });
    const shape = new Graphics().ellipse(0, 8, 20, 7).fill({ color: 0x101e21, alpha: 0.5 });
    shape.roundRect(-12, -32, 24, 37, 6).fill(caption.color)
      .circle(0, -44, 11).fill(caption.color);
    const name = new Text({ text: caption.text, style: { fontFamily: "Arial", fontSize: 18, fill: caption.color } });
    name.anchor.set(0.5, 0);
    name.y = 32;
    marker.addChild(shape, name);
    layers.actors.addChild(marker);
  }
  const deckhand = createDeckhand();
  layers.actors.addChild(deckhand.actor);

  const text = (label: string, content: string, x: number, y: number, fontSize: number, fill: number, serif = false) => {
    const item = new Text({ label, text: content, x, y,
      style: { fontFamily: serif ? "Georgia" : "Arial", fontSize, fill } });
    presentation.addChild(item);
  };
  text("chapter-kicker", "I  /  THE JOURNEY", 160, 135, 20, 0xb6b996);
  text("deck-title", "Heart of Darkness", 155, 175, 68, 0xeee5cf, true);
  text("deck-subtitle", "La cubierta · Un viaje río arriba", 160, 270, 24, 0xa3b4aa);
  text("blockout-note", "WASD / FLECHAS · Camina    E · Habla y continúa    1 / 2 · Responde    |    Haz clic en la cubierta para volver.", 160, 1000, 18, 0x9cb3ad);
  const player = layers.actors.getChildByLabel("playerSpawn");
  if (!player) throw new Error("Journey deck is missing its player marker.");
  return { presentation, player, world: layers.root, deckhand };
}

import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { journeyDeck } from "./deck";
import { drawDeckScenery } from "./deckScenery";

export function createJourneyDeck() {
  validateWorldLayout(journeyDeck);
  const presentation = new Container({ label: "journey-deck" });
  const layers = createWorldLayers();
  drawDeckScenery(layers);
  presentation.addChild(layers.root);

  const captions = {
    playerSpawn: { text: "Marlow", color: 0xdfc495 },
    npcStation: { text: "NPC · puesto", color: 0xa0bdb2 },
    cameraFocus: { text: "Foco de cámara", color: 0x93b2bd },
  };
  for (const [id, point] of Object.entries(journeyDeck.anchors)) {
    const caption = captions[id as keyof typeof captions];
    const marker = new Container({ label: id, x: point.x, y: point.y });
    const shape = new Graphics().ellipse(0, 8, 20, 7).fill({ color: 0x101e21, alpha: 0.5 });
    if (id === "cameraFocus") {
      shape.circle(0, 0, 17).stroke({ color: caption.color, width: 2 });
      shape.moveTo(-24, 0).lineTo(24, 0).moveTo(0, -24).lineTo(0, 24)
        .stroke({ color: caption.color, width: 2 });
    } else {
      shape.roundRect(-12, -32, 24, 37, 6).fill(caption.color)
        .circle(0, -44, 11).fill(caption.color);
    }
    const name = new Text({ text: caption.text, style: { fontFamily: "Arial", fontSize: 18, fill: caption.color } });
    name.anchor.set(0.5, 0);
    name.y = 32;
    marker.addChild(shape, name);
    layers.actors.addChild(marker);
  }

  const text = (label: string, content: string, x: number, y: number, fontSize: number, fill: number, serif = false) => {
    const item = new Text({ label, text: content, x, y,
      style: { fontFamily: serif ? "Georgia" : "Arial", fontSize, fill } });
    presentation.addChild(item);
  };
  text("chapter-kicker", "I  /  THE JOURNEY", 160, 135, 20, 0xb6b996);
  text("deck-title", "Heart of Darkness", 155, 175, 68, 0xeee5cf, true);
  text("deck-subtitle", "La cubierta · primera composición del mundo", 160, 270, 24, 0xa3b4aa);
  text("walkable-caption", "ÁREA TRANSITABLE", 600, 632, 15, 0xd1d2b0);
  text("blockout-note", "WASD / FLECHAS  ·  Mueve a Marlow por la cubierta.  |  Haz clic en el juego para recuperar el control.", 160, 1000, 18, 0x9cb3ad);
  const player = layers.actors.getChildByLabel("playerSpawn");
  if (!player) throw new Error("Journey deck is missing its player marker.");
  return { presentation, player };
}

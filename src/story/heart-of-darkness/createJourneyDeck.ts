import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { validateWorldLayout } from "../../engine/world/worldLayout";
import { journeyDeck } from "./deck";
import { drawDeckScenery } from "./deckScenery";
import { createDeckhand } from "./createDeckhand";
import { journeyVisual as art } from "./journeyVisual";

export function createJourneyDeck() {
  validateWorldLayout(journeyDeck);
  const presentation = new Container({ label: "journey-deck" });
  const layers = createWorldLayers();
  const visual = drawDeckScenery(layers);
  presentation.addChild(layers.root);

  const marker = new Container({ label: "playerSpawn", ...journeyDeck.anchors.playerSpawn });
  const marlow = new Container({ label: "marlow-art" });
  marlow.addChild(new Graphics()
    .poly([-19, -17, -12, 0, -2, 0, 0, -39, -17, -39]).fill(art.ink)
    .poly([5, -39, 22, -39, 20, 0, 6, 0]).fill(art.ink)
    .poly([-20, -24, -3, -22, -2, -5, -20, -5]).fill(0x555449)
    .poly([6, -23, 21, -24, 18, -6, 6, -6]).fill(0x555449)
    .poly([-24, -75, 22, -78, 31, -20, 9, -21, 0, -42, -12, -19, -30, -23])
      .fill(0x292d29).stroke({ color: art.ink, width: 4 })
    .poly([-19, -69, -8, -73, -2, -43, -15, -33]).fill(0x727364)
    .poly([4, -74, 16, -75, 15, -38, 5, -42]).fill(0x4c544b)
    .poly([-15, -32, 0, -43, 15, -32, 27, -20, -30, -20]).fill(art.ink)
    .poly([-30, -77, -20, -83, -12, -51, -20, -40, -32, -48]).fill(0x383c35)
    .poly([21, -83, 31, -77, 34, -50, 24, -39, 17, -51]).fill(0x383c35)
    .ellipse(-23, -43, 7, 6).fill(0x96886d)
    .ellipse(28, -42, 7, 6).fill(0x96886d)
    .ellipse(0, -94, 15, 18).fill(0x9c8b72).stroke({ color: art.ink, width: 3 })
    .poly([-18, -111, 13, -111, 18, -103, -15, -103]).fill(art.ink)
    .poly([-8, -79, 0, -67, 8, -80]).fill(art.paper)
    .moveTo(4, -94).lineTo(11, -91).stroke({ color: art.ink, width: 2 }));
  marker.addChild(new Graphics().ellipse(11, 5, 38, 9).fill({ color: art.ink, alpha: 0.58 })
    .ellipse(-5, 2, 18, 3).fill({ color: art.ember, alpha: 0.14 }), marlow);
  layers.actors.addChild(marker);
  const deckhand = createDeckhand();
  layers.actors.addChild(deckhand.actor);

  const text = (label: string, content: string, x: number, y: number, fontSize: number, fill: number, serif = false) => {
    const item = new Text({ label, text: content, x, y,
      style: { fontFamily: serif ? "Georgia" : "Arial", fontSize, fill } });
    presentation.addChild(item);
    return item;
  };
  const kicker = text("chapter-kicker", "I  /  EL VIAJE", 160, 125, 18, art.brass);
  const title = text("deck-title", "Heart of Darkness", 155, 160, 58, art.paper, true);
  const subtitle = text("deck-subtitle", "Una voz entre el vapor y la orilla", 160, 245, 22, art.mist, true);
  const player = layers.actors.getChildByLabel("playerSpawn");
  if (!player) throw new Error("Journey deck is missing its player marker.");
  return { presentation, player, world: layers.root, deckhand, layers,
    visual: { setBeat(beat: Parameters<typeof visual.setBeat>[0]) {
      visual.setBeat(beat);
      const alpha = beat === "voyage" ? 1 : 0.3;
      kicker.alpha = alpha;
      title.alpha = alpha;
      subtitle.alpha = alpha;
    } } };
}

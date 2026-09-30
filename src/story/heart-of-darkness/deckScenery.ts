import { Graphics, Text } from "pixi.js";
import type { createWorldLayers } from "../../engine/world/createWorldLayers";
import { journeyDeck } from "./deck";
import { journeyVisual as art, type JourneyVisualBeat } from "./journeyVisual";

/** A single ink-and-wash theatre set; traveling river silhouettes remain separate. */
export function drawDeckScenery(layers: ReturnType<typeof createWorldLayers>) {
  const { width, height } = journeyDeck.size;
  const background = new Graphics({ label: "river-base" })
    .rect(0, 0, width, height).fill(art.ink)
    .rect(0, 0, width, 345).fill(0x3c4940)
    .poly([0, 270, 270, 230, 620, 255, 860, 205, 1240, 245, 1530, 195, 1920, 240,
      1920, 410, 0, 410]).fill(0x536050)
    .rect(0, 410, width, height - 410).fill(art.deepWater);
  // A broken band of hot light leads the eye downriver without a painted focal tree.
  background.poly([680, 348, 880, 344, 1090, 350, 1220, 365, 950, 375, 650, 370])
    .fill({ color: art.ember, alpha: 0.27 });
  for (const [x, y, size] of [[580, 501, 170], [1020, 548, 240], [1480, 505, 150],
    [220, 570, 100], [1720, 593, 120]]) {
    background.ellipse(x, y, size, 5).fill({ color: art.paper, alpha: 0.09 });
  }
  layers.environment.addChild(background);

  const deck = new Graphics({ label: "deck-surface" })
    .poly([270, 620, 1610, 620, 1740, 755, 1610, 935, 300, 935, 220, 850])
    .fill(art.ink)
    .poly([285, 590, 1600, 590, 1720, 725, 1590, 895, 295, 895, 235, 820])
    .fill(art.deck).stroke({ color: art.brass, width: 5 });
  for (let y = 628; y < 890; y += 39) {
    deck.moveTo(290 + (y - 590) * 0.22, y).lineTo(1620 + (y - 590) * 0.22, y)
      .stroke({ color: art.deckShade, width: 5, alpha: 0.72 });
    deck.moveTo(290 + (y - 590) * 0.22, y + 3).lineTo(1580 + (y - 590) * 0.22, y + 3)
      .stroke({ color: art.paper, width: 1, alpha: 0.16 });
  }
  for (let x = 360; x < 1620; x += 250) {
    deck.moveTo(x, 610).lineTo(x + 30, 895).stroke({ color: art.ink, width: 3, alpha: 0.28 });
  }
  layers.ground.addChild(deck);
  const riverLight = new Graphics({ label: "river-beat-light" })
    .ellipse(1080, 542, 410, 23).fill({ color: art.paper, alpha: 0.2 })
    .ellipse(1250, 562, 250, 6).fill({ color: art.ember, alpha: 0.35 });
  const cargoLight = new Graphics({ label: "cargo-beat-light" })
    .ellipse(1450, 669, 148, 25).fill({ color: art.ember, alpha: 0.32 })
    .poly([1400, 580, 1515, 575, 1515, 642, 1460, 675]).stroke({ color: art.ember, width: 8, alpha: 0.55 });
  riverLight.alpha = 0.12;
  cargoLight.alpha = 0;
  layers.ground.addChild(riverLight, cargoLight);
  // The deckhand's work stations: a coiled line and the existing cargo crate.
  const rope = new Graphics({ label: "working-rope", x: journeyDeck.anchors.npcStation.x, y: 765 });
  for (const radius of [9, 15, 21]) {
    rope.ellipse(0, 0, radius, radius * 0.42).stroke({ color: 0xb29a70, width: 3 });
  }
  rope.moveTo(21, 0).lineTo(34, -14).stroke({ color: 0xb29a70, width: 3 });
  layers.ground.addChild(rope);
  layers.ground.addChild(new Graphics({ label: "cargo-crate" })
    .poly([1390, 580, 1445, 552, 1515, 575, 1460, 603]).fill(0x756249)
    .poly([1390, 580, 1460, 603, 1460, 675, 1390, 648]).fill(0x443e31)
    .poly([1460, 603, 1515, 575, 1515, 642, 1460, 675]).fill(0x292d27)
    .poly([1390, 580, 1445, 552, 1515, 575, 1515, 642, 1460, 675, 1390, 648])
    .stroke({ color: art.brass, width: 3, alpha: 0.8 })
    .moveTo(1425, 566).lineTo(1490, 588).lineTo(1490, 655)
    .stroke({ color: art.ink, width: 3, alpha: 0.7 }));

  const fittings = new Graphics({ label: "deck-fittings" })
    .poly([350, 495, 565, 495, 565, 640, 350, 640]).fill(0x354039)
    .poly([330, 480, 570, 480, 560, 500, 350, 500]).fill(art.ink)
    .rect(382, 525, 53, 44).fill(art.ink)
    .rect(470, 525, 53, 44).fill(art.ink)
    .rect(387, 530, 44, 35).fill({ color: art.ember, alpha: 0.23 })
    .rect(475, 530, 44, 35).fill({ color: art.ember, alpha: 0.16 });
  for (let x = 590; x < 1600; x += 95) {
    fittings.moveTo(x, 555).lineTo(x, 610).stroke({ color: art.brass, width: 5 });
  }
  fittings.moveTo(575, 555).lineTo(1590, 555).stroke({ color: art.brass, width: 5 });
  for (let x = 330; x < 1590; x += 95) {
    fittings.moveTo(x, 872).lineTo(x, 915).stroke({ color: art.ink, width: 6 });
  }
  fittings.moveTo(320, 900).lineTo(1600, 900).stroke({ color: art.ink, width: 7 });
  // Foreground rail and mooring lines overlap feet and cargo, anchoring the cast.
  fittings.moveTo(268, 835).lineTo(352, 928).lineTo(1635, 928)
    .stroke({ color: art.ink, width: 12 });
  fittings.moveTo(270, 830).lineTo(352, 920).lineTo(1635, 920)
    .stroke({ color: art.brass, width: 3, alpha: 0.64 });
  fittings.moveTo(1520, 565).bezierCurveTo(1590, 680, 1480, 760, 1570, 908)
    .stroke({ color: art.ink, width: 5, alpha: 0.75 });
  layers.foreground.addChild(fittings);
  layers.foreground.addChild(new Graphics({ label: "cargo-tally" })
    .rect(423, 570, 65, 57).fill(0x584f3d).stroke({ color: 0xb39f7a, width: 2 }));
  layers.foreground.addChild(new Text({ label: "cargo-mark", text: "DEST.\n——",
    x: 430, y: 580, style: { fontFamily: "Arial", fontSize: 12, fill: 0xd0bea0 } }));
  return { setBeat(beat: JourneyVisualBeat) {
    riverLight.alpha = beat === "river" ? 0.72 : beat === "listening" ? 0.28 : 0.12;
    cargoLight.alpha = beat === "cargo" ? 0.8 : 0;
  } };
}

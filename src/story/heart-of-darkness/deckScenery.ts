import { Container, Graphics, Text } from "pixi.js";
import type { createWorldLayers } from "../../engine/world/createWorldLayers";
import { journeyDeck } from "./deck";
import { journeyVisual as art, type JourneyVisualBeat } from "./journeyVisual";
import { journeyArtAssets } from "./journeyArtAssets";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";

/** A single ink-and-wash theatre set; traveling river silhouettes remain separate. */
export function drawDeckScenery(layers: ReturnType<typeof createWorldLayers>) {
  const { width, height } = journeyDeck.size;
  const background = new Graphics({ label: "river-base" })
    .rect(0, 0, width, height).fill(art.ink)
    .rect(0, 0, width, 345).fill(0x3c4940)
    .poly([0, 100, 320, 84, 680, 110, 1040, 79, 1450, 106, 1920, 63,
      1920, 169, 1360, 146, 1060, 163, 620, 142, 260, 166, 0, 157])
      .fill({ color: 0x667061, alpha: 0.24 })
    .poly([0, 196, 340, 163, 610, 183, 900, 159, 1230, 186, 1600, 147,
      1920, 177, 1920, 226, 1430, 207, 1080, 223, 700, 205, 220, 231, 0, 217])
      .fill({ color: art.ink, alpha: 0.14 })
    .poly([0, 270, 270, 230, 620, 255, 860, 205, 1240, 245, 1530, 195, 1920, 240,
      1920, 410, 0, 410]).fill(0x536050)
    .rect(0, 410, width, height - 410).fill(art.deepWater)
    .poly([0, 410, 1920, 410, 1920, 558, 0, 531]).fill({ color: art.river, alpha: 0.18 })
    .poly([0, 665, 470, 647, 910, 668, 1370, 636, 1920, 659,
      1920, 708, 1430, 693, 870, 716, 300, 699, 0, 713])
      .fill({ color: art.ink, alpha: 0.16 });
  for (let i = 0; i < 13; i++) {
    const x = 90 + i * 145;
    const y = 93 + (i % 4) * 32;
    background.moveTo(x, y).lineTo(x + 104, y - 9)
      .stroke({ color: art.paper, width: 2, alpha: 0.035 });
  }
  // A broken band of hot light leads the eye downriver without a painted focal tree.
  background.poly([680, 348, 880, 344, 1090, 350, 1220, 365, 950, 375, 650, 370])
    .fill({ color: art.ember, alpha: 0.27 });
  for (const [x, y, size] of [[580, 501, 170], [1020, 548, 240], [1480, 505, 150],
    [220, 570, 100], [1720, 593, 120]]) {
    background.ellipse(x, y, size, 5).fill({ color: art.paper, alpha: 0.09 });
  }
  layers.environment.addChild(createVisualAssetSlot({ label: "river-base",
    source: journeyArtAssets.skyWater, fallback: () => background,
    cacheFallback: true }).container);

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
    for (let y = 667; y < 880; y += 78) {
      deck.ellipse(x + (y - 590) * 0.1, y, 2, 1.5)
        .fill({ color: art.ink, alpha: 0.62 });
    }
  }
  deck.poly([286, 590, 1600, 590, 1645, 636, 281, 635])
    .fill({ color: art.ink, alpha: 0.14 });
  for (let i = 0; i < 17; i++) {
    const x = 340 + i * 75;
    const y = 695 + (i % 4) * 53;
    deck.moveTo(x, y).lineTo(x + 38 + (i % 3) * 13, y - 2)
      .stroke({ color: art.paper, width: 1, alpha: 0.085 });
  }
  const cabin = new Graphics({ label: "deck-cabin" })
    .poly([350, 495, 565, 495, 565, 640, 350, 640]).fill(0x354039)
      .stroke({ color: art.ink, width: 5 })
    .poly([330, 480, 570, 480, 560, 500, 350, 500]).fill(art.ink)
    .poly([346, 482, 560, 482, 546, 487, 355, 487])
      .fill({ color: art.brass, alpha: 0.3 })
    .rect(367, 510, 4, 128).fill({ color: art.paper, alpha: 0.08 })
    .rect(548, 509, 4, 128).fill({ color: art.ink, alpha: 0.38 })
    .rect(382, 525, 53, 44).fill(art.ink)
    .rect(470, 525, 53, 44).fill(art.ink)
    .rect(387, 530, 44, 35).fill({ color: art.ember, alpha: 0.43 })
    .rect(475, 530, 44, 35).fill({ color: art.ember, alpha: 0.24 })
    .rect(407, 528, 3, 39).fill({ color: art.ink, alpha: 0.75 })
    .rect(495, 528, 3, 39).fill({ color: art.ink, alpha: 0.75 })
    .moveTo(387, 550).lineTo(431, 550)
      .moveTo(475, 550).lineTo(519, 550)
      .stroke({ color: art.ink, width: 2, alpha: 0.7 })
    .poly([386, 569, 432, 569, 468, 631, 370, 631])
      .fill({ color: art.ember, alpha: 0.07 });
  const deckFallback = new Container();
  deckFallback.addChild(deck, cabin);
  layers.ground.addChild(createVisualAssetSlot({ label: "deck-surface",
    source: journeyArtAssets.deckBase, fallback: () => deckFallback,
    cacheFallback: true }).container);
  // These lighting cues are separate from replaceable plates and survive art swaps.
  layers.ground.addChild(new Graphics({ label: "cabin-ambient-light" })
    .poly([386, 564, 431, 564, 685, 823, 336, 829])
      .fill({ color: art.ember, alpha: 0.065 })
    .ellipse(530, 681, 225, 59).fill({ color: art.ember, alpha: 0.035 }));
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
  rope.moveTo(-21, 2).bezierCurveTo(-43, -14, -43, -31, -16, -39)
    .stroke({ color: 0xb29a70, width: 2, alpha: 0.85 });
  layers.ground.addChild(rope);
  const cargo = new Graphics({ label: "cargo-crate" })
    .ellipse(1456, 678, 92, 15).fill({ color: art.ink, alpha: 0.42 })
    .poly([1390, 580, 1445, 552, 1515, 575, 1460, 603]).fill(0x756249)
    .poly([1390, 580, 1460, 603, 1460, 675, 1390, 648]).fill(0x443e31)
    .poly([1460, 603, 1515, 575, 1515, 642, 1460, 675]).fill(0x292d27)
    .poly([1390, 580, 1445, 552, 1515, 575, 1515, 642, 1460, 675, 1390, 648])
    .stroke({ color: art.brass, width: 3, alpha: 0.8 })
    .moveTo(1406, 574).lineTo(1478, 594)
    .moveTo(1430, 561).lineTo(1497, 584)
      .stroke({ color: art.ink, width: 2, alpha: 0.42 })
    .moveTo(1407, 607).lineTo(1443, 620)
    .moveTo(1407, 628).lineTo(1441, 641)
      .stroke({ color: art.paper, width: 1, alpha: 0.11 })
    .moveTo(1425, 566).lineTo(1490, 588).lineTo(1490, 655)
    .stroke({ color: art.ink, width: 3, alpha: 0.7 })
    .rect(423, 570, 65, 57).fill(0x584f3d).stroke({ color: 0xb39f7a, width: 2 });
  layers.ground.addChild(createVisualAssetSlot({ label: "cargo-art",
    source: journeyArtAssets.cargo, fallback: () => cargo,
    cacheFallback: true }).container);

  const fittings = new Graphics({ label: "deck-fittings" });
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
  layers.foreground.addChild(createVisualAssetSlot({ label: "deck-fittings",
    source: journeyArtAssets.deckFittings, fallback: () => fittings,
    cacheFallback: true }).container);
  layers.foreground.addChild(new Text({ label: "cargo-mark", text: "DEST.\n——",
    x: 430, y: 580, style: { fontFamily: "Arial", fontSize: 12, fill: 0xd0bea0 } }));
  return { setBeat(beat: JourneyVisualBeat) {
    riverLight.alpha = beat === "river" ? 0.72 : beat === "listening" ? 0.28 : 0.12;
    cargoLight.alpha = beat === "cargo" ? 0.8 : 0;
  } };
}

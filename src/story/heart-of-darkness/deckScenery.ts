import { Graphics } from "pixi.js";
import type { createWorldLayers } from "../../engine/world/createWorldLayers";
import { journeyDeck } from "./deck";

/** Temporary blockout; no weather, parallax or collision runtime is introduced. */
export function drawDeckScenery(layers: ReturnType<typeof createWorldLayers>): void {
  const { width, height } = journeyDeck.size;
  const background = new Graphics({ label: "river-blockout" })
    .rect(0, 0, width, height).fill(0x162c30)
    .circle(1490, 230, 72).fill({ color: 0xc1b78d, alpha: 0.35 })
    .poly([0, 420, 120, 370, 245, 403, 430, 356, 570, 402, 790, 367,
      960, 413, 1210, 377, 1410, 411, 1670, 360, 1920, 401, 1920, 530, 0, 530]).fill(0x203c3c)
    .rect(0, 455, width, height - 455).fill(0x234548);
  for (let row = 0; row < 9; row++) {
    const y = 490 + row * 65;
    background.moveTo(0, y).lineTo(width, y + 12).stroke({ color: 0x66847d, width: 2, alpha: 0.13 });
  }
  layers.environment.addChild(background);

  const deck = new Graphics({ label: "deck-surface" })
    .poly([270, 620, 1610, 620, 1740, 755, 1610, 935, 300, 935, 220, 850])
    .fill(0x121f22)
    .poly([285, 590, 1600, 590, 1720, 725, 1590, 895, 295, 895, 235, 820])
    .fill(0x66594a).stroke({ color: 0x9b8568, width: 6 });
  for (let x = 320; x < 1600; x += 48) {
    deck.moveTo(x, 605).lineTo(x, 880).stroke({ color: 0x302f2a, width: 2, alpha: 0.5 });
  }
  const area = journeyDeck.walkableArea;
  deck.rect(area.x, area.y, area.width, area.height)
    .fill({ color: 0xb8c4a2, alpha: 0.08 })
    .stroke({ color: 0xbbc6a0, width: 2, alpha: 0.6 });
  layers.ground.addChild(deck);
  // The deckhand's work stations: a coiled line and the existing cargo crate.
  const rope = new Graphics({ label: "working-rope", x: journeyDeck.anchors.npcStation.x, y: 765 });
  for (const radius of [9, 15, 21]) {
    rope.ellipse(0, 0, radius, radius * 0.42).stroke({ color: 0xb29a70, width: 3 });
  }
  rope.moveTo(21, 0).lineTo(34, -14).stroke({ color: 0xb29a70, width: 3 });
  layers.ground.addChild(rope);
  layers.ground.addChild(new Graphics({ label: "cargo-crate" })
    .rect(1400, 540, 85, 95).fill(0x4b4839).stroke({ color: 0x97805a, width: 3 }));

  const fittings = new Graphics({ label: "deck-fittings" })
    .rect(350, 490, 205, 150).fill(0x333d39).stroke({ color: 0x839086, width: 3 })
    .rect(335, 475, 235, 25).fill(0x171f21)
    .rect(385, 520, 50, 45).fill(0x182e31)
    .rect(465, 520, 50, 45).fill(0x182e31);
  for (let x = 590; x < 1600; x += 95) {
    fittings.moveTo(x, 555).lineTo(x, 610).stroke({ color: 0xa69b7e, width: 5 });
  }
  fittings.moveTo(575, 555).lineTo(1590, 555).stroke({ color: 0xa69b7e, width: 5 });
  for (let x = 330; x < 1590; x += 95) {
    fittings.moveTo(x, 872).lineTo(x, 915).stroke({ color: 0x202e2e, width: 6 });
  }
  fittings.moveTo(320, 900).lineTo(1600, 900).stroke({ color: 0x202e2e, width: 7 });
  layers.foreground.addChild(fittings);
}

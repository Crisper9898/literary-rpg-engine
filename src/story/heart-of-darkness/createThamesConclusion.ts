import { Container, Graphics } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets } from "./journeyArtAssets";
import { thamesPoints } from "./thamesConclusion";

/** Separate Nellie staging, never a reskin or mutation of the approved steamer.
 * Graphic theatre pending the specific illustration brief; listeners stay offscreen. */
export function createThamesConclusion() {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  const sky = new Graphics().rect(0, 0, 1920, 1080).fill(0x111f26)
    .rect(0, 245, 1920, 265).fill(0x35454a)
    .poly([0, 350, 260, 317, 465, 341, 720, 293, 1010, 330, 1380, 270, 1650, 290, 1920, 239, 1920, 470, 0, 470]).fill(0x26373f)
    .poly([0, 460, 385, 421, 770, 432, 1130, 406, 1490, 414, 1920, 376, 1920, 500, 0, 500]).fill(0x101e26);
  const water = new Graphics().rect(0, 500, 1920, 580).fill(0x1b3037);
  for (let i = 0; i < 32; i++) {
    const x = (i * 137) % 1850, y = 520 + i * i % 560;
    water.moveTo(x, y).lineTo(x + 35 + i * 11 % 170, y + 1)
      .stroke({ color: i % 3 ? 0x456168 : 0x8c9e9b, alpha: .22, width: i < 12 ? 2 : 3 });
  }
  layers.environment.addChild(sky, water);
  const deck = new Graphics().poly([342, 669, 1508, 655, 1745, 928, 235, 943]).fill(0x3b3930)
    .poly([235, 943, 1745, 928, 1708, 1000, 276, 1019]).fill(0x0a171b);
  for (let i = 0; i < 9; i++) deck.moveTo(342 - i * 12, 673 + i * i * 4)
    .lineTo(1508 + i * 13, 659 + i * i * 4).stroke({ color: 0x171f21, width: 3 });
  for (let i = 0; i < 17; i++) deck.moveTo(342 + i * 73, 668).lineTo(235 + i * 94, 943)
    .stroke({ color: 0x1e2828, width: 2, alpha: .7 });
  layers.ground.addChild(deck, new Graphics().poly([720, 674, 1170, 663, 1360, 937, 619, 943])
    .fill({ color: 0x82928b, alpha: .06 }));
  const rail = new Graphics().moveTo(340, 583).lineTo(1510, 565).stroke({ color: 0x6e7974, width: 6 });
  for (let i = 0; i < 10; i++) rail.moveTo(340 + i * 130, 583 - i * 2).lineTo(342 + i * 130, 669 - i)
    .stroke({ color: 0x0b1a1f, width: 7 });
  layers.environment.addChild(rail);
  const mooring = new Graphics({ label: "thames-mooring" }).ellipse(455, 802, 49, 12)
    .fill({ color: 0x06161b, alpha: .65 }).rect(423, 747, 62, 17).fill(0x838577)
    .rect(445, 762, 16, 40).fill(0x343e3c);
  for (let i = 0; i < 4; i++) mooring.ellipse(454, 770 + i * 4, 22, 7).stroke({ color: 0x9c9275, width: 3 });
  mooring.moveTo(443, 777).lineTo(340, 824).lineTo(213, 874).lineTo(70, 949)
    .stroke({ color: 0x837c60, width: 5 });
  layers.ground.addChild(mooring);
  // The yacht's mast/rigging defines this frame without invented character cut-outs.
  layers.foreground.addChild(new Graphics().poly([1650, 0, 1685, 0, 1631, 927, 1609, 927]).fill(0x0a171c)
    .moveTo(1662, 54).lineTo(1849, 952).moveTo(1659, 90).lineTo(1526, 713)
    .stroke({ color: 0x6b756e, width: 3, alpha: .5 })
    .poly([277, 945, 1708, 931, 1714, 961, 283, 976]).fill(0x061318));
  const player = new Container({ label: "thames-player", ...thamesPoints.entry });
  const art = createVisualAssetSlot({ label: "marlow-art", source: journeyArtAssets.marlowSheet, fallback: () => new Container() });
  art.container.scale.set(1.25); art.container.tint = 0xa7b9b7;
  player.addChild(new Graphics().poly([-27, 2, 20, -2, 57, 17, -13, 24]).fill({ color: 0x040f15, alpha: .5 })
    .ellipse(0, 5, 29, 6).fill({ color: 0x040f15, alpha: .6 }), art.container);
  layers.actors.addChild(player);
  const veil = new Graphics({ label: "thames-overcast" }).rect(0, 0, 1920, 1080).fill(0x091720);
  layers.foreground.addChild(veil);
  return { presentation, layers, player, art, veil, mooring };
}

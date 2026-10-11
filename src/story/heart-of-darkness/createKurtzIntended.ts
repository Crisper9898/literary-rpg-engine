import { Container, Graphics } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets } from "./journeyArtAssets";
import { intendedPoints } from "./kurtzIntended";

/** Episode-local graphic theatre. The Intended speaks from the right wing;
 * no fabricated portrait or incompatible stand-in for an unapproved actor. */
export function createKurtzIntended() {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  const wall = new Graphics().rect(0, 0, 1920, 1080).fill(0x101616)
    .poly([260, 60, 1680, 90, 1680, 675, 260, 690]).fill(0x333833)
    .poly([0, 0, 260, 60, 260, 690, 0, 1080]).fill(0x1b2422);
  for (let i = 0; i < 58; i++) wall.moveTo(275 + i * 24, 95 + i * 71 % 480)
    .lineTo(277 + i * 24, 175 + i * 71 % 480).stroke({ color: 0xc4c3a9, alpha: .035, width: 1 });
  layers.environment.addChild(wall);
  const windows = new Graphics({ label: "intended-windows" });
  for (const x of [590, 835, 1080]) {
    windows.rect(x, 105, 170, 560).fill(0x0b1514).rect(x + 13, 118, 144, 528).fill(0x85897a)
      .rect(x + 77, 118, 10, 528).rect(x + 13, 376, 144, 10).fill(0x26312b)
      .poly([x - 20, 95, x + 30, 111, x + 10, 666, x - 42, 681]).fill(0x17201c)
      .poly([x + 155, 98, x + 205, 112, x + 210, 680, x + 166, 664]).fill(0x17201c);
  }
  layers.environment.addChild(windows);
  const floor = new Graphics().poly([260, 688, 1680, 670, 1920, 1080, 0, 1080]).fill(0x302d28);
  for (let i = 0; i < 10; i++) floor.moveTo(260 - i * 32, 690 + i * i * 5)
    .lineTo(1680 + i * 29, 672 + i * i * 5).stroke({ color: 0x101a16, width: 3 });
  for (let i = 0; i < 18; i++) floor.moveTo(260 + i * 84, 680).lineTo(-150 + i * 130, 1080)
    .stroke({ color: 0x121b17, alpha: .65, width: 2 });
  layers.ground.addChild(floor, new Graphics().poly([600, 646, 1237, 646, 1420, 1080, 310, 1080])
    .fill({ color: 0xbbbfa1, alpha: .08 }));
  const fireplace = new Graphics().poly([1270, 400, 1470, 404, 1470, 686, 1270, 686]).fill(0x96998b)
    .rect(1254, 391, 231, 25).fill(0xb2b1a0).rect(1295, 437, 145, 235).fill(0x17201d)
    .rect(1320, 460, 95, 196).fill(0x07100f).rect(1250, 684, 240, 14).fill(0x6c776b);
  layers.environment.addChild(fireplace);
  const piano = new Graphics({ label: "intended-piano" }).poly([300, 560, 483, 527, 556, 599, 517, 667, 298, 660])
    .fill(0x080e0d).stroke({ color: 0x657065, width: 2 })
    .poly([298, 663, 513, 670, 521, 693, 295, 685]).fill(0x111916)
    .poly([298, 687, 319, 688, 311, 781, 295, 783]).fill(0x070d0b)
    .poly([486, 689, 507, 684, 510, 768, 493, 770]).fill(0x070d0b)
    .moveTo(324, 570).lineTo(477, 543).stroke({ color: 0xb9b398, alpha: .25, width: 2 });
  layers.ground.addChild(piano);
  const table = new Graphics().ellipse(1130, 656, 112, 28).fill(0x57523b)
    .ellipse(1130, 654, 112, 26).stroke({ color: 0xb3a572, width: 2, alpha: .6 })
    .poly([1062, 674, 1078, 680, 1068, 758, 1047, 765]).fill(0x353a2b)
    .poly([1185, 680, 1200, 674, 1215, 754, 1194, 749]).fill(0x353a2b);
  const packet = new Graphics({ label: "intended-packet" }).poly([1088, 637, 1153, 632, 1173, 660, 1108, 667])
    .fill(0xc0ad81).stroke({ color: 0x353328, width: 2 })
    .poly([1094, 637, 1134, 654, 1153, 632]).stroke({ color: 0x6f644e, width: 2 });
  layers.ground.addChild(table, packet);
  layers.environment.addChild(new Graphics().poly([1515, 220, 1680, 223, 1680, 689, 1515, 697])
    .fill(0x0a1210).stroke({ color: 0x746e50, width: 3 }));
  const dusk = new Graphics({ label: "intended-dusk" }).rect(0, 0, 1920, 1080).fill(0x071310);
  layers.environment.addChild(dusk);
  const player = new Container({ label: "intended-player", ...intendedPoints.entry });
  const art = createVisualAssetSlot({ label: "marlow-art", source: journeyArtAssets.marlowSheet, fallback: () => new Container() });
  art.container.scale.set(1.35); art.container.tint = 0xbec1ad;
  player.addChild(new Graphics().poly([-27, 2, -7, -2, 25, 1, 43, 14, -26, 17]).fill({ color: 0x040e0b, alpha: .55 })
    .ellipse(0, 5, 29, 6).fill({ color: 0x030b08, alpha: .62 }), art.container);
  layers.actors.addChild(player);
  layers.foreground.addChild(new Graphics().poly([0, 1080, 0, 868, 260, 916, 414, 1080]).fill(0x07110e)
    .poly([1920, 0, 1730, 100, 1690, 800, 1630, 1080, 1920, 1080]).fill(0x050e0c));
  return { presentation, layers, player, art, packet, dusk };
}

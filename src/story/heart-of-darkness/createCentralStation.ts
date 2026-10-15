import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { centralArt, centralPoints } from "./centralStation";

/** Two bounded theatrical stages; encounters remain offscreen, not repurposed
 * portraits. Props and light belong to this episode, never the approved Deck. */
export function createCentralStation(caravan: boolean) {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  const sky = new Graphics().rect(0, 0, 1920, 1080).fill(0x202d2b);
  for (let band = 0; band < 6; band++) sky.rect(0, 160 + band * 55, 1920, 60)
    .fill({ color: caravan ? 0x9d9164 : 0x68807a, alpha: .21 + band * .035 });
  sky.poly([0, 359, 360, 242, 685, 355, 983, 282, 1250, 365, 1660, 241, 1920, 345, 1920, 645, 0, 645]).fill(0x3c4c40);
  layers.environment.addChild(sky);
  const forest = createVisualAssetSlot({ label: "central-forest", source: centralArt.forest, fallback: () => new Container() });
  forest.container.tint = caravan ? 0xb1a789 : 0x8eaaa2; layers.environment.addChild(forest.container);
  const water = new Graphics({ label: caravan ? "central-uplands" : "central-backwater" })
    .rect(0, 545, 1920, 535).fill(caravan ? 0x49533b : 0x253b3b);
  const current = new Graphics({ label: "central-current" });
  for (let index = 0; index < 32; index++) {
    const x = index * 137 % 1830, y = 560 + index * 31 % 420;
    if (caravan) {
      water.moveTo(x, y).lineTo(x + 5, y - 9 - index % 7).stroke({ color: 0x8e9061, alpha: .25, width: 2 });
    } else {
      water.moveTo(x, y).lineTo(x + 68 + index % 5 * 23, y + 2).stroke({ color: 0x8a9b89, alpha: .16, width: 2 });
      if (index < 14) current.moveTo(x + 13, y + 8).lineTo(x + 80, y + 9).stroke({ color: 0xb5b59a, alpha: .12, width: 2 });
    }
  }
  layers.environment.addChild(water, current);
  const soil = new Graphics({ label: "central-soil" })
    .poly([0, 820, 360, 696, 780, 654, 1190, 683, 1630, 684, 1920, 851, 1920, 1080, 0, 1080]).fill(caravan ? 0x5f563e : 0x4b5140)
    .poly([259, 923, 368, 724, 657, 738, 882, 706, 1060, 741, 1334, 708, 1570, 729, 1705, 939]).fill(caravan ? 0x8e7950 : 0x74694e);
  for (let index = 0; index < 125; index++) {
    const x = 279 + index * 83 % 1370, y = 738 + index * 47 % 230;
    soil.moveTo(x, y).lineTo(x + 8 + index % 23, y - 3).stroke({ color: index % 3 ? 0x293a2e : 0xb5a580, alpha: .24, width: index % 2 + 1 });
  }
  layers.ground.addChild(soil);
  if (caravan) {
    const ravine = new Graphics({ label: "central-ravine" })
      .poly([749, 504, 946, 550, 1123, 500, 1197, 665, 927, 737, 701, 665]).fill(0x253c34)
      .poly([758, 575, 909, 611, 1065, 570, 1134, 638, 928, 701, 748, 646]).fill(0x3a5140)
      .moveTo(806, 648).lineTo(1040, 668).stroke({ color: 0x94825b, width: 16 });
    layers.ground.addChild(ravine);
    const village = new Graphics({ label: "central-village" });
    village.poly([302, 604, 341, 566, 519, 573, 545, 610]).fill(0x363d2e)
      .poly([321, 617, 492, 613, 507, 698, 343, 696]).fill(0x676141);
    for (let index = 0; index < 13; index++) village.moveTo(329 + index * 13, 620).lineTo(342 + index * 12, 695)
      .stroke({ color: 0xa49a6a, alpha: .35, width: 2 });
    village.moveTo(327, 606).lineTo(343, 705).moveTo(495, 615).lineTo(507, 704).stroke({ color: 0x203629, width: 7 });
    layers.ground.addChild(village);
    const camp = new Graphics({ label: "central-camp" }).poly([456, 734, 530, 659, 617, 749]).fill(0x565746)
      .poly([509, 726, 530, 659, 553, 746]).fill(0x172e28)
      .moveTo(530, 658).lineTo(530, 748).stroke({ color: 0xa8a080, width: 3 })
      .ellipse(581, 768, 29, 7).fill({ color: 0x122722, alpha: .5 })
      .poly([562, 752, 596, 752, 589, 767, 569, 767]).fill(0x433f32);
    layers.ground.addChild(camp);
    const hammock = new Graphics({ label: "central-hammock" })
      .poly([1251, 640, 1320, 654, 1390, 650, 1459, 622, 1420, 682, 1355, 701, 1284, 684]).fill(0x756b4f)
      .moveTo(1248, 633).lineTo(1459, 612).stroke({ color: 0x3c4935, width: 6 })
      .moveTo(1248, 633).lineTo(1287, 681).moveTo(1459, 612).lineTo(1420, 681).stroke({ color: 0xa1946d, width: 3 });
    for (let index = 0; index < 9; index++) hammock.moveTo(1290 + index * 15, 662).lineTo(1308 + index * 13, 687)
      .stroke({ color: 0xb2a07a, alpha: .3, width: 2 });
    layers.ground.addChild(hammock);
  } else {
    const building = new Graphics({ label: "central-buildings" })
      .poly([905, 474, 1045, 440, 1364, 480, 1410, 515, 918, 516]).fill(0x21332c)
      .poly([930, 515, 1372, 514, 1383, 664, 945, 663]).fill(0x55513c)
      .rect(1184, 545, 73, 116).fill(0x10261f);
    for (let index = 0; index < 10; index++) building.moveTo(938, 523 + index * 13).lineTo(1375, 522 + index * 14)
      .stroke({ color: 0xa69a73, alpha: .3, width: 2 });
    layers.ground.addChild(building);
    const gate = new Graphics({ label: "central-gate" });
    for (const [start, end] of [[880, 1405], [1518, 1685]]) for (let x = start; x < end; x += 18) {
      gate.moveTo(x, 695).lineTo(x + (x % 5 - 2) * 7, 601 - x % 25).stroke({ color: 0x7a7853, width: 5 });
      gate.moveTo(x + 2, 678).lineTo(x + 31, 662).stroke({ color: 0x242f24, width: 2 });
    }
    gate.moveTo(877, 652).lineTo(1399, 640).moveTo(1519, 648).lineTo(1690, 640).stroke({ color: 0x464b34, width: 6 });
    layers.ground.addChild(gate);
    const wreck = new Graphics({ label: "central-wreck" })
      .poly([270, 678, 664, 630, 758, 670, 699, 740, 320, 735]).fill(0x172b29)
      .poly([284, 676, 641, 647, 718, 676, 680, 706, 327, 709]).fill(0x50584a)
      .poly([401, 626, 584, 611, 606, 650, 420, 670]).fill(0x66705d)
      .poly([481, 583, 516, 575, 535, 638, 502, 646]).fill(0x202e28);
    for (let index = 0; index < 12; index++) wreck.moveTo(343 + index * 27, 678 - index).lineTo(349 + index * 28, 709 - index * .2)
      .stroke({ color: 0x182b25, width: 4 });
    wreck.poly([273, 704, 715, 688, 760, 733, 294, 766]).fill({ color: 0x293f39, alpha: .72 })
      .moveTo(297, 719).lineTo(717, 713).stroke({ color: 0xa2aa8e, alpha: .35, width: 2 });
    layers.ground.addChild(wreck);
  }
  const hints = caravan ? [["village", "ALDEA"], ["ravine", "BARRANCO"], ["camp", "CAMPAMENTO"], ["companion", "DESCANSO"]] :
    [["wreck", "VAPOR HUNDIDO"], ["agent", "ESTACIÓN"], ["arrival", "ENTRADA"]];
  for (const [id, text] of hints as [keyof typeof centralPoints, string][]) {
    const point = centralPoints[id]; layers.ground.addChild(new Text({ label: `central-${id}-hint`, text,
      x: point.x - 57, y: point.y + 26, style: { fontFamily: "Georgia", fontSize: 16, fill: 0xd7c6a1, stroke: { color: 0x1a3026, width: 3 } } }));
  }
  const player = new Container({ label: "central-player", ...centralPoints.entry });
  const art = createVisualAssetSlot({ label: "marlow-art", source: centralArt.figure, fallback: () => new Container() });
  art.container.scale.set(1.3); art.container.tint = caravan ? 0xd4c498 : 0xbbc3a5;
  player.addChild(new Graphics().poly([-24, 1, 20, -2, 69, 20, -9, 25]).fill({ color: 0x11251e, alpha: .5 })
    .ellipse(0, 4, 28, 7).fill({ color: 0x0d241e, alpha: .65 }), art.container);
  layers.actors.addChild(player);
  const foreground = new Graphics();
  for (let index = 0; index < 24; index++) {
    const x = index < 12 ? index * 18 : 1730 + (index - 12) * 18;
    foreground.moveTo(x, 1080).lineTo(x + 31, 950 - index % 4 * 24).lineTo(x + 13, 1018)
      .stroke({ color: 0x152d24, width: 6 });
  }
  layers.foreground.addChild(foreground);
  const veil = new Graphics({ label: "central-pressure-veil" }).rect(0, 0, 1920, 1080).fill(0x12291f);
  layers.foreground.addChild(veil);
  return { presentation, layers, player, art, forest, current, veil, caravan };
}

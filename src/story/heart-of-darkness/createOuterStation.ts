import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { outerArt, outerPoints } from "./outerStation";

/** Bounded coast/shore theatre. Human encounters stay offscreen until their own
 * illustration exists; no Russian, Kurtz or Deck reskin stands for this station. */
export function createOuterStation(coast: boolean) {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  layers.environment.addChild(new Graphics().rect(0, 0, 1920, 1080).fill(0x222d2b)
    .rect(0, 180, 1920, 330).fill(coast ? 0x657267 : 0x777254)
    .poly([0, 300, 340, 273, 650, 321, 1060, 258, 1420, 287, 1920, 236, 1920, 550, 0, 550]).fill(0x3e5145));
  const forest = createVisualAssetSlot({ label: "outer-forest", source: outerArt.forest, fallback: () => new Container() });
  forest.container.tint = coast ? 0x929f96 : 0xb2ad87;
  layers.environment.addChild(forest.container);
  const water = new Graphics({ label: "outer-water" }).rect(0, 535, 1920, 545).fill(0x253c40);
  for (let i = 0; i < 42; i++) {
    const x = i * 139 % 1820, y = 548 + i * i % 510;
    water.moveTo(x, y).lineTo(x + 40 + i * 13 % 155, y + 2).stroke({ color: 0x88958a, alpha: .23, width: 2 });
  }
  layers.environment.addChild(water);
  const current = new Graphics({ label: "outer-current" });
  for (let i = 0; i < 18; i++) current.moveTo(i * 109 % 1840, 570 + i * 29).lineTo(i * 109 % 1840 + 55, 571 + i * 29)
    .stroke({ color: 0xadb5a0, alpha: .12, width: 2 });
  layers.environment.addChild(current);
  let smoke: Graphics | undefined;
  if (coast) {
    const ship = new Graphics({ label: "outer-warship" }).poly([973, 511, 1273, 511, 1242, 548, 1006, 548]).fill(0x111f22)
      .rect(1039, 487, 122, 24).fill(0x233034).rect(1071, 463, 20, 29).fill(0x142327)
      .moveTo(1162, 500).lineTo(1238, 488).stroke({ color: 0x111f22, width: 8 })
      .moveTo(1018, 454).lineTo(1018, 516).moveTo(1194, 444).lineTo(1194, 515).stroke({ color: 0x172527, width: 3 });
    layers.environment.addChild(ship);
    smoke = new Graphics({ label: "outer-shot-smoke" }).ellipse(1255, 483, 21, 8).ellipse(1278, 478, 24, 12)
      .ellipse(1303, 472, 21, 15).fill({ color: 0xb6bcb0, alpha: .4 });
    layers.environment.addChild(smoke);
    const deck = new Graphics().poly([335, 691, 1570, 678, 1725, 939, 207, 953]).fill(0x484637)
      .poly([207, 953, 1725, 939, 1700, 1001, 235, 1016]).fill(0x101b20);
    for (let i = 0; i < 11; i++) deck.moveTo(335 - i * 11, 691 + i * i * 2.5).lineTo(1570 + i * 12, 678 + i * i * 2.5)
      .stroke({ color: 0x262d28, width: 3 });
    for (let i = 0; i < 16; i++) deck.moveTo(335 + i * 79, 691).lineTo(207 + i * 98, 953).stroke({ color: 0x222b27, width: 2 });
    layers.ground.addChild(deck);
    const rail = new Graphics().moveTo(340, 622).lineTo(1570, 609).stroke({ color: 0x9c9c80, width: 5 });
    for (let i = 0; i < 11; i++) rail.moveTo(340 + i * 123, 622 - i).lineTo(340 + i * 123, 693 - i).stroke({ color: 0x152327, width: 7 });
    layers.environment.addChild(rail);
    layers.foreground.addChild(new Graphics().poly([1640, 410, 1680, 412, 1688, 929, 1637, 930]).fill(0x142326)
      .moveTo(1660, 429).lineTo(1840, 975).stroke({ color: 0x717b68, width: 4 }));
  } else {
    const slope = new Graphics({ label: "outer-slope" }).poly([200, 693, 780, 509, 1660, 488, 1910, 952, 1840, 1080, 0, 1080]).fill(0x625b40)
      .poly([290, 718, 832, 664, 1616, 689, 1701, 914, 283, 939]).fill(0x81734c)
      .poly([641, 546, 811, 520, 731, 672, 581, 690]).fill(0x40463a);
    for (let i = 0; i < 65; i++) { const x = 290 + i * 73 % 1380, y = 710 + i * 53 % 236;
      slope.moveTo(x, y).lineTo(x + 10 + i % 18, y - 4).stroke({ color: i % 2 ? 0x373e32 : 0xafa17b, alpha: .3, width: 2 }); }
    layers.ground.addChild(slope);
    const barracks = new Graphics({ label: "outer-office" }).poly([1150, 515, 1400, 479, 1635, 546, 1611, 583, 1130, 565]).fill(0x252e29)
      .poly([1160, 555, 1610, 575, 1609, 711, 1160, 692]).fill(0x454c38)
      .rect(1323, 568, 91, 141).fill(0x121e1b);
    for (let i = 0; i < 9; i++) barracks.moveTo(1161, 564 + i * 15).lineTo(1610, 584 + i * 15).stroke({ color: 0x9b9167, alpha: .42, width: 2 });
    barracks.poly([1326, 699, 1406, 706, 1530, 914, 1225, 884]).fill({ color: 0xd3b56c, alpha: .14 });
    layers.ground.addChild(barracks);
    const scrap = new Graphics({ label: "outer-machinery" }).ellipse(1040, 760, 88, 17).fill({ color: 0x111c19, alpha: .5 })
      .poly([963, 746, 970, 702, 1090, 683, 1122, 733, 1102, 756]).fill(0x343d35)
      .ellipse(986, 718, 20, 28).fill(0x6e5b3e).stroke({ color: 0x212f29, width: 6 })
      .moveTo(924, 767).lineTo(1182, 799).moveTo(936, 788).lineTo(1148, 818).stroke({ color: 0x433e31, width: 8 });
    for (let i = 0; i < 7; i++) scrap.moveTo(995 + i * 14, 697).lineTo(1014 + i * 14, 742).stroke({ color: 0x95835a, alpha: .3, width: 2 });
    layers.ground.addChild(scrap);
    const shade = new Graphics({ label: "outer-grove-shade" }).poly([228, 490, 559, 501, 844, 933, 246, 949]).fill({ color: 0x102c27, alpha: .6 })
      .poly([299, 494, 339, 490, 386, 825, 342, 835]).fill(0x122820)
      .poly([520, 489, 551, 494, 579, 790, 548, 799]).fill(0x152b23);
    layers.ground.addChild(shade);
    layers.foreground.addChild(new Graphics().poly([0, 0, 93, 0, 195, 737, 156, 1007, 88, 1080, 0, 1080]).fill(0x10221f)
      .poly([1876, 0, 1920, 0, 1920, 1080, 1807, 1080, 1844, 726]).fill(0x152620));
  }
  for (const [id, text] of (coast ? [["surf", "ROMPIENTE"], ["warship", "BUQUE DE GUERRA"], ["landing", "DESEMBARCO"]] :
    [["grove", "ARBOLEDA"], ["works", "MAQUINARIA"], ["accountant", "CONTABILIDAD"]]) as [keyof typeof outerPoints, string][]) {
    const point = outerPoints[id]; layers.ground.addChild(new Text({ label: `outer-${id}-hint`, text,
      x: point.x - 67, y: point.y + 23, style: { fontFamily: "Georgia", fontSize: 16, fill: 0xd1c8a4, stroke: { color: 0x142724, width: 3 } } }));
  }
  const player = new Container({ label: "outer-player", ...outerPoints.entry });
  const art = createVisualAssetSlot({ label: "marlow-art", source: outerArt.figure, fallback: () => new Container() });
  art.container.scale.set(1.3); art.container.tint = 0xc3c4a2;
  player.addChild(new Graphics().poly([-26, 2, 20, -3, 64, 20, -12, 25]).fill({ color: 0x0e231f, alpha: .5 })
    .ellipse(0, 4, 27, 6).fill({ color: 0x0c201a, alpha: .65 }), art.container);
  layers.actors.addChild(player);
  const veil = new Graphics({ label: "outer-pressure-veil" }).rect(0, 0, 1920, 1080).fill(0x092820);
  layers.foreground.addChild(veil);
  return { presentation, layers, player, art, forest, current, veil, smoke, coast };
}

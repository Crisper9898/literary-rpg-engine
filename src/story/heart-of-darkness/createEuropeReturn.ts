import { Container, Graphics, Text } from "pixi.js";
import { createWorldLayers } from "../../engine/world/createWorldLayers";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtAssets } from "./journeyArtAssets";
import { stationEvidence } from "./stationRevelations";
import { europePoints } from "./europeReturn";

/** A deliberately theatrical room, not an invented illustration of Brussels.
 * Existing approved actor/report art; geometry is episode-local staging. */
export function createEuropeReturn() {
  const presentation = new Container({ label: "journey-inner-station" });
  const layers = createWorldLayers(); presentation.addChild(layers.root);
  const wall = new Graphics().rect(0, 0, 1920, 1080).fill(0x151918)
    .poly([260, 80, 1660, 100, 1660, 668, 260, 688]).fill(0x343931)
    .poly([0, 0, 260, 80, 260, 688, 0, 1080]).fill(0x202620)
    .poly([1660, 100, 1920, 0, 1920, 1080, 1660, 668]).fill(0x101816);
  // Dry, sparse ink grain; immutable geometry, no textures/filters every frame.
  for (let i = 0; i < 85; i++) {
    const x = 280 + i * 16, y = 95 + (i * 83 % 500);
    wall.moveTo(x, y).lineTo(x + 8, y + 92).stroke({ color: 0xaaa88a, alpha: .045, width: 1 });
  }
  layers.environment.addChild(wall);
  const floor = new Graphics().poly([260, 680, 1660, 660, 1920, 1080, 0, 1080]).fill(0x302d25);
  for (let i = 0; i < 9; i++) {
    const y = 680 + i * i * 6;
    floor.moveTo(260 - i * 34, y).lineTo(1660 + i * 33, y - 15)
      .stroke({ color: 0x111a17, width: 3 }).moveTo(260 - i * 34, y + 3).lineTo(1660 + i * 33, y - 12)
      .stroke({ color: 0x9c8b63, width: 1, alpha: .22 });
  }
  for (let i = 0; i < 18; i++) floor.moveTo(250 + i * 84, 680).lineTo(-150 + i * 130, 1080)
    .stroke({ color: 0x0a1412, width: 2, alpha: .7 });
  layers.ground.addChild(floor);
  const window = new Graphics().rect(588, 170, 286, 420).fill(0x0a1210)
    .rect(606, 188, 250, 384).fill(0x848477);
  for (let i = 0; i < 7; i++) window.rect(610 + i * 36, 310 + i * 37 % 98, 28, 260)
    .fill({ color: 0x293832, alpha: .42 });
  window.rect(726, 186, 14, 389).rect(605, 380, 250, 12).fill(0x181e18)
    .poly([585, 162, 614, 180, 607, 602, 566, 618]).fill(0x242a22)
    .poly([873, 166, 899, 177, 902, 607, 858, 599]).fill(0x242a22);
  layers.environment.addChild(window);
  const light = new Graphics().poly([604, 570, 856, 570, 1100, 1080, 370, 1080])
    .fill({ color: 0xc5bd91, alpha: .085 }); layers.ground.addChild(light);
  const door = new Graphics({ label: "europe-door" }).poly([1425, 230, 1620, 238, 1620, 684, 1425, 692])
    .fill(0x090f0e).stroke({ color: 0x756c4c, width: 4 })
    .poly([1439, 246, 1604, 252, 1604, 679, 1439, 686]).fill(0x20251e)
    .rect(1460, 278, 122, 166).stroke({ color: 0x3a3d2a, width: 4 })
    .rect(1460, 468, 122, 172).stroke({ color: 0x3a3d2a, width: 4 })
    .circle(1458, 467, 5).fill(0xb59e64);
  layers.environment.addChild(door);
  const pressure = new Graphics({ label: "europe-pressure" }).poly([1440, 679, 1606, 674, 1580, 866, 1320, 840])
    .fill({ color: 0x030b0a, alpha: .38 }); layers.ground.addChild(pressure);
  const table = new Graphics().poly([724, 610, 1220, 601, 1320, 678, 704, 703]).fill(0x0b1512)
    .poly([736, 608, 1216, 599, 1293, 654, 717, 678]).fill(0x635538)
    .stroke({ color: 0x0d1814, width: 5 }).moveTo(735, 618).lineTo(1220, 608)
    .stroke({ color: 0xb39a62, width: 2, alpha: .4 })
    .poly([732, 680, 758, 679, 754, 761, 734, 764]).fill(0x191e15)
    .poly([1255, 657, 1280, 655, 1288, 744, 1265, 747]).fill(0x191e15);
  for (let i = 0; i < 16; i++) table.moveTo(770 + i * 26, 618).lineTo(805 + i * 28, 657)
    .stroke({ color: i % 2 ? 0xb49f68 : 0x171e15, alpha: .12, width: 1 });
  layers.ground.addChild(table);
  const report = new Container({ label: "europe-report", x: 870, y: 666 });
  // Reuse only the existing illustrated sheet, excluding the station crate/grass.
  const reportArt = createVisualAssetSlot({ label: "europe-report-art", source: {
    url: stationEvidence.report.art.url, width: 135, height: 52,
    frames: { idle: { x: 661, y: 675, width: 246, height: 135, pivot: { x: 123, y: 135 } } },
  }, fallback: () => new Container() });
  const paperMask = new Graphics().poly([-67.5, -40.8, 25.8, -52, 67.5, -13.9, 2.2, -.4]).fill(0xffffff);
  reportArt.container.addChild(paperMask); reportArt.container.mask = paperMask;
  reportArt.container.tint = 0xd3c49b; report.addChild(reportArt.container); layers.ground.addChild(report);
  // Letters are an in-scene dossier abstraction, not a counterfeit portrait.
  const letters = new Graphics({ label: "europe-letters" }).poly([1080, 620, 1170, 611, 1194, 649, 1102, 660])
    .fill(0xbaa67a).stroke({ color: 0x362f22, width: 2 })
    .poly([1090, 617, 1132, 641, 1170, 611]).stroke({ color: 0x736447, width: 2 })
    .moveTo(1105, 646).lineTo(1181, 636).stroke({ color: 0x786b4c, width: 1 });
  layers.ground.addChild(letters);
  const postscript = new Graphics({ label: "europe-postscript" }).poly([948, 626, 987, 619, 997, 642, 957, 651])
    .fill(0xbcaa80).stroke({ color: 0x302b20, width: 1 }); layers.ground.addChild(postscript);
  for (const [x, text] of [[850, "INFORME"], [1112, "CARTAS PRIVADAS"]] as const) layers.environment.addChild(new Text({ x, y: 545, text,
    style: { fontFamily: "Georgia", fontSize: 16, fill: 0xb8ac88, letterSpacing: 2 } }));
  const player = new Container({ label: "europe-player", ...europePoints.entry });
  const art = createVisualAssetSlot({ label: "marlow-art", source: journeyArtAssets.marlowSheet, fallback: () => new Container() });
  art.container.scale.set(1.35); art.container.tint = 0xbec1ad;
  player.addChild(new Graphics().poly([-27, 2, -7, -2, 25, 1, 43, 14, -26, 17])
    .fill({ color: 0x040e0b, alpha: .55 }).ellipse(0, 5, 29, 6).fill({ color: 0x030b08, alpha: .62 }), art.container);
  layers.actors.addChild(player);
  layers.foreground.addChild(new Graphics().poly([0, 1080, 0, 865, 275, 924, 435, 1080]).fill(0x08120f)
    .poly([1920, 1080, 1920, 810, 1735, 900, 1630, 1080]).fill(0x06110f));
  return { presentation, layers, player, art, report, reportArt, letters, postscript, pressure };
}

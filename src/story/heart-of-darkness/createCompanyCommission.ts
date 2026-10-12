import { Graphics, Text } from "pixi.js";
import { createEuropeReturn } from "./createEuropeReturn";

/** Existing room/actor/paper art, with office-specific props and no new raster stand-ins.
 * The aunt, knitters, secretary and doctor are heard through canonical dialogue. */
export function createCompanyCommission() {
  const scene = createEuropeReturn(), { layers, player, report, letters, postscript, pressure } = scene;
  player.label = "commission-player"; report.label = "commission-contract"; letters.label = "commission-recommendation";
  postscript.visible = false; pressure.label = "commission-threshold-shadow";
  const captions = layers.environment.children.filter((child): child is Text => child instanceof Text);
  captions[0].text = "CONTRATO"; captions[1].text = "RECOMENDACIÓN";
  // The map is symbolic geography, not an invented accurate chart or generated text.
  const map = new Graphics({ label: "commission-map" }).poly([1030, 172, 1320, 180, 1320, 544, 1030, 536])
    .fill(0x141c18).stroke({ color: 0x776847, width: 6 })
    .poly([1042, 187, 1307, 194, 1307, 528, 1042, 522]).fill(0xa99a70)
    .poly([1080, 229, 1165, 216, 1227, 259, 1270, 313, 1237, 406, 1180, 487, 1138, 405, 1097, 336])
    .fill(0x777153).stroke({ color: 0x403e2c, width: 2 })
    .poly([1120, 282, 1195, 269, 1231, 325, 1207, 375, 1157, 382]).fill(0xb6a047)
    .moveTo(1210, 326).bezierCurveTo(1148, 307, 1212, 364, 1154, 378)
    .bezierCurveTo(1113, 384, 1179, 433, 1149, 459).stroke({ color: 0x233b3a, width: 4 });
  layers.environment.addChild(map);
  const medical = new Graphics({ label: "commission-medical-desk" })
    .poly([367, 628, 528, 625, 584, 667, 356, 678]).fill(0x65583d).stroke({ color: 0x18231b, width: 4 })
    .poly([371, 678, 390, 677, 384, 731, 369, 733]).fill(0x25281c)
    .poly([548, 667, 565, 668, 570, 725, 552, 724]).fill(0x25281c)
    .poly([430, 641, 496, 638, 516, 657, 447, 661]).fill(0xa8976c)
    .moveTo(400, 651).lineTo(413, 632).lineTo(436, 631).lineTo(444, 649)
    .stroke({ color: 0xb5b4a0, width: 3 });
  layers.ground.addChild(medical);
  const wool = new Graphics({ label: "commission-black-wool" })
    .poly([1428, 637, 1548, 636, 1582, 673, 1419, 678]).fill(0x393a28).stroke({ color: 0x111b16, width: 3 });
  for (const x of [1460, 1527]) {
    wool.ellipse(x, 650, 18, 12).fill(0x0a1210);
    for (let i = 0; i < 4; i++) wool.ellipse(x, 651, 7 + i * 3, 5 + i).stroke({ color: 0x494b3b, width: 1 });
    wool.moveTo(x + 9, 646).lineTo(x + 23, 632).moveTo(x + 7, 643).lineTo(x - 6, 634)
      .stroke({ color: 0x7f7b58, width: 1.5 });
  }
  wool.moveTo(1461, 660).bezierCurveTo(1450, 686, 1506, 668, 1500, 696).stroke({ color: 0x080f0c, width: 3 });
  layers.ground.addChild(wool);
  const pressureVeil = new Graphics({ label: "commission-pressure-veil" }).rect(0, 0, 1920, 1080).fill(0x020b08);
  pressureVeil.alpha = .03; layers.foreground.addChild(pressureVeil);
  return { ...scene, map, medical, wool, pressureVeil };
}

import { Graphics, Text } from "pixi.js";
import { createEuropeReturn } from "./createEuropeReturn";
import { europePoints } from "./europeReturn";

export const legacyPoints = { ...europePoints, family: { x: 1000, y: 745 } };

/** Continue the existing room, not another art pass. Distinguish family letters
 * from the private packet with one small, episode-owned paper group. */
export function createKurtzLegacy() {
  const scene = createEuropeReturn();
  scene.postscript.visible = false;
  const family = new Graphics({ label: "legacy-family-letters" }).poly([966, 630, 1024, 625, 1045, 659, 982, 667])
    .fill(0x867b59).stroke({ color: 0x302d20, width: 2 })
    .poly([960, 625, 1022, 619, 1040, 650, 978, 658]).fill(0xb9a77c)
    .stroke({ color: 0x362f22, width: 2 }).poly([962, 626, 997, 643, 1022, 619])
    .stroke({ color: 0x756848, width: 1 });
  scene.layers.ground.addChild(family);
  const familyHeading = new Text({ label: "legacy-family-heading", x: 964, y: 580, text: "FAMILIA",
    style: { fontFamily: "Georgia", fontSize: 14, fill: 0xb8ac88, letterSpacing: 1 } });
  scene.layers.environment.addChild(familyHeading);
  return { ...scene, family, familyHeading };
}

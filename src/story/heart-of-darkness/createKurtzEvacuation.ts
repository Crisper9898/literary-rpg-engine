import { Container, Graphics } from "pixi.js";
import { createInnerStation } from "./createInnerStation";
import { createKurtzPresentation } from "./createKurtzPresentation";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { nightStationArt } from "./kurtzNightEscape";
import { stationEvidence } from "./stationRevelations";
import { discoveries } from "../../content/state/stationRevelationsState";
/** Existing station and cast, recomposed only for the next morning's short route. */
export function createKurtzEvacuation() {
  const scene = createInnerStation(), { layers } = scene;
  for (const child of layers.ground.removeChildren()) child.destroy();
  scene.russian.visible = false;
  const night = createVisualAssetSlot({ label: "evacuation-night-art", source: nightStationArt, fallback: () => new Container() });
  layers.environment.addChild(night.container);
  const shade = new Graphics({ label: "evacuation-morning-shade" }).rect(0, 0, 1920, 1080).fill({ color: 0x152329, alpha: .12 });
  layers.environment.addChild(shade);
  const evidence = Object.entries(stationEvidence).map(([id, item]) => {
    const group = new Container({ label: `evacuation-${id}`, ...item.position }); layers.actors.addChild(group);
    group.addChild(new Graphics().ellipse(0, 4, item.art.width * .34, 9).fill({ color: 0x050b0b, alpha: .6 }));
    const art = createVisualAssetSlot({ label: `evacuation-${id}-art`, source: item.art, fallback: () => new Container() });
    art.setState(id === "palisade" && discoveries().includes("palisade") ? "revealed" : "idle");
    art.container.tint = 0xa1b5aa; group.addChild(art.container); return { id, group, art };
  });
  const cot = createKurtzPresentation(layers.actors); cot.group.visible = true; cot.group.position.set(1315, 780);
  cot.art.setState("weak");
  // A small loose working rope on the existing painted planks, removed by the action.
  const rope = new Graphics({ label: "evacuation-landing-rope", x: 510, y: 800 });
  rope.ellipse(0, 0, 29, 6).ellipse(0, -2, 22, 4).moveTo(24, -1).bezierCurveTo(44, -8, 34, -16, 60, -9)
    .stroke({ color: 0x87764d, width: 3, alpha: .85 }); layers.ground.addChild(rope);
  return { ...scene, night, cot, evidence, rope };
}

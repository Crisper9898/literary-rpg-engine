import { canvas, narration, storage } from "@drincs/pixi-vn";
import { stationPosition, russianMood, stationFlag } from "../../src/content/state/innerStationState";
import { discoveries, revelationsReady, revelationsAvailable, interpretation, revelationAtmosphere } from "../../src/content/state/stationRevelationsState";
import { stationEvidence } from "../../src/story/heart-of-darkness/stationRevelations";
import { inspect as inspectKurtz } from "./kurtzProbe";
import { save as stationSave, restore as stationRestore } from "./stationProbe";
export { settleFrame } from "./stationProbe";
export async function save() { return { ...await stationSave(), ...inspect() }; }
export async function restore(data: string) { await stationRestore(data); return inspect(); }
export function go(id: string) {
  const evidence = stationEvidence[id as keyof typeof stationEvidence];
  // Approach from the near side of the prop, not inside its illustrated footprint.
  stationPosition.write(id === "russian" ? { x: 1010, y: 790 } : id === "kurtz" ? { x: 1225, y: 800 } :
    id === "away" ? { x: 410, y: 760 } : { x: evidence.position.x, y: Math.min(860, evidence.position.y + 25) });
}
export function inspect() {
  const actors = canvas.layers.get("journey-inner-station")?.getChildByLabel("world")?.getChildByLabel("actors");
  const palisade = actors?.getChildByLabel("revelation-palisade")?.getChildByLabel("revelation-palisade-art");
  return { ...inspectKurtz(), available: revelationsAvailable(), discoveries: discoveries(), ready: revelationsReady(),
    interpretation: interpretation(), complete: stationFlag("stationRevelationsComplete"), russianSeen: stationFlag("revelationsRussianSeen"),
    pressure: revelationAtmosphere.read(), mood: russianMood(), text: narration.dialogue?.text,
    flags: ["ivoryObserved", "palisadeObserved", "kurtzInfluenceObserved", "kurtzReportObserved"].map(id => storage.get(`journey.${id}`) === true),
    props: Object.keys(stationEvidence).map(id => { const node = actors?.getChildByLabel(`revelation-${id}`);
      return { id, visible: node?.visible, ready: !!node?.getChildByLabel(`revelation-${id}-art`)?.getChildByLabel(`revelation-${id}-art-image`) }; }),
    palisadeTint: palisade?.tint };
}

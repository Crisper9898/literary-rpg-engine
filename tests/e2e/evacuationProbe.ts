import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { evacuationState, morningBlend, updateEvacuationMorning } from "../../src/content/state/kurtzEvacuationState";
import { stationPosition } from "../../src/content/state/innerStationState";
import { evacuationPoints } from "../../src/story/heart-of-darkness/kurtzEvacuation";
import { beginNight, nightState, nightCheckpoint, nightAtmosphere, updateNight, observeAbsence, followTrace, meetNightKurtz,
  chooseNightResponse, beginNightReturn, finishNightReturn, finishNightEpilogue } from "../../src/content/state/kurtzNightEscapeState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";
/** Shortens the already-tested preceding episode through its production gates/checkpoint. */
export async function completeNight(choice = "reason") {
  if (!beginNight()) throw new Error("Revelations prerequisite missing");
  for (let i = 0; i < 8; i++) updateNight(1000);
  nightAtmosphere.write(1); updateNight(1); observeAbsence();
  for (const id of ["grass", "prints", "branches"] as const) followTrace(id);
  meetNightKurtz(); chooseNightResponse(choice === "reason" ? "reason" : "challenge"); beginNightReturn();
  nightCheckpoint.write({ ...nightState(), escort: { x: 1575, y: 800 } });
  finishNightReturn(); finishNightEpilogue(); await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), environment = world?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("marlow-station"), cot = actors?.getChildByLabel("kurtz-procession");
  const cargo = actors?.getChildByLabel("evacuation-ivory");
  return { state: evacuationState(), previous: nightState().choice, morning: morningBlend.read(),
    player: player && { x: player.x, y: player.y }, cot: cot && { x: cot.x, y: cot.y, visible: cot.visible },
    cargoAlpha: cargo?.alpha, cargoSize: cargo && { width: cargo.width, height: cargo.height },
    cargoFoot: cargo && { x: cargo.x, y: cargo.y },
    ropeVisible: world?.getChildByLabel("ground")?.getChildByLabel("evacuation-landing-rope")?.visible,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-evacuation:") || c.alias.startsWith("journey-kurtz-night:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    entities: ["marlow-station", "kurtz-procession", "evacuation-ivory"].map(id =>
      ({ id, count: actors?.children.filter(child => child.label === id).length ?? 0 })),
    artReady: !!environment?.getChildByLabel("inner-station-art")?.getChildByLabel("inner-station-art-image") &&
      !!cot?.getChildByLabel("kurtz-art")?.getChildByLabel("kurtz-art-image") &&
      [0, 1].every(i => !!cot?.getChildByLabel(`kurtz-bearer-${i}`)?.getChildByLabel(`bearer-art-${i}`)?.getChildByLabel(`bearer-art-${i}-image`)),
  };
}
export function go(id: string) {
  const point = id === "ahead" ? { x: Math.max(480, evacuationState().cot.x - 125), y: 800 } :
    id === "far" ? { x: 1640, y: 800 } : id === "patient" ? { x: 1230, y: 830 } :
    id === "bindings" ? { x: 1450, y: 835 } : id === "cargo" ? { x: 650, y: 790 } :
    evacuationPoints[id as keyof typeof evacuationPoints];
  if (!point) throw new Error(`Unknown approach ${id}`); stationPosition.write({ ...point });
}
export function finishMorning() { for (let i = 0; i < 4; i++) updateEvacuationMorning(1000); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

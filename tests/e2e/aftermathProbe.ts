import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { beginFinalNight, takeCandle, placeCandle, chooseVigilResponse, finishVigil, hearFinalWords,
  finishFinalWords, leavePatient, confirmKurtzDeath, finishFinalNight, finalNightState, finalNightPosition } from "../../src/content/state/kurtzFinalNightState";
import { aftermathState, aftermathPosition } from "../../src/content/state/kurtzAftermathState";
import { breakdownState } from "../../src/content/state/kurtzBreakdownState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";

/** Shortens only the previously validated final evening. New aftermath is driven by keys. */
export async function completeFinalNight(response = "listen") {
  if (!beginFinalNight()) throw new Error("Completed repair required");
  takeCandle(); placeCandle(); chooseVigilResponse(response === "reassure" ? "reassure" : "listen");
  finishVigil(); hearFinalWords(); finishFinalWords(); leavePatient(); confirmKurtzDeath(); finishFinalNight();
  await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), environment = world?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("aftermath-player") ?? actors?.getChildByLabel("final-night-player");
  const papers = actors?.getChildByLabel("aftermath-papers");
  return { state: aftermathState(), vigil: finalNightState().response, papersResponse: breakdownState().papersResponse,
    player: player && { x: player.x, y: player.y }, papersVisible: papers?.visible,
    bankX: environment?.getChildByLabel("parallax-near-bank")?.x,
    riverX: environment?.getChildByLabel("parallax-river-current")?.x,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    entities: ["aftermath-player", "aftermath-papers"].map(id => ({ id, count: actors?.children.filter(c => c.label === id).length ?? 0 })),
    patientCount: actors?.children.filter(c => c.label === "breakdown-kurtz" || c.label === "final-night-kurtz").length ?? 0,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-aftermath:") || c.alias.startsWith("journey-kurtz-final-night:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image") &&
      !!papers?.getChildByLabel("breakdown-papers-art")?.getChildByLabel("breakdown-papers-art-image"),
  };
}
const points: Record<string, { x: number; y: number }> = { entry: { x: 1190, y: 800 },
  burial: { x: 1440, y: 700 }, papers: { x: 850, y: 750 }, care: { x: 1190, y: 800 },
  water: { x: 870, y: 730 }, shelter: { x: 760, y: 800 }, recovery: { x: 1440, y: 700 }, far: { x: 440, y: 835 } };
export function go(id: string) {
  const p = points[id]; if (!p) throw new Error(`Unknown point ${id}`);
  (aftermathState().phase === "inactive" ? finalNightPosition : aftermathPosition).write({ ...p });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

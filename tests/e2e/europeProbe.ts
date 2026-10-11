import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { beginAftermath, hearBurial, securePapers, chooseCareResponse, receiveHelp, finishCareExchange,
  collectWater, beginRest, finishRest, finishAftermath, aftermathState, aftermathPosition } from "../../src/content/state/kurtzAftermathState";
import { europeState, europePosition } from "../../src/content/state/europeReturnState";
import { breakdownState } from "../../src/content/state/kurtzBreakdownState";
import { finalNightPosition } from "../../src/content/state/kurtzFinalNightState";
import { europePoints } from "../../src/story/heart-of-darkness/europeReturn";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";

/** Shortens the already validated illness only. Europe is entered/explored with real keys. */
export async function completeAftermath(response = "help") {
  if (!beginAftermath()) throw new Error("Completed final night required");
  hearBurial(); securePapers(); chooseCareResponse(response === "alone" ? "alone" : "help");
  if (response !== "alone") receiveHelp(); finishCareExchange();
  if (response === "alone") collectWater(); beginRest(); finishRest(); finishAftermath();
  await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), ground = world?.getChildByLabel("ground");
  const player = actors?.getChildByLabel("europe-player") ?? actors?.getChildByLabel("aftermath-player");
  const report = ground?.getChildByLabel("europe-report");
  return { state: europeState(), care: aftermathState().response, papersResponse: breakdownState().papersResponse,
    player: player && { x: player.x, y: player.y }, reportVisible: report?.visible,
    postscriptVisible: ground?.getChildByLabel("europe-postscript")?.visible,
    pressureVisible: ground?.getChildByLabel("europe-pressure")?.visible,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    playerCount: actors?.children.filter(c => c.label === "europe-player").length ?? 0,
    reportCount: ground?.children.filter(c => c.label === "europe-report").length ?? 0,
    overlays: document.querySelectorAll(".journey-conversation.station-conversation").length,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-europe-return:") || c.alias.startsWith("journey-kurtz-aftermath:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image") &&
      !!report?.getChildByLabel("europe-report-art")?.getChildByLabel("europe-report-art-image"),
  };
}
export function go(id: keyof typeof europePoints) {
  const p = europePoints[id]; if (!p) throw new Error(`Unknown point ${id}`);
  if (europeState().phase !== "inactive") europePosition.write({ ...p });
  else (aftermathState().phase === "inactive" ? finalNightPosition : aftermathPosition)
    .write(id === "far" ? { x: 440, y: 835 } : { ...p });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

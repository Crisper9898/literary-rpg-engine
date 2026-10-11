import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { beginLegacy, chooseCousinResponse, finishCousinExchange, collectFamilyLetters, deliverFamilyLetters,
  chooseJournalistResponse, finishJournalistExchange, collectLegacyReport, deliverLegacyReport, finishLegacy,
  legacyState } from "../../src/content/state/kurtzLegacyState";
import { intendedState, intendedPosition } from "../../src/content/state/kurtzIntendedState";
import { europePosition } from "../../src/content/state/europeReturnState";
import { intendedPoints } from "../../src/story/heart-of-darkness/kurtzIntended";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { inspect as legacyInspect } from "./legacyProbe";
export { settleFrame, restart } from "./stationProbe";

/** Only shortens the previously validated visitors; never seeds this episode. */
export async function completeLegacy(response = "music") {
  if (!beginLegacy()) throw new Error("Company departure required");
  chooseCousinResponse(response === "witness" ? "witness" : "music"); finishCousinExchange();
  collectFamilyLetters(); deliverFamilyLetters(); chooseJournalistResponse("party"); finishJournalistExchange();
  collectLegacyReport(); deliverLegacyReport(); finishLegacy(); await showJourneySpace(); return inspect();
}
export function inspect() {
  const prior = legacyInspect(), world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), ground = world?.getChildByLabel("ground");
  const player = actors?.getChildByLabel("intended-player"), packet = ground?.getChildByLabel("intended-packet");
  return { ...prior, legacy: legacyState(), state: intendedState(), player: player ? { x: player.x, y: player.y } : prior.player,
    playerCount: actors?.children.filter(c => c.label === "intended-player").length ?? 0,
    packetVisible: packet?.visible, packetCount: ground?.children.filter(c => c.label === "intended-packet").length ?? 0,
    dusk: world?.getChildByLabel("environment")?.getChildByLabel("intended-dusk")?.alpha,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    artReady: player ? !!player.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image") : prior.artReady,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-intended:") || c.alias.startsWith("journey-kurtz-legacy:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof intendedPoints) {
  const p = intendedPoints[id]; if (!p) throw new Error(`Unknown point ${id}`);
  (intendedState().phase === "inactive" ? europePosition : intendedPosition).write({ ...p });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

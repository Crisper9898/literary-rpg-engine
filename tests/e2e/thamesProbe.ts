import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { beginIntended, deliverIntendedLetters, chooseIntendedApproach, finishIntendedExchange,
  hearLastWordsRequest, finishLastWords, leaveIntended, intendedPosition, intendedState } from "../../src/content/state/kurtzIntendedState";
import { thamesState, thamesPosition } from "../../src/content/state/thamesConclusionState";
import { thamesPoints } from "../../src/story/heart-of-darkness/thamesConclusion";
import { intendedPoints } from "../../src/story/heart-of-darkness/kurtzIntended";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { inspect as intendedInspect } from "./intendedProbe";
export { settleFrame, restart } from "./stationProbe";

/** Shortens only the already tested visit, using its production transitions. */
export async function completeIntended(approach = "witness") {
  if (!beginIntended()) throw new Error("Completed legacy required");
  deliverIntendedLetters(); chooseIntendedApproach(approach === "listen" ? "listen" : "witness");
  finishIntendedExchange(); hearLastWordsRequest(); finishLastWords(); leaveIntended();
  await showJourneySpace(); return inspect();
}
export function inspect() {
  const prior = intendedInspect(), world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), player = actors?.getChildByLabel("thames-player");
  const current = world?.getChildByLabel("environment")?.getChildByLabel("parallax-thames-current");
  return { ...prior, intended: intendedState(), state: thamesState(), player: player ? { x: player.x, y: player.y } : prior.player,
    playerCount: actors?.children.filter(c => c.label === "thames-player").length ?? 0,
    mooringCount: world?.getChildByLabel("ground")?.children.filter(c => c.label === "thames-mooring").length ?? 0,
    veil: world?.getChildByLabel("foreground")?.getChildByLabel("thames-overcast")?.alpha,
    currentX: current?.x, currentCount: current?.children.length ?? 0,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    artReady: player ? !!player.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image") : prior.artReady,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-thames:") || c.alias.startsWith("journey-kurtz-intended:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof thamesPoints) {
  const p = thamesState().phase === "inactive" ? intendedPoints[id === "entry" ? "window" : "far"] : thamesPoints[id];
  if (!p) throw new Error(`Unknown point ${id}`);
  (thamesState().phase === "inactive" ? intendedPosition : thamesPosition).write({ ...p });
}
export function place(data: string) { thamesPosition.write(JSON.parse(data)); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

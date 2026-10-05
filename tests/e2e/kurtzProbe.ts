import { canvas, narration, sound } from "@drincs/pixi-vn";
import { setJourneySpace } from "../../src/content/state/woodStopState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { stationPosition, observeStation, rememberTopic, setRussianStance, completeRussianConversation,
  markStation, russianMood } from "../../src/content/state/innerStationState";
import { kurtzIntroduction, updateKurtzIntroduction, kurtzStage, kurtzPosition, kurtzPose,
  kurtzFirstResponse, kurtzObserved } from "../../src/content/state/kurtzIntroductionState";
export { save, restore, settleFrame, prepare, dockTo } from "./stationProbe";
export async function seed(stance: "listen" | "question" = "listen") {
  observeStation("planks"); observeStation("grass"); observeStation("house");
  for (const topic of stance === "listen" ? ["kurtz", "station", "attack", "relation"] as const :
    ["station", "kurtz", "relation", "attack"] as const) rememberTopic(topic);
  setRussianStance(stance); completeRussianConversation(); markStation("kurtzEncounterPrepared");
  markStation("stationCreakSeen"); markStation("russianMet");
  setJourneySpace("inner-station"); await showJourneySpace(); go("path");
}
export function go(id: string) {
  const position = id === "path" ? { x: 1520, y: 755 } : id === "kurtz" ? { x: 1225, y: 800 } :
    id === "russian" ? { x: 1010, y: 790 } : id === "bindings" ? { x: 1490, y: 795 } :
    id === "witnesses" ? { x: 1090, y: 720 } : id === "threshold" ? { x: 1570, y: 715 } : { x: 540, y: 780 };
  stationPosition.write(position);
}
/** Exercise the production progression, never inject a made-up reveal flag. */
export function advanceTo(target: number) {
  while (kurtzIntroduction().activated && kurtzIntroduction().elapsedMS < target) {
    const remaining = target - kurtzIntroduction().elapsedMS; updateKurtzIntroduction(Math.min(1000, remaining));
  }
}
export function inspect() {
  const root = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const group = root?.getChildByLabel("actors")?.getChildByLabel("kurtz-procession");
  const player = root?.getChildByLabel("actors")?.getChildByLabel("marlow-station");
  const art = group?.getChildByLabel("kurtz-art");
  return { introduction: kurtzIntroduction(), stage: kurtzStage(), position: kurtzPosition(), pose: kurtzPose(),
    response: kurtzFirstResponse(), observed: kurtzObserved(), russianMood: russianMood(),
    player: player && { x: player.x, y: player.y }, renderedPosition: group && { x: group.x, y: group.y },
    visible: group?.visible, tint: group?.tint,
    ready: !!art?.getChildByLabel("kurtz-art-image") && [0, 1].every(i => !!group?.getChildByLabel(`kurtz-bearer-${i}`)
      ?.getChildByLabel(`bearer-art-${i}`)?.getChildByLabel(`bearer-art-${i}-image`)),
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    sources: sound.channels.values.filter(x => x.alias.startsWith("journey-inner-station:")).map(x => ({ id: x.alias, volume: x.volume, count: x.mediaInstances.length })) };
}

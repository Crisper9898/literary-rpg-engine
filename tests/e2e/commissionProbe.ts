import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { commissionState, commissionPosition } from "../../src/content/state/companyCommissionState";
import { prologueState } from "../../src/content/state/thamesPrologueState";
import { europeState } from "../../src/content/state/europeReturnState";
import { currentJourneySpace } from "../../src/content/state/woodStopState";
import { companyPoints } from "../../src/story/heart-of-darkness/companyCommission";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { commissionStart } from "../../src/content/labels/companyCommission.label";
export { settleFrame, restart } from "./stationProbe";

export function inspect() {
  const world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), player = actors?.getChildByLabel("commission-player");
  return { state: commissionState(), prologue: prologueState(), europe: europeState(), space: currentJourneySpace(),
    player: player ? { x: player.x, y: player.y } : undefined,
    playerCount: actors?.children.filter(c => c.label === "commission-player").length ?? 0,
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
    deck: !!canvas.layers.get("journey-deck"),
    veil: world?.getChildByLabel("foreground")?.getChildByLabel("commission-pressure-veil")?.alpha,
    mapAlpha: world?.getChildByLabel("environment")?.getChildByLabel("commission-map")?.alpha,
    overlays: document.querySelectorAll(".journey-conversation").length,
    dialogue: narration.dialogue?.text,
    choices: (narration.choices.list ?? []).map(c => c.text),
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-commission:") || c.alias.startsWith("journey-deck:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof companyPoints) {
  const p = companyPoints[id]; if (!p) throw new Error(`Unknown point ${id}`); commissionPosition.write({ ...p });
}
export function place(data: string) { commissionPosition.write(JSON.parse(data)); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export async function restartCommission() { await Game.start(commissionStart, {}); }

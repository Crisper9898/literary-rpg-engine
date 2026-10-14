import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { outerState, outerPosition } from "../../src/content/state/outerStationState";
import { commissionState } from "../../src/content/state/companyCommissionState";
import { prologueState } from "../../src/content/state/thamesPrologueState";
import { currentJourneySpace } from "../../src/content/state/woodStopState";
import { outerPoints } from "../../src/story/heart-of-darkness/outerStation";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { outerStart } from "../../src/content/labels/outerStation.label";
export { settleFrame, restart } from "./stationProbe";

export function inspect() {
  const world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), player = actors?.getChildByLabel("outer-player");
  const environment = world?.getChildByLabel("environment");
  const ground = world?.getChildByLabel("ground"), office = ground?.getChildByLabel("outer-office");
  const slope = ground?.getChildByLabel("outer-slope");
  return { state: outerState(), commission: commissionState(), prologue: prologueState(), space: currentJourneySpace(),
    player: player ? { x: player.x, y: player.y } : undefined,
    playerCount: actors?.children.filter(c => c.label === "outer-player").length ?? 0,
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
    forestReady: !!environment?.getChildByLabel("outer-forest")?.getChildByLabel("outer-forest-image"),
    coast: !!environment?.getChildByLabel("outer-warship"), office: !!office,
    officeAboveSlope: !!office && !!slope && ground!.getChildIndex(office) > ground!.getChildIndex(slope),
    veil: world?.getChildByLabel("foreground")?.getChildByLabel("outer-pressure-veil")?.alpha,
    deck: !!canvas.layers.get("journey-deck"), overlays: document.querySelectorAll(".journey-conversation").length,
    dialogue: narration.dialogue?.text, choices: (narration.choices.list ?? []).map(c => c.text),
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-outer:") || c.alias.startsWith("journey-deck:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof outerPoints) {
  const p = outerPoints[id]; if (!p) throw new Error(`Unknown point ${id}`); outerPosition.write({ ...p }); return { ...p };
}
export function place(data: string) { outerPosition.write(JSON.parse(data)); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export async function restartOuter() { await Game.start(outerStart, {}); }

import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { centralState, centralPosition } from "../../src/content/state/centralStationState";
import { outerState } from "../../src/content/state/outerStationState";
import { commissionState } from "../../src/content/state/companyCommissionState";
import { prologueState } from "../../src/content/state/thamesPrologueState";
import { currentJourneySpace } from "../../src/content/state/woodStopState";
import { centralPoints } from "../../src/story/heart-of-darkness/centralStation";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { centralStart } from "../../src/content/labels/centralStation.label";
export { settleFrame, restart } from "./stationProbe";

export function inspect() {
  const world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), player = actors?.getChildByLabel("central-player");
  const environment = world?.getChildByLabel("environment"), ground = world?.getChildByLabel("ground");
  const soil = ground?.getChildByLabel("central-soil"), gate = ground?.getChildByLabel("central-gate");
  const bounds = player?.getBounds();
  return {
    state: centralState(), outer: outerState(), commission: commissionState(), prologue: prologueState(), space: currentJourneySpace(),
    player: player ? { x: player.x, y: player.y } : undefined,
    bounds: bounds ? { minX: bounds.minX, minY: bounds.minY, maxX: bounds.maxX, maxY: bounds.maxY } : undefined,
    playerCount: actors?.children.filter(child => child.label === "central-player").length ?? 0,
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
    forestReady: !!environment?.getChildByLabel("central-forest")?.getChildByLabel("central-forest-image"),
    caravan: !!ground?.getChildByLabel("central-ravine"), gate: !!gate,
    gateAboveSoil: !!gate && !!soil && ground!.getChildIndex(gate) > ground!.getChildIndex(soil),
    wreck: !!ground?.getChildByLabel("central-wreck"),
    veil: world?.getChildByLabel("foreground")?.getChildByLabel("central-pressure-veil")?.alpha,
    deck: !!canvas.layers.get("journey-deck"), overlays: document.querySelectorAll(".journey-conversation").length,
    dialogue: narration.dialogue?.text, choices: (narration.choices.list ?? []).map(choice => choice.text),
    labels: narration.labels.opened.filter(item => item.label.startsWith("journey-station-")).map(item => item.label),
    sources: sound.channels.values.filter(channel => ["journey-central:", "journey-outer:", "journey-deck:"].some(prefix => channel.alias.startsWith(prefix)))
      .map(channel => ({ id: channel.alias, volume: channel.volume, count: channel.mediaInstances.length })),
  };
}
export function go(id: keyof typeof centralPoints) {
  const point = centralPoints[id]; if (!point) throw new Error(`Unknown point ${id}`);
  centralPosition.write({ ...point }); return { ...point };
}
export function place(data: string) { centralPosition.write(JSON.parse(data)); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export async function restartCentral() { await Game.start(centralStart, {}); }

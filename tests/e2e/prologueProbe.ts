import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { prologueState, prologuePosition } from "../../src/content/state/thamesPrologueState";
import { thamesState } from "../../src/content/state/thamesConclusionState";
import { currentJourneySpace } from "../../src/content/state/woodStopState";
import { thamesPoints } from "../../src/story/heart-of-darkness/thamesConclusion";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { prologueStart } from "../../src/content/labels/thamesPrologue.label";
export { settleFrame, restart } from "./stationProbe";

export function inspect() {
  const world = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), player = actors?.getChildByLabel("prologue-player");
  const current = world?.getChildByLabel("environment")?.getChildByLabel("parallax-prologue-current");
  return { state: prologueState(), ending: thamesState(), space: currentJourneySpace(),
    player: player ? { x: player.x, y: player.y } : undefined,
    playerCount: actors?.children.filter(c => c.label === "prologue-player").length ?? 0,
    artReady: !!player?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
    deck: !!canvas.layers.get("journey-deck"),
    veil: world?.getChildByLabel("foreground")?.getChildByLabel("thames-overcast")?.alpha,
    overlays: document.querySelectorAll(".journey-conversation").length,
    dialogue: narration.dialogue?.text,
    currentX: current?.x, currentCount: current?.children.length ?? 0,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-prologue:") || c.alias.startsWith("journey-deck:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
export function go(id: keyof typeof thamesPoints) {
  const p = thamesPoints[id]; if (!p) throw new Error(`Unknown point ${id}`); prologuePosition.write({ ...p });
}
export function place(data: string) { prologuePosition.write(JSON.parse(data)); }
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export async function restartPrologue() { await Game.start(prologueStart, {}); }

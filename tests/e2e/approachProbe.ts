import { canvas, Game, sound, narration } from "@drincs/pixi-vn";
import type { Container } from "pixi.js";
import { approachCheckpoint, approachPosition, approachAtmosphere, helmsmanFate,
  atApproachHelm, approachProfile, seenApproachBeat } from "../../src/content/state/approachState";
import { decideApproach, loadWood, setJourneySpace, approachDecision } from "../../src/content/state/woodStopState";
import { woodStopPosition } from "../../src/content/state/woodStopState";
import { journeyPlayerPosition } from "../../src/content/state/journeyState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { updateRiverApproach } from "../../src/content/scenes/updateRiverApproach";
import { NavigationController } from "../../src/puzzles/riverApproach/NavigationController";
import { approachRoute } from "../../src/story/heart-of-darkness/riverApproach";

export async function prepareHut(decision: "wait" | "proceed") {
  decideApproach(decision); loadWood(); woodStopPosition.write({ x: 1600, y: 845 });
  setJourneySpace("wood-stop"); await showJourneySpace();
}
export function nearHelm() { journeyPlayerPosition.write({ x: 900, y: 748 }); }
export function moveAway() { approachPosition.write({ x: 1400, y: 780 }); }
export function alignChannel(lateral: number) {
  const state = approachCheckpoint.read()!;
  approachCheckpoint.write({ ...state, lateral, heading: 0 });
}
export function inspect() {
  const scene = canvas.layers.get("journey-approach"), world = scene?.getChildByLabel("world") as Container | undefined;
  const actors = world?.getChildByLabel("actors") as Container | undefined;
  const player = actors?.getChildByLabel("playerSpawn");
  return { navigation: approachCheckpoint.read(), atHelm: atApproachHelm(), fate: helmsmanFate(),
    position: player ? { x: player.x, y: player.y } : undefined,
    atmosphere: approachAtmosphere.read(), decision: approachDecision(), profile: approachProfile(approachDecision()),
    labels: narration.labels.opened.filter(v => v.label.startsWith("journey-approach")).map(v => v.label),
    seen: ["arrival", "left", "right", "attack", "helmsman", "after"].filter(id => seenApproachBeat(id as Parameters<typeof seenApproachBeat>[0])),
    loadedArt: !!actors?.getChildByLabel("helmsman")?.getChildByLabel("helmsman-art")?.getChildByLabel("helmsman-art-image"),
    falling: actors?.getChildByLabel("helmsman")?.getChildByLabel("helmsman-art")?.rotation,
    fogX: world?.getChildByLabel("environment")?.getChildByLabel("approach-fog-0")?.x,
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-approach:"))
      .map(c => ({ alias: c.alias, volume: c.volume, count: c.mediaInstances.length })),
  };
}
/** Simulate the actual production controller in bounded ticks, no skipped flags. */
export function travelTo(progress: number) {
  const controller = new NavigationController(approachRoute, approachCheckpoint.read());
  for (let i = 0; i < 2500 && controller.state.progress < progress; i++) {
    const before = helmsmanFate();
    updateRiverApproach(controller, { helm: true, steer: 0, throttle: 1 }, 100);
    if (before === "alive" && helmsmanFate() === "lost") break;
  }
  return inspect();
}
export async function save() { return JSON.stringify(await Game.exportGameState()); }
export async function restore(saved: string) { await Game.restoreGameState(JSON.parse(saved)); await showJourneySpace(); return inspect(); }
export async function restart() { await Game.start("start", {}); }

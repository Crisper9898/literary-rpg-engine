import { Game, canvas, sound } from "@drincs/pixi-vn";
import { Container, Sprite } from "pixi.js";
import * as state from "../../src/content/state/woodStopState";
import { journeyPlayerPosition, journeyVoyageDistance } from "../../src/content/state/journeyState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { woodStop } from "../../src/story/heart-of-darkness/woodStop";

export function placeAt(point: "book" | "wood" | "warning" | "sailor" | "board" | "landing") {
  if (point === "landing") journeyPlayerPosition.write({ x: 430, y: 835 });
  else state.woodStopPosition.write(point === "board" ? { x: 1600, y: 845 } :
    point === "sailor" ? { x: 1460, y: 780 } : { ...woodStop.anchors[point], y: 750 });
}
export function inspect() {
  const scene = canvas.layers.get("journey-wood-stop");
  const world = scene?.getChildByLabel("world") as Container | undefined;
  const actor = (world?.getChildByLabel("actors") as Container | undefined)?.getChildByLabel("marlow-shore");
  return { space: state.currentJourneySpace(), loaded: state.woodLoaded(), warning: state.warningRead(),
    book: state.seamanshipBookRead(), decision: state.approachDecision(), departed: state.woodStopDeparted(),
    position: actor ? { x: actor.x, y: actor.y } : undefined,
    voyage: journeyVoyageDistance.read(), progress: state.woodStopAtmosphere.read(),
    loadedArt: !!world?.getChildByLabel("environment")?.getChildByLabel("wood-station-art")?.getChildByLabel("wood-station-art-image"),
    activeSources: sound.channels.values.filter(channel => channel.alias.startsWith("journey-wood-stop:"))
      .map(channel => ({ alias: channel.alias, count: channel.mediaInstances.length })),
    fogX: (world?.getChildByLabel("foreground")?.getChildByLabel("parallax-shore-foreground-fog") as Container | undefined)?.x,
    frame: (actor?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image") as Sprite | undefined)?.texture.frame.x,
  };
}
export async function save() { return JSON.stringify(await Game.exportGameState()); }
export async function restore(saved: string) {
  await Game.restoreGameState(JSON.parse(saved));
  await showJourneySpace();
  return inspect();
}
export async function restart() { await Game.start("start", {}); }

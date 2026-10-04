import { canvas, Game, narration, sound, storage } from "@drincs/pixi-vn";
import { approachCheckpoint, markApproachBeat, loseHelmsman, approachPosition } from "../../src/content/state/approachState";
import { setJourneySpace, decideApproach, readSeamanshipBook } from "../../src/content/state/woodStopState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
import { NavigationController } from "../../src/puzzles/riverApproach/NavigationController";
import { approachRoute } from "../../src/story/heart-of-darkness/riverApproach";
import { dockingProgress, dockingPosition, stationPosition, stationObservations, russianTopics,
  russianStance, stationFlag, stationEvent, stationAtmosphere, stationPressure } from "../../src/content/state/innerStationState";
import { updateStationDocking } from "../../src/content/scenes/updateStationDocking";
import { innerStation } from "../../src/story/heart-of-darkness/innerStation";

export async function prepare(progress = 1) {
  decideApproach("wait"); readSeamanshipBook(); loseHelmsman();
  for (const id of ["arrival", "left", "right", "attack", "helmsman", "after"] as const) markApproachBeat(id);
  const controller = new NavigationController(approachRoute, { progress, whistle: progress === 1 });
  approachCheckpoint.write({ ...controller.state }); approachPosition.write({ x: 900, y: 748 });
  setJourneySpace("approach"); await showJourneySpace();
}
export function go(id: string) {
  if (id === "bow") dockingPosition.write({ x: 1450, y: 780 });
  else if (id === "closing") stationPosition.write({ x: 1520, y: 755 });
  else if (id === "russian") stationPosition.write({ x: innerStation.anchors.russian.x - 95, y: innerStation.anchors.russian.y });
  else stationPosition.write({ ...(innerStation.anchors[id as keyof typeof innerStation.anchors]) });
}
export function dockTo(target: number) {
  for (let i = 0; i < 100 && (dockingProgress.read() ?? 0) < target; i++) updateStationDocking(100);
  return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station");
  const world = scene?.getChildByLabel("world"), actors = world?.getChildByLabel("actors");
  const player = actors?.getChildByLabel("marlow-station");
  return { space: storage.get("journey.currentSpace"), dock: dockingProgress.read(), observed: stationObservations(),
    position: player && { x: player.x, y: player.y }, topics: russianTopics(), stance: russianStance(), event: stationEvent(),
    atmosphere: stationAtmosphere.read(), pressure: stationPressure(), ready: stationFlag("russianComplete"), prepared: stationFlag("kurtzEncounterPrepared"),
    plateReady: !!world?.getChildByLabel("environment")?.getChildByLabel("inner-station-art")?.getChildByLabel("inner-station-art-image"),
    arrivalArtReady: !!canvas.layers.get("journey-station-arrival")?.getChildByLabel("world")?.getChildByLabel("environment")?.getChildByLabel("arrival-station-art")?.getChildByLabel("arrival-station-art-image"),
    met: stationFlag("russianMet"), artReady: !!actors?.getChildByLabel("russian-station")?.getChildByLabel("russian-art")?.getChildByLabel("russian-art-image"),
    russianVisible: actors?.getChildByLabel("russian-station")?.visible,
    labels: narration.labels.opened.filter(item => item.label.startsWith("journey-station-")).map(item => item.label),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-inner-station:") || c.alias.startsWith("journey-station-arrival:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })) };
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export async function restart() { await Game.start("start", {}); }
/** Resize observers clear the canvas before the next Pixi render. Capture only
 * after two completed ticker frames, after the app's render priority. */
export async function settleFrame() {
  for (let i = 0; i < 2; i++) await new Promise<void>(resolve => canvas.app.ticker.addOnce(() => resolve(), undefined, -100));
  const rect = canvas.app.canvas.getBoundingClientRect();
  return { pixels: [canvas.app.canvas.width, canvas.app.canvas.height], display: [rect.width, rect.height], ratio: devicePixelRatio };
}

import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { evacuationState, evacuationCheckpoint, beginEvacuation, morningBlend, updateEvacuationMorning,
  examinePatient, chooseEvacuationPriority, secureCot, clearLanding, loadFirstCargo, beginCotTransfer,
  finishEvacuation, finishEvacuationExchange } from "../../src/content/state/kurtzEvacuationState";
import { departureState, departurePosition } from "../../src/content/state/kurtzDepartureState";
import { stationPosition } from "../../src/content/state/innerStationState";
import { departurePoints } from "../../src/story/heart-of-darkness/kurtzDeparture";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";
/** Fixture shortens already-covered transport through production state transitions. */
export async function completeEvacuation(priority = "patient") {
  if (!beginEvacuation()) throw new Error("Completed night return required");
  for (let i = 0; i < 4; i++) updateEvacuationMorning(1000);
  morningBlend.write(1); updateEvacuationMorning(1); examinePatient();
  chooseEvacuationPriority(priority === "cargo" ? "cargo" : "patient"); secureCot(); clearLanding();
  if (priority === "cargo") loadFirstCargo(); beginCotTransfer();
  evacuationCheckpoint.write({ ...evacuationState(), cot: { x: 590, y: 775 } });
  finishEvacuation({ x: 510, y: 800 }); finishEvacuationExchange();
  await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), environment = world?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("departure-player") ?? actors?.getChildByLabel("marlow-station");
  const shore = environment?.getChildByLabel("departure-shore"), kurtz = actors?.getChildByLabel("departure-kurtz");
  return { state: departureState(), priority: evacuationState().priority,
    player: player && { x: player.x, y: player.y }, shore: shore && { x: shore.x, y: shore.y, scale: shore.scale.x },
    mooringVisible: world?.getChildByLabel("foreground")?.getChildByLabel("departure-mooring")?.visible,
    witnessesVisible: shore?.children.filter(c => c.label.startsWith("departure-witnesses-")).every(c => c.visible),
    riverX: environment?.getChildByLabel("parallax-river-current")?.x,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    entities: ["departure-player", "departure-kurtz", "departure-ivory"].map(id => ({ id,
      count: actors?.children.filter(c => c.label === id).length ?? 0 })),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-departure:") || c.alias.startsWith("journey-kurtz-evacuation:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!shore?.getChildByLabel("departure-station-art")?.getChildByLabel("departure-station-art-image") &&
      !!kurtz?.getChildByLabel("departure-kurtz-art")?.getChildByLabel("departure-kurtz-art-image") &&
      !!actors?.getChildByLabel("departure-player")?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
  };
}
export function go(id: string) {
  const point = id === "far" ? { x: 1480, y: 835 } : departurePoints[id as keyof typeof departurePoints];
  if (!point) throw new Error(`Unknown point ${id}`);
  if (departureState().phase === "inactive") stationPosition.write({ ...point }); else departurePosition.write({ ...point });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

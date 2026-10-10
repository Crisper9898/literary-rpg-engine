import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import type { Sprite } from "pixi.js";
import { beginDeparture, releaseMooring, chooseDepartureResponse, warnCrew, useWhistle, startManoeuvre,
  updateDeparture, finishDepartureExchange, departurePosition, departureState } from "../../src/content/state/kurtzDepartureState";
import { breakdownState, breakdownPosition } from "../../src/content/state/kurtzBreakdownState";
import { breakdownPoints } from "../../src/story/heart-of-darkness/kurtzBreakdown";
import { discover, discoveries } from "../../src/content/state/stationRevelationsState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";
/** Shortens the already-tested departure via production transitions, never starts the new episode. */
export async function completeDeparture(response = "whistle") {
  if (!beginDeparture()) throw new Error("Completed evacuation required");
  releaseMooring(); chooseDepartureResponse(response === "intervene" ? "intervene" : "whistle");
  if (response === "intervene") warnCrew(); useWhistle(); startManoeuvre();
  for (let i = 0; i < 100; i++) updateDeparture(100); finishDepartureExchange();
  if (response === "intervene") discover("report");
  await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), environment = world?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("breakdown-player") ?? actors?.getChildByLabel("departure-player");
  const patient = actors?.getChildByLabel("breakdown-kurtz"), papers = actors?.getChildByLabel("breakdown-papers");
  const patientImage = patient?.getChildByLabel("breakdown-kurtz-art")?.getChildByLabel("breakdown-kurtz-art-image") as Sprite | undefined;
  return { state: breakdownState(), previous: departureState().response, reportSeen: discoveries().includes("report"),
    player: player && { x: player.x, y: player.y }, bankX: environment?.getChildByLabel("parallax-near-bank")?.x,
    riverX: environment?.getChildByLabel("parallax-river-current")?.x,
    papersVisible: papers?.visible, rodVisible: actors?.getChildByLabel("breakdown-engine")?.getChildByLabel("breakdown-rod")?.visible,
    forgeVisible: actors?.getChildByLabel("breakdown-forge")?.visible,
    patientFrame: patientImage && { x: patientImage.texture.frame.x, y: patientImage.texture.frame.y,
      width: patientImage.texture.frame.width, height: patientImage.texture.frame.height },
    patientSize: patientImage && { width: patientImage.width, height: patientImage.height },
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    entities: ["breakdown-player", "breakdown-kurtz", "breakdown-papers", "breakdown-engine", "breakdown-forge"].map(id => ({ id,
      count: actors?.children.filter(c => c.label === id).length ?? 0 })),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-breakdown:") || c.alias.startsWith("journey-kurtz-departure:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!patient?.getChildByLabel("breakdown-kurtz-art")?.getChildByLabel("breakdown-kurtz-art-image") &&
      !!papers?.getChildByLabel("breakdown-papers-art")?.getChildByLabel("breakdown-papers-art-image") &&
      !!actors?.getChildByLabel("breakdown-player")?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
  };
}
export function go(id: string) {
  const point = id === "far" ? { x: 450, y: 820 } : breakdownPoints[id as keyof typeof breakdownPoints];
  if (!point) throw new Error(`Unknown point ${id}`);
  if (breakdownState().phase === "inactive") departurePosition.write({ ...point }); else breakdownPosition.write({ ...point });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

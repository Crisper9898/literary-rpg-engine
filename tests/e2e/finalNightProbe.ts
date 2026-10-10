import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import type { Sprite } from "pixi.js";
import { beginBreakdown, updateBreakdown, hearBreakdown, examineEngine, startForge, fitRod,
  choosePapersResponse, finishPapersExchange, resumeDownstream, finishBreakdownExchange,
  breakdownPosition, breakdownState } from "../../src/content/state/kurtzBreakdownState";
import { finalNightState, finalNightPosition } from "../../src/content/state/kurtzFinalNightState";
import { finalNightPoints } from "../../src/story/heart-of-darkness/kurtzFinalNight";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";

/** Shortens the already-tested repair via production transitions. Never enters the new night. */
export async function completeBreakdown(response = "sealed") {
  if (!beginBreakdown()) throw new Error("Completed departure required");
  const worker = { x: 1250, y: 800 };
  for (let i = 0; i < 130; i++) updateBreakdown(50, worker);
  hearBreakdown(); examineEngine(); startForge();
  for (let i = 0; i < 80; i++) updateBreakdown(50, worker);
  fitRod(); choosePapersResponse(response === "ask" ? "ask" : "sealed"); finishPapersExchange();
  resumeDownstream(); finishBreakdownExchange(); await showJourneySpace(); return inspect();
}
export function inspect() {
  const scene = canvas.layers.get("journey-inner-station"), world = scene?.getChildByLabel("world");
  const actors = world?.getChildByLabel("actors"), environment = world?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("final-night-player") ?? actors?.getChildByLabel("breakdown-player");
  const patient = actors?.getChildByLabel("final-night-kurtz"), candle = actors?.getChildByLabel("final-night-candle");
  const image = patient?.getChildByLabel("breakdown-kurtz-art")?.getChildByLabel("breakdown-kurtz-art-image") as Sprite | undefined;
  return { state: finalNightState(), papersResponse: breakdownState().papersResponse,
    player: player && { x: player.x, y: player.y }, patientVisible: patient?.visible,
    candleVisible: candle?.visible, candlePoint: candle && { x: candle.x, y: candle.y },
    bankX: environment?.getChildByLabel("parallax-near-bank")?.x,
    riverX: environment?.getChildByLabel("parallax-river-current")?.x,
    patientFrame: image && { x: image.texture.frame.x, y: image.texture.frame.y, width: image.texture.frame.width, height: image.texture.frame.height },
    patientSize: image && { width: image.width, height: image.height },
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    entities: ["final-night-player", "final-night-kurtz", "final-night-candle"].map(id => ({ id,
      count: actors?.children.filter(c => c.label === id).length ?? 0 })),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-final-night:") || c.alias.startsWith("journey-kurtz-breakdown:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!image && !!actors?.getChildByLabel("final-night-player")?.getChildByLabel("marlow-art")?.getChildByLabel("marlow-art-image"),
  };
}
export function go(id: string) {
  const p = id === "far" ? { x: 1450, y: 835 } : finalNightPoints[id as keyof typeof finalNightPoints];
  if (!p) throw new Error(`Unknown point ${id}`);
  (finalNightState().phase === "inactive" ? breakdownPosition : finalNightPosition).write({ ...p });
}
export async function save() { return { data: JSON.stringify(await Game.exportGameState()), ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }

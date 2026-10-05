import { canvas, Game, narration, sound } from "@drincs/pixi-vn";
import { stationPosition, russianStance } from "../../src/content/state/innerStationState";
import { nightState, nightAtmosphere, nightForestBlend, updateNight } from "../../src/content/state/kurtzNightEscapeState";
import { nightTracePoints, nightRest } from "../../src/story/heart-of-darkness/kurtzNightEscape";
import { interpretation } from "../../src/content/state/stationRevelationsState";
import { kurtzFirstResponse } from "../../src/content/state/kurtzIntroductionState";
import { showJourneySpace } from "../../src/content/scenes/journeyDeck";
export { settleFrame, restart } from "./stationProbe";
export function inspect() {
  const root = canvas.layers.get("journey-inner-station")?.getChildByLabel("world");
  const actors = root?.getChildByLabel("actors"), environment = root?.getChildByLabel("environment");
  const player = actors?.getChildByLabel("marlow-station"), kurtz = actors?.getChildByLabel("night-kurtz");
  return { state: nightState(), player: player && { x: player.x, y: player.y },
    kurtz: kurtz && { x: kurtz.x, y: kurtz.y, visible: kurtz.visible, alpha: kurtz.alpha },
    bed: actors?.getChildByLabel("night-empty-bed")?.alpha, resting: actors?.getChildByLabel("night-resting-kurtz")?.visible,
    followers: environment?.getChildByLabel("night-followers-art")?.alpha,
    night: nightAtmosphere.read(), forest: nightForestBlend.read(), previousChoice: interpretation(),
    firstResponse: kurtzFirstResponse(), russianStance: russianStance(), text: narration.dialogue?.text,
    labels: narration.labels.opened.filter(x => x.label.startsWith("journey-station-")).map(x => x.label),
    entities: ["marlow-station", "night-kurtz", "night-empty-bed", "night-trace-grass", "night-trace-prints", "night-trace-branches"]
      .map(id => ({ id, count: actors?.children.filter(c => c.label === id).length ?? 0 })),
    sources: sound.channels.values.filter(c => c.alias.startsWith("journey-kurtz-night:") || c.alias.startsWith("journey-inner-station:"))
      .map(c => ({ id: c.alias, volume: c.volume, count: c.mediaInstances.length })),
    artReady: !!environment?.getChildByLabel("night-station-art")?.getChildByLabel("night-station-art-image") &&
      !!environment?.getChildByLabel("night-forest-art")?.getChildByLabel("night-forest-art-image") &&
      !!kurtz?.getChildByLabel("night-kurtz-art")?.getChildByLabel("night-kurtz-art-image"),
  };
}
export async function save() { const data = JSON.stringify(await Game.exportGameState()); return { data, ...inspect() }; }
export async function restore(data: string) { await Game.restoreGameState(JSON.parse(data)); await showJourneySpace(); return inspect(); }
export function go(id: string) {
  const target = nightTracePoints[id as keyof typeof nightTracePoints]?.position;
  stationPosition.write(id === "vigil" ? { x: 420, y: 745 } : id === "bed" ? { x: nightRest.x - 70, y: 820 } :
    id === "kurtz" ? { x: 1190, y: 820 } : id === "exit" ? { x: 1640, y: 800 } : id === "beside" ?
    { x: Math.min(1640, nightState().escort.x + 110), y: 800 } : target ? { x: target.x, y: Math.min(860, target.y + 18) } : { x: 410, y: 760 });
}
/** Advances only the finite production dusk source; weather still needs real rendered frames. */
export function finishDusk() { for (let i = 0; i < 8; i++) updateNight(1000); }

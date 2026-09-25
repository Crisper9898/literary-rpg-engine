import { Game, canvas } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { hasInspectedCargoMark, journeyAtmosphereProgress, journeyPlayerPosition,
  journeyVoyageDistance } from "../../src/content/state/journeyState";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";

let spatialScene: ReturnType<typeof showJourneyDeck> | undefined;

/** Test-only bridge to Pixi'VN's canonical game-state API. */
export async function saveJourney(): Promise<string> {
  return JSON.stringify(await Game.exportGameState());
}

export async function restoreJourney(serialized: string) {
  await Game.restoreGameState(JSON.parse(serialized));
  return { position: journeyPlayerPosition.read(), distance: journeyVoyageDistance.read(),
    atmosphereProgress: journeyAtmosphereProgress.read() };
}

export function inspectRestoredJourney() {
  return {
    inspected: hasInspectedCargoMark(),
    scene: !!canvas.layers.get("journey-deck"),
  };
}

export function playerPosition() {
  const presentation = canvas.layers.get("journey-deck")!;
  const world = presentation.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const player = actors.getChildByLabel("playerSpawn")!;
  return { x: player.x, y: player.y };
}

export function mountSpatialJourney() {
  spatialScene = showJourneyDeck();
}

/** Fast-forward only the actual near-bank travel controller, then let live frames render. */
export function advanceVoyage(ticks: number) {
  if (!spatialScene) throw new Error("Spatial journey is not mounted.");
  for (let index = 0; index < ticks; index++) spatialScene.voyage.update(50);
}

export function journeyPhase() {
  if (!spatialScene) throw new Error("Spatial journey is not mounted.");
  const presentation = canvas.layers.get("journey-deck")!;
  const world = presentation.getChildByLabel("world") as Container;
  const environment = world.getChildByLabel("environment") as Container;
  const fog = environment.getChildByLabel("parallax-weather-distantFog") as Container;
  return { distance: spatialScene.voyage.distance, progress: spatialScene.atmosphere.progress,
    fogAlpha: fog.alpha, worldTint: world.tint };
}

/** Verify restored scenery is live, not merely present in the save snapshot. */
export function sampleRestoredScenery(frames = 8) {
  const presentation = canvas.layers.get("journey-deck")!;
  const world = presentation.getChildByLabel("world") as Container;
  const environment = world.getChildByLabel("environment") as Container;
  const bank = environment.getChildByLabel("parallax-near-bank") as Container;
  const fog = environment.getChildByLabel("parallax-weather-distantFog") as Container;
  const initial = { bank: bank.x, fog: fog.x };
  const ticker = canvas.app.ticker;
  return new Promise<{ bank: number; fog: number }>((resolve, reject) => {
    let count = 0;
    const cleanup = () => { ticker.remove(sample); clearTimeout(timeout); };
    const sample = (_frame: Ticker) => {
      if (++count === frames) {
        cleanup();
        resolve({ bank: bank.x - initial.bank, fog: fog.x - initial.fog });
      }
    };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Restored scenery did not tick")); }, 10_000);
    ticker.add(sample, undefined, UPDATE_PRIORITY.LOW);
  });
}

import { Game, canvas } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { hasInspectedCargoMark } from "../../src/content/state/journeyState";

/** Test-only bridge to Pixi'VN's canonical game-state API. */
export async function saveJourney(): Promise<string> {
  return JSON.stringify(await Game.exportGameState());
}

export async function restoreJourney(serialized: string): Promise<void> {
  await Game.restoreGameState(JSON.parse(serialized));
}

export function inspectRestoredJourney() {
  return {
    inspected: hasInspectedCargoMark(),
    scene: !!canvas.layers.get("journey-deck"),
  };
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

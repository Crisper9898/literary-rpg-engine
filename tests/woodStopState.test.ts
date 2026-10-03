import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { approachDecision, decideApproach, loadWood, readSeamanshipBook, readWarning,
  woodStopPosition, woodStopProgress, currentJourneySpace, setJourneySpace } from "../src/content/state/woodStopState";
import { woodStop } from "../src/story/heart-of-darkness/woodStop";
import { validateWorldLayout } from "../src/engine/world/worldLayout";

afterEach(() => {
  for (const key of ["woodLoaded", "warningRead", "seamanshipBookRead", "approachDecision", "woodStopPosition", "currentSpace"])
    storage.set(`journey.${key}`, undefined);
});
it("exploration changes atmosphere only when discoveries/decisions change, and repeated actions are idempotent", () => {
  expect(woodStopProgress()).toBe(.55);
  loadWood(); const loaded = woodStopProgress(); expect(loaded).toBeGreaterThan(.55);
  loadWood(); expect(woodStopProgress()).toBe(loaded);
  readWarning(); readSeamanshipBook(); decideApproach("wait");
  expect(woodStopProgress()).toBeCloseTo(1); expect(approachDecision()).toBe("wait");
  decideApproach("proceed"); expect(approachDecision()).toBe("proceed");
  expect(woodStopProgress()).toBeCloseTo(1);
  storage.set("journey.approachDecision", "invalid"); expect(approachDecision()).toBeUndefined();
});
it("the shore has valid independent geometry and a separate Pixi checkpoint from the deck", () => {
  expect(() => validateWorldLayout(woodStop)).not.toThrow();
  setJourneySpace("wood-stop"); expect(currentJourneySpace()).toBe("wood-stop");
  woodStopPosition.write({ x: 700, y: 760 });
  expect(woodStopPosition.read()).toEqual({ x: 700, y: 760 });
  expect(() => woodStopPosition.write({ x: NaN, y: 760 })).toThrow();
  setJourneySpace("deck"); expect(currentJourneySpace()).toBe("deck");
});

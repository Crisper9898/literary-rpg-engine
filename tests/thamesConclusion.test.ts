import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { intendedCheckpoint } from "../src/content/state/kurtzIntendedState";
import { thamesCheckpoint, thamesPosition, thamesState, canBeginThames, beginThames,
  observeMooring, hearEbb, finishThames } from "../src/content/state/thamesConclusionState";

afterEach(() => ["kurtzIntended", "thamesConclusion", "thamesPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => intendedCheckpoint.write({ phase: "complete", approach: "witness", windowObserved: true, pianoObserved: false });
it("requires the completed Intended visit and enters the frame only once", () => {
  expect(canBeginThames()).toBe(false); expect(beginThames()).toBe(false);
  intendedCheckpoint.write({ phase: "departure", approach: "listen", windowObserved: false, pianoObserved: false });
  expect(beginThames()).toBe(false); ready(); expect(beginThames()).toBe(true);
  expect(beginThames()).toBe(false); expect(thamesState().phase).toBe("returned");
});
it("keeps the ebb and final horizon in order without making the optional mooring mandatory", () => {
  expect(hearEbb()).toBe(false); expect(finishThames()).toBe(false); ready(); beginThames();
  expect(finishThames()).toBe(false); expect(hearEbb()).toBe(true); expect(hearEbb()).toBe(false);
  expect(finishThames()).toBe(true); expect(finishThames()).toBe(false);
  expect(thamesState()).toEqual({ phase: "complete", mooringObserved: false });
});
it("allows one optional observation during the frame and preserves it through the conclusion", () => {
  expect(observeMooring()).toBe(false); ready(); beginThames();
  expect(observeMooring()).toBe(true); expect(observeMooring()).toBe(false); hearEbb(); finishThames();
  expect(thamesState().mooringObserved).toBe(true); expect(observeMooring()).toBe(false);
});
it("restores earlier phases and fractional coordinates without replaying or losing observations", () => {
  ready(); beginThames(); const arrival = structuredClone(thamesState()); observeMooring(); hearEbb();
  const ebb = structuredClone(thamesState()); finishThames();
  thamesCheckpoint.write(arrival); expect(thamesState()).toEqual(arrival);
  thamesCheckpoint.write(ebb); expect(thamesState()).toEqual(ebb);
  expect(beginThames()).toBe(false); expect(hearEbb()).toBe(false);
  thamesPosition.write({ x: 1143.75, y: 819.5 }); expect(thamesPosition.read()).toEqual({ x: 1143.75, y: 819.5 });
  for (const p of [{ x: 0, y: 800 }, { x: 500, y: NaN }, { x: 1600, y: 800 }]) {
    storage.set("journey.thamesPosition", p); expect(thamesPosition.read()).toBeUndefined();
  }
});
it("rejects malformed states and observations acquired before entry", () => {
  const initial = thamesState();
  for (const patch of [{ phase: "river" }, { phase: "inactive", mooringObserved: true }, { mooringObserved: "yes" }]) {
    storage.set("journey.thamesConclusion", { ...initial, ...patch } as never); expect(thamesState()).toEqual(initial);
  }
});

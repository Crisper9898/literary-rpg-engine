import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { prologueCheckpoint, prologuePosition, prologueState, beginPrologue, observeAnchorage,
  beginOpeningTale, finishOpeningTale, leavePrologue } from "../src/content/state/thamesPrologueState";
import { thamesState } from "../src/content/state/thamesConclusionState";

afterEach(() => ["thamesPrologue", "prologuePosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
it("requires entry and the opening tale before continuation, without unlocking the ending", () => {
  expect(beginOpeningTale()).toBe(false); expect(leavePrologue()).toBe(false);
  expect(beginPrologue()).toBe(true); expect(beginPrologue()).toBe(false);
  expect(finishOpeningTale()).toBe(false); expect(leavePrologue()).toBe(false);
  expect(beginOpeningTale()).toBe(true); expect(beginOpeningTale()).toBe(false);
  expect(finishOpeningTale()).toBe(true); expect(finishOpeningTale()).toBe(false);
  expect(leavePrologue()).toBe(true); expect(leavePrologue()).toBe(false);
  expect(prologueState()).toEqual({ phase: "complete", anchorageObserved: false });
  expect(thamesState().phase).toBe("inactive");
});
it("keeps the anchorage optional and records it only once before the tale", () => {
  expect(observeAnchorage()).toBe(false); beginPrologue();
  expect(observeAnchorage()).toBe(true); expect(observeAnchorage()).toBe(false);
  beginOpeningTale(); finishOpeningTale(); leavePrologue();
  expect(prologueState().anchorageObserved).toBe(true); expect(observeAnchorage()).toBe(false);
});
it("does not change an already heard opening by observing later", () => {
  beginPrologue(); beginOpeningTale(); expect(observeAnchorage()).toBe(false);
  finishOpeningTale(); expect(observeAnchorage()).toBe(false);
  expect(prologueState().anchorageObserved).toBe(false);
});
it("accepts earlier checkpoints and exact fractional positions independently of the epilogue", () => {
  beginPrologue(); const before = structuredClone(prologueState()); observeAnchorage(); beginOpeningTale();
  const during = structuredClone(prologueState()); finishOpeningTale(); leavePrologue();
  prologueCheckpoint.write(before); expect(prologueState()).toEqual(before);
  prologueCheckpoint.write(during); expect(prologueState()).toEqual(during); expect(beginOpeningTale()).toBe(false);
  prologuePosition.write({ x: 1143.75, y: 819.5 }); expect(prologuePosition.read()).toEqual({ x: 1143.75, y: 819.5 });
  expect(thamesState().phase).toBe("inactive");
});
it("rejects invalid phases, premature observations and coordinates outside the yacht", () => {
  const initial = prologueState();
  for (const patch of [{ phase: "ebb" }, { phase: "inactive", anchorageObserved: true }, { anchorageObserved: "yes" }]) {
    storage.set("journey.thamesPrologue", { ...initial, ...patch } as never); expect(prologueState()).toEqual(initial);
  }
  for (const p of [{ x: 0, y: 800 }, { x: 500, y: NaN }, { x: 1600, y: 800 }]) {
    storage.set("journey.prologuePosition", p); expect(prologuePosition.read()).toBeUndefined();
  }
});

import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { nightCheckpoint, nightState } from "../src/content/state/kurtzNightEscapeState";
import { evacuationState, evacuationCheckpoint, morningBlend, beginEvacuation, updateEvacuationMorning,
  examinePatient, chooseEvacuationPriority, secureCot, clearLanding, loadFirstCargo, beginCotTransfer,
  updateCotTransfer, finishEvacuation, finishEvacuationExchange } from "../src/content/state/kurtzEvacuationState";
afterEach(() => ["kurtzNightEscape", "kurtzEvacuation", "kurtzEvacuationMorning"]
  .forEach(id => storage.set(`journey.${id}`, undefined)));
const prepare = () => {
  nightCheckpoint.write({ ...nightState(), phase: "returned", choice: "reason", returnedSeen: true });
  beginEvacuation(); for (let i = 0; i < 4; i++) updateEvacuationMorning(1000);
  morningBlend.write(1); updateEvacuationMorning(1);
};
it("requires the completed night return and cannot start twice", () => {
  expect(beginEvacuation()).toBe(false);
  nightCheckpoint.write({ ...nightState(), phase: "returned" }); expect(beginEvacuation()).toBe(false);
  nightCheckpoint.write({ ...nightState(), returnedSeen: true }); expect(beginEvacuation()).toBe(true);
  expect(beginEvacuation()).toBe(false); expect(evacuationState().phase).toBe("morning");
});
it("waits for saved dawn to finish before exposing preparations", () => {
  nightCheckpoint.write({ ...nightState(), phase: "returned", returnedSeen: true }); beginEvacuation();
  updateEvacuationMorning(500); updateEvacuationMorning(NaN);
  expect(evacuationState().morningMS).toBe(500); expect(examinePatient()).toBe(false);
  for (let i = 0; i < 4; i++) updateEvacuationMorning(1000);
  expect(evacuationState().phase).toBe("morning"); morningBlend.write(1); updateEvacuationMorning(1);
  expect(evacuationState().phase).toBe("preparing");
});
it.each(["patient", "cargo"] as const)("%s priority changes the order of physical preparation", priority => {
  prepare(); expect(chooseEvacuationPriority(priority)).toBe(false); expect(secureCot()).toBe(false);
  expect(examinePatient()).toBe(true); expect(examinePatient()).toBe(false);
  expect(chooseEvacuationPriority(priority)).toBe(true);
  expect(chooseEvacuationPriority(priority === "patient" ? "cargo" : "patient")).toBe(false);
  expect(secureCot()).toBe(true); expect(beginCotTransfer()).toBe(false); expect(clearLanding()).toBe(true);
  if (priority === "cargo") { expect(beginCotTransfer()).toBe(false); expect(loadFirstCargo()).toBe(true); }
  else expect(loadFirstCargo()).toBe(false);
  expect(beginCotTransfer()).toBe(true); expect(beginCotTransfer()).toBe(false);
  expect(evacuationState().cargoFirst).toBe(priority === "cargo"); expect(evacuationState().phase).toBe("transfer");
});
it("a weak patient moves only with Marlow nearby and ahead; arrival is spatial", () => {
  prepare(); examinePatient(); chooseEvacuationPriority("patient"); secureCot(); clearLanding(); beginCotTransfer();
  const first = evacuationState().cot;
  updateCotTransfer({ x: 400, y: 775 }, 50); updateCotTransfer({ x: 1400, y: 780 }, 50);
  updateCotTransfer({ x: 1200, y: 780 }, NaN); expect(evacuationState().cot).toEqual(first);
  updateCotTransfer({ x: 1200, y: 780 }, 50); expect(evacuationState().cot.x).toBeLessThan(first.x);
  expect(first.x - evacuationState().cot.x).toBeLessThanOrEqual(4);
  expect(finishEvacuation({ x: 590, y: 775 })).toBe(false);
  evacuationCheckpoint.write({ ...evacuationState(), cot: { x: 590, y: 775 } });
  expect(finishEvacuation({ x: 1500, y: 775 })).toBe(false);
  expect(finishEvacuation({ x: 510, y: 800 })).toBe(true); expect(evacuationState().phase).toBe("ready");
  finishEvacuationExchange(); expect(evacuationState().readySeen).toBe(true);
});
it("checkpoint round-trips the decision, preparations and exact cot coordinates", () => {
  prepare(); examinePatient(); chooseEvacuationPriority("cargo"); loadFirstCargo(); secureCot(); clearLanding(); beginCotTransfer();
  updateCotTransfer({ x: 1200, y: 780 }, 50);
  const saved = JSON.parse(JSON.stringify(evacuationState())); updateCotTransfer({ x: 1200, y: 780 }, 50);
  evacuationCheckpoint.write(saved); expect(evacuationState()).toEqual(saved);
});
it("rejects nonfinite coordinates and inconsistent completed checkpoints", () => {
  for (const invalid of [{ ...evacuationState(), phase: "death" }, { ...evacuationState(), cot: { x: Infinity, y: 780 } },
    { ...evacuationState(), phase: "ready" }, { ...evacuationState(), priority: "cargo", cargoFirst: true }]) {
    storage.set("journey.kurtzEvacuation", invalid as never); expect(evacuationState().phase).toBe("inactive");
  }
});

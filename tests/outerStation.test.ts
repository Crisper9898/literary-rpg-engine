import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { outerCheckpoint, outerPosition, outerState, beginOuterVoyage, observeSurf, witnessWarship,
  landAtOuterStation, inspectOuterWorks, enterOuterGrove, chooseGroveResponse, leaveOuterGrove,
  hearAccountant, finishOuterStation, isOuterCoast } from "../src/content/state/outerStationState";
import { commissionState } from "../src/content/state/companyCommissionState";

afterEach(() => ["outerStation", "outerPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
it("requires the coast, landing, works and grove before the accountant and stops before the caravan", () => {
  expect(landAtOuterStation()).toBe(false); expect(hearAccountant()).toBe(false);
  expect(beginOuterVoyage()).toBe(true); expect(beginOuterVoyage()).toBe(false);
  expect(isOuterCoast()).toBe(true); expect(inspectOuterWorks()).toBe(false);
  expect(witnessWarship()).toBe(true); expect(witnessWarship()).toBe(false);
  expect(isOuterCoast()).toBe(true); expect(landAtOuterStation()).toBe(true);
  expect(isOuterCoast()).toBe(false); expect(enterOuterGrove()).toBe(false);
  expect(inspectOuterWorks()).toBe(true); expect(enterOuterGrove()).toBe(true);
  expect(leaveOuterGrove()).toBe(false); expect(hearAccountant()).toBe(false);
  expect(chooseGroveResponse("give")).toBe(true); expect(leaveOuterGrove()).toBe(true);
  expect(finishOuterStation()).toBe(false); expect(hearAccountant()).toBe(true);
  expect(hearAccountant()).toBe(false); expect(finishOuterStation()).toBe(true);
  expect(finishOuterStation()).toBe(false); expect(outerState().phase).toBe("complete");
  expect(commissionState().phase).toBe("inactive");
});
it.each(["give", "stay"] as const)("records the %s decision once with no reward or recovery state", response => {
  beginOuterVoyage(); expect(chooseGroveResponse(response)).toBe(false);
  witnessWarship(); landAtOuterStation(); inspectOuterWorks(); enterOuterGrove();
  expect(chooseGroveResponse(response)).toBe(true);
  expect(chooseGroveResponse(response === "give" ? "stay" : "give")).toBe(false);
  expect(outerState()).toEqual({ phase: "grove", surfObserved: false, groveResponse: response });
  expect(leaveOuterGrove()).toBe(true); expect(hearAccountant()).toBe(true);
});
it("keeps surf exploration optional, coastal and one-shot", () => {
  expect(observeSurf()).toBe(false); beginOuterVoyage();
  expect(observeSurf()).toBe(true); expect(observeSurf()).toBe(false);
  witnessWarship(); landAtOuterStation(); expect(observeSurf()).toBe(false);
  expect(outerState().surfObserved).toBe(true);
});
it("restores earlier coastal and pending-choice phases plus fractional spatial coordinates", () => {
  beginOuterVoyage(); observeSurf(); const coast = structuredClone(outerState());
  witnessWarship(); landAtOuterStation(); inspectOuterWorks(); enterOuterGrove();
  const pending = structuredClone(outerState()); chooseGroveResponse("stay"); leaveOuterGrove(); hearAccountant(); finishOuterStation();
  outerCheckpoint.write(pending); expect(outerState()).toEqual(pending); expect(leaveOuterGrove()).toBe(false);
  expect(chooseGroveResponse("give")).toBe(true);
  outerCheckpoint.write(coast); expect(isOuterCoast()).toBe(true); expect(outerState()).toEqual(coast);
  outerPosition.write({ x: 1234.75, y: 812.5 }); expect(outerPosition.read()).toEqual({ x: 1234.75, y: 812.5 });
});
it("rejects inconsistent phase/choice combinations and out-of-scene positions", () => {
  const initial = outerState();
  for (const patch of [{ phase: "caravan" }, { phase: "inactive", surfObserved: true },
    { phase: "landed", groveResponse: "give" }, { phase: "ready" }, { groveResponse: "rescue" }]) {
    storage.set("journey.outerStation", { ...initial, ...patch } as never); expect(outerState()).toEqual(initial);
  }
  for (const p of [{ x: 0, y: 800 }, { x: 500, y: NaN }, { x: 1600, y: 800 }]) {
    storage.set("journey.outerPosition", p); expect(outerPosition.read()).toBeUndefined();
  }
});

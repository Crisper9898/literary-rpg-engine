import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { centralCheckpoint, centralPosition, centralState, isCaravan, beginCaravan,
  observeVillage, crossRavine, reachCamp, meetCompanion, chooseCompanionResponse,
  resumeCaravan, arriveCentralStation, hearWreckNews, inspectSunkenSteamer,
  finishCentralArrival } from "../src/content/state/centralStationState";
import { outerCheckpoint, outerState } from "../src/content/state/outerStationState";

afterEach(() => ["centralStation", "centralPosition", "outerStation"].forEach(key => storage.set(`journey.${key}`, undefined)));
const reachCompanion = () => { beginCaravan(); crossRavine(); reachCamp(); meetCompanion(); };

it("requires the caravan, arrival report and wreck inspection in order", () => {
  expect(arriveCentralStation()).toBe(false); expect(hearWreckNews()).toBe(false);
  expect(beginCaravan()).toBe(true); expect(beginCaravan()).toBe(false);
  expect(isCaravan()).toBe(true); expect(reachCamp()).toBe(false);
  expect(crossRavine()).toBe(true); expect(crossRavine()).toBe(false);
  expect(meetCompanion()).toBe(false); expect(reachCamp()).toBe(true);
  expect(meetCompanion()).toBe(true); expect(resumeCaravan()).toBe(false);
  expect(chooseCompanionResponse("shade")).toBe(true); expect(resumeCaravan()).toBe(true);
  expect(isCaravan()).toBe(true); expect(hearWreckNews()).toBe(false);
  expect(arriveCentralStation()).toBe(true); expect(isCaravan()).toBe(false);
  expect(inspectSunkenSteamer()).toBe(false); expect(hearWreckNews()).toBe(true);
  expect(finishCentralArrival()).toBe(false); expect(inspectSunkenSteamer()).toBe(true);
  expect(inspectSunkenSteamer()).toBe(false); expect(finishCentralArrival()).toBe(true);
  expect(finishCentralArrival()).toBe(false); expect(centralState().phase).toBe("complete");
});
it.each(["shade", "load"] as const)("stores %s once without curing the companion or repairing the steamer", response => {
  expect(chooseCompanionResponse(response)).toBe(false); reachCompanion();
  expect(chooseCompanionResponse(response)).toBe(true);
  expect(chooseCompanionResponse(response === "shade" ? "load" : "shade")).toBe(false);
  expect(centralState()).toEqual({ phase: "companion", villageObserved: false, companionResponse: response });
  expect(resumeCaravan()).toBe(true); expect(arriveCentralStation()).toBe(true);
  expect(centralState().companionResponse).toBe(response);
});
it("keeps village exploration optional, on the march and one-shot", () => {
  expect(observeVillage()).toBe(false); beginCaravan(); crossRavine();
  expect(observeVillage()).toBe(true); expect(observeVillage()).toBe(false);
  reachCamp(); meetCompanion(); chooseCompanionResponse("load"); resumeCaravan(); arriveCentralStation();
  expect(observeVillage()).toBe(false); expect(centralState().villageObserved).toBe(true);
});
it("restores an earlier march, a pending choice and fractional bounded positions", () => {
  beginCaravan(); observeVillage(); const early = structuredClone(centralState());
  crossRavine(); reachCamp(); meetCompanion(); const pending = structuredClone(centralState());
  chooseCompanionResponse("shade"); resumeCaravan(); arriveCentralStation(); hearWreckNews(); inspectSunkenSteamer();
  centralCheckpoint.write(pending); expect(centralState()).toEqual(pending);
  expect(resumeCaravan()).toBe(false); expect(chooseCompanionResponse("load")).toBe(true);
  centralCheckpoint.write(early); expect(centralState()).toEqual(early); expect(isCaravan()).toBe(true);
  centralPosition.write({ x: 1234.75, y: 812.5 }); expect(centralPosition.read()).toEqual({ x: 1234.75, y: 812.5 });
});
it("rejects impossible checkpoint combinations, unknown responses and invalid coordinates", () => {
  const initial = centralState();
  for (const patch of [{ phase: "repairs" }, { phase: "inactive", villageObserved: true },
    { phase: "trail", companionResponse: "shade" }, { phase: "ready" }, { companionResponse: "heal" }]) {
    storage.set("journey.centralStation", { ...initial, ...patch } as never); expect(centralState()).toEqual(initial);
  }
  storage.set("journey.centralStation", undefined); reachCompanion();
  expect(chooseCompanionResponse("heal" as never)).toBe(false);
  for (const p of [{ x: 0, y: 800 }, { x: 500, y: NaN }, { x: 1600, y: 800 }, { x: "500", y: 800 }]) {
    storage.set("journey.centralPosition", p); expect(centralPosition.read()).toBeUndefined();
  }
});
it("does not overwrite the separately persisted Outer Station episode", () => {
  const previous = { phase: "ready", surfObserved: true, groveResponse: "give" } as const;
  outerCheckpoint.write(previous); reachCompanion(); chooseCompanionResponse("load"); resumeCaravan();
  arriveCentralStation(); hearWreckNews(); inspectSunkenSteamer(); finishCentralArrival();
  expect(outerState()).toEqual(previous);
});

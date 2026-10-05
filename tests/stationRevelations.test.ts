import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { markStation } from "../src/content/state/innerStationState";
import { revelationsAvailable, discoveries, discover, revelationsReady, interpretation,
  chooseInterpretation, revelationsPressure } from "../src/content/state/stationRevelationsState";

const keys = ["kurtzIntroductionComplete", "stationDiscoveries", "ivoryObserved", "palisadeObserved",
  "kurtzInfluenceObserved", "kurtzReportObserved", "kurtzInterpretation", "stationRevelationsComplete"];
afterEach(() => { keys.forEach(key => storage.set(`journey.${key}`, undefined)); });
it("requires the completed first conversation and preserves ordered, independent discoveries", () => {
  expect(revelationsAvailable()).toBe(false); expect(discover("ivory")).toBe(false);
  markStation("kurtzIntroductionComplete"); expect(revelationsAvailable()).toBe(true);
  expect(discover("report")).toBe(true); expect(discover("ivory")).toBe(true); expect(discover("report")).toBe(false);
  expect(discoveries()).toEqual(["report", "ivory"]);
  expect(storage.get("journey.kurtzReportObserved")).toBe(true);
  expect(storage.get("journey.ivoryObserved")).toBe(true);
  expect(storage.get("journey.palisadeObserved")).not.toBe(true);
});
it("unlocks at any two clues without requiring the palisade or all four", () => {
  markStation("kurtzIntroductionComplete"); discover("influence");
  expect(revelationsReady()).toBe(false); discover("report"); expect(revelationsReady()).toBe(true);
  discover("palisade"); discover("ivory"); expect(discoveries()).toHaveLength(4);
});
it.each(["understand", "brutality"] as const)("persists %s without replacing the first interpretation", value => {
  expect(chooseInterpretation(value)).toBe(false); markStation("kurtzIntroductionComplete");
  discover("ivory"); discover("palisade"); expect(chooseInterpretation(value)).toBe(true);
  expect(interpretation()).toBe(value); expect(chooseInterpretation(value === "understand" ? "brutality" : "understand")).toBe(false);
});
it("reconstructs progress/order and pressure from canonical Pixi storage", () => {
  markStation("kurtzIntroductionComplete"); discover("ivory"); const before = revelationsPressure();
  const saved = [...discoveries()]; discover("palisade"); expect(revelationsPressure()).toBeGreaterThan(before);
  storage.set("journey.stationDiscoveries", saved); storage.set("journey.palisadeObserved", undefined);
  expect(discoveries()).toEqual(["ivory"]); expect(revelationsReady()).toBe(false); expect(revelationsPressure()).toBe(before);
});
it("rejects malformed or duplicate saved discovery entries", () => {
  storage.set("journey.stationDiscoveries", ["ivory", "unknown", "toString", "ivory", 5, "report"]);
  expect(discoveries()).toEqual(["ivory", "report"]);
});

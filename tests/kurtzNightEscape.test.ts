import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { markStation } from "../src/content/state/innerStationState";
import { beginNight, nightState, updateNight, observeAbsence, followTrace, meetNightKurtz,
  chooseNightResponse, beginNightReturn, updateNightEscort, finishNightReturn, nightCheckpoint,
  nightAtmosphere } from "../src/content/state/kurtzNightEscapeState";

afterEach(() => ["stationRevelationsComplete", "kurtzInterpretation", "kurtzNightEscape", "kurtzNightAtmosphere", "kurtzNightForestBlend"]
  .forEach(key => storage.set(`journey.${key}`, undefined)));
const prepare = () => { markStation("stationRevelationsComplete"); storage.set("journey.kurtzInterpretation", "understand"); };
const darken = () => { prepare(); beginNight(); for (let i = 0; i < 8; i++) updateNight(1000); nightAtmosphere.write(1); updateNight(1); };
const track = () => { darken(); observeAbsence(); ["grass", "prints", "branches"].forEach(id => followTrace(id as "grass")); };
it("requires completed revelations and cannot restart the same night", () => {
  expect(beginNight()).toBe(false); prepare(); expect(beginNight()).toBe(true);
  expect(nightState().phase).toBe("dusk"); expect(beginNight()).toBe(false);
});
it("dims gradually with a saved finite transition, then exposes the empty resting place", () => {
  prepare(); beginNight(); expect(observeAbsence()).toBe(false); updateNight(500);
  expect(nightState().duskMS).toBe(500); expect(nightState().phase).toBe("dusk");
  updateNight(Number.NaN); expect(nightState().duskMS).toBe(500);
  darken(); expect(nightState().phase).toBe("search"); expect(observeAbsence()).toBe(true);
  expect(observeAbsence()).toBe(false); expect(nightState().phase).toBe("trail");
});
it("tracks physical consecutive clues without accepting duplicates or out-of-order shortcuts", () => {
  darken(); expect(followTrace("grass")).toBe(false); observeAbsence();
  expect(followTrace("branches")).toBe(false); expect(followTrace("grass")).toBe(true);
  expect(followTrace("grass")).toBe(false); expect(followTrace("prints")).toBe(true);
  expect(followTrace("branches")).toBe(true); expect(nightState().traces).toEqual(["grass", "prints", "branches"]);
});
it.each(["reason", "challenge"] as const)("keeps %s and its posture, then converges on a supported return", response => {
  expect(chooseNightResponse(response)).toBe(false); track();
  expect(meetNightKurtz()).toBe(true); expect(chooseNightResponse(response)).toBe(true);
  expect(nightState().choice).toBe(response); expect(nightState().pose).toBe(response === "reason" ? "bracing" : "dominant");
  expect(chooseNightResponse(response === "reason" ? "challenge" : "reason")).toBe(false);
  expect(beginNightReturn()).toBe(true); expect(nightState().phase).toBe("return");
  expect(nightState().pose).toBe("exhausted"); expect(finishNightReturn()).toBe(false);
});
it("escort stops when abandoned, advances near Marlow and requires actual arrival", () => {
  track(); meetNightKurtz(); chooseNightResponse("reason"); beginNightReturn();
  const first = { ...nightState().escort }; updateNightEscort({ x: 1640, y: 800 }, 50);
  expect(nightState().escort).toEqual(first);
  updateNightEscort({ x: first.x + 80, y: first.y }, 50);
  expect(nightState().escort.x).toBeGreaterThan(first.x);
  expect(nightState().escort.x - first.x).toBeLessThanOrEqual(5);
  nightCheckpoint.write({ ...nightState(), escort: { x: 1575, y: 800 } });
  expect(finishNightReturn()).toBe(true); expect(nightState().phase).toBe("returned");
});
it("restores tracking and the exact escort point from the canonical checkpoint", () => {
  darken(); observeAbsence(); followTrace("grass"); const saved = JSON.parse(JSON.stringify(nightState()));
  followTrace("prints"); nightCheckpoint.write(saved); expect(nightState()).toEqual(saved);
  expect(nightState().traces).toEqual(["grass"]); expect(nightState().choice).toBeUndefined();
});
it("rejects corrupt phase, trace order and nonfinite spatial saves", () => {
  const base = nightState();
  for (const corrupt of [{ ...base, phase: "death" }, { ...base, traces: ["branches"] },
    { ...base, escort: { x: Infinity, y: 800 } }]) {
    storage.set("journey.kurtzNightEscape", corrupt as never); expect(nightState().phase).toBe("inactive");
  }
});

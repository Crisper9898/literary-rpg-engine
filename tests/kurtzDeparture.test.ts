import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { evacuationCheckpoint, evacuationState } from "../src/content/state/kurtzEvacuationState";
import { departureCheckpoint, departureState, beginDeparture, releaseMooring, observeBank,
  chooseDepartureResponse, warnCrew, useWhistle, startManoeuvre, updateDeparture, finishDepartureExchange } from "../src/content/state/kurtzDepartureState";
afterEach(() => ["kurtzEvacuation", "kurtzDeparture", "departurePosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => evacuationCheckpoint.write({ ...evacuationState(), phase: "ready", patientSeen: true,
  priority: "patient", cotSecured: true, landingClear: true, cot: { x: 590, y: 775 }, readySeen: true });
const aboard = () => { ready(); beginDeparture(); };
it("requires the completed evacuation exchange and boards once", () => {
  expect(beginDeparture()).toBe(false); ready();
  evacuationCheckpoint.write({ ...evacuationState(), readySeen: false }); expect(beginDeparture()).toBe(false);
  evacuationCheckpoint.write({ ...evacuationState(), readySeen: true }); expect(beginDeparture()).toBe(true);
  expect(beginDeparture()).toBe(false); expect(departureState().phase).toBe("aboard");
});
it("bank pressure follows the released mooring, not elapsed time or a remote action", () => {
  aboard(); updateDeparture(60000); expect(departureState().phase).toBe("aboard");
  expect(observeBank()).toBe(false); expect(chooseDepartureResponse("whistle")).toBe(false);
  expect(releaseMooring()).toBe(true); expect(releaseMooring()).toBe(false); expect(observeBank()).toBe(true);
  expect(observeBank()).toBe(false); expect(startManoeuvre()).toBe(false);
});
it.each(["whistle", "intervene"] as const)("%s route must complete its physical actions before departing", response => {
  aboard(); releaseMooring(); expect(chooseDepartureResponse(response)).toBe(true);
  expect(chooseDepartureResponse(response === "whistle" ? "intervene" : "whistle")).toBe(false);
  if (response === "intervene") { expect(useWhistle()).toBe(false); expect(warnCrew()).toBe(true); expect(warnCrew()).toBe(false); }
  else expect(warnCrew()).toBe(false);
  expect(startManoeuvre()).toBe(false); expect(useWhistle()).toBe(true); expect(useWhistle()).toBe(false);
  expect(startManoeuvre()).toBe(true); expect(startManoeuvre()).toBe(false); expect(departureState().progress).toBe(0);
  updateDeparture(NaN); updateDeparture(-1); expect(departureState().progress).toBe(0);
  updateDeparture(60000); expect(departureState().progress).toBeCloseTo(.0125);
  for (let i = 0; i < 100; i++) updateDeparture(100); expect(departureState().phase).toBe("departed");
  expect(departureState().progress).toBe(1); expect(departureState().finalSeen).toBe(false);
  finishDepartureExchange(); expect(departureState().finalSeen).toBe(true);
});
it("canonical checkpoint preserves a partial manoeuvre and immutable response", () => {
  aboard(); releaseMooring(); chooseDepartureResponse("intervene"); warnCrew(); useWhistle(); startManoeuvre();
  for (let i = 0; i < 17; i++) updateDeparture(100);
  const saved = JSON.parse(JSON.stringify(departureState())); updateDeparture(100);
  departureCheckpoint.write(saved); expect(departureState()).toEqual(saved);
  expect(chooseDepartureResponse("whistle")).toBe(false);
});
it("rejects inconsistent saved phases, response and progress", () => {
  for (const invalid of [{ ...departureState(), progress: Infinity }, { ...departureState(), phase: "dead" },
    { ...departureState(), phase: "departed", progress: .2 }, { ...departureState(), whistleUsed: true },
    { ...departureState(), crewWarned: true }, { ...departureState(), finalSeen: true }]) {
    storage.set("journey.kurtzDeparture", invalid as never); expect(departureState().phase).toBe("inactive");
  }
});

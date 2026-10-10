import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { breakdownCheckpoint } from "../src/content/state/kurtzBreakdownState";
import { finalNightCheckpoint, finalNightState, beginFinalNight, takeCandle, placeCandle,
  chooseVigilResponse, finishVigil, hearFinalWords, finishFinalWords, leavePatient,
  confirmKurtzDeath, finishFinalNight, updateFinalNight } from "../src/content/state/kurtzFinalNightState";

afterEach(() => ["kurtzBreakdown", "kurtzFinalNight", "finalNightPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => breakdownCheckpoint.write({ phase: "underway", distance: 250, breakdownSeen: true,
  engineExamined: true, repairStarted: true, repairProgress: 1, rodFitted: true,
  papersResponse: "sealed", papersSeen: true, finalSeen: true });
const bedside = () => { ready(); beginFinalNight(); takeCandle(); placeCandle(); };
const lastWords = () => { chooseVigilResponse("listen"); finishVigil(); hearFinalWords(); finishFinalWords(); };

it("requires the closed resumed-voyage exchange and enters once with its travel distance", () => {
  expect(beginFinalNight()).toBe(false); ready();
  breakdownCheckpoint.write({ ...breakdownCheckpoint.read()!, finalSeen: false });
  expect(beginFinalNight()).toBe(false); ready(); expect(beginFinalNight()).toBe(true);
  expect(finalNightState().phase).toBe("evening"); expect(finalNightState().distance).toBe(250);
  expect(beginFinalNight()).toBe(false);
});
it("requires taking and placing the candle before the bedside response", () => {
  expect(takeCandle()).toBe(false); ready(); beginFinalNight();
  expect(placeCandle()).toBe(false); expect(chooseVigilResponse("listen")).toBe(false);
  expect(takeCandle()).toBe(true); expect(takeCandle()).toBe(false);
  expect(finalNightState().candle).toBe("held"); expect(placeCandle()).toBe(true);
  expect(placeCandle()).toBe(false); expect(finalNightState().candle).toBe("bedside");
  expect(hearFinalWords()).toBe(false); expect(leavePatient()).toBe(false); expect(confirmKurtzDeath()).toBe(false);
});
it.each(["reassure", "listen"] as const)("%s changes the response but cannot prevent or skip the final words and death", response => {
  bedside(); expect(chooseVigilResponse(response)).toBe(true);
  expect(chooseVigilResponse(response === "listen" ? "reassure" : "listen")).toBe(false);
  expect(hearFinalWords()).toBe(false); finishVigil(); expect(hearFinalWords()).toBe(true);
  expect(finalNightState().phase).toBe("words"); expect(leavePatient()).toBe(false);
  finishFinalWords(); expect(confirmKurtzDeath()).toBe(false); expect(leavePatient()).toBe(true);
  expect(finalNightState().candle).toBe("out"); expect(confirmKurtzDeath()).toBe(true);
  finishFinalNight(); expect(finalNightState().phase).toBe("confirmed");
  expect(finalNightState().response).toBe(response); expect(finalNightState().finalSeen).toBe(true);
});
it("never reissues completed events or returns the candle after the announcement", () => {
  bedside(); lastWords(); leavePatient(); confirmKurtzDeath(); finishFinalNight();
  expect([beginFinalNight(), takeCandle(), placeCandle(), hearFinalWords(), leavePatient(), confirmKurtzDeath()]).toEqual(Array(6).fill(false));
});
it("round-trips the held candle and partial evening before restoring the closed choice", () => {
  ready(); beginFinalNight(); takeCandle(); updateFinalNight(50);
  const held = JSON.parse(JSON.stringify(finalNightState())); placeCandle(); lastWords();
  const words = JSON.parse(JSON.stringify(finalNightState())); leavePatient(); confirmKurtzDeath();
  finalNightCheckpoint.write(held); expect(finalNightState()).toEqual(held); expect(placeCandle()).toBe(true);
  finalNightCheckpoint.write(words); expect(finalNightState()).toEqual(words); expect(hearFinalWords()).toBe(false);
  expect(leavePatient()).toBe(true); expect(confirmKurtzDeath()).toBe(true);
});
it("smooths darkness and travel with bounded valid ticks without automatically issuing narrative events", () => {
  updateFinalNight(50); expect(finalNightState().distance).toBe(0); ready(); beginFinalNight();
  for (const ms of [NaN, Infinity, -10, 0]) updateFinalNight(ms);
  expect(finalNightState().distance).toBe(250); updateFinalNight(60000);
  expect(finalNightState().distance).toBeCloseTo(251.4); expect(finalNightState().progress).toBeCloseTo(.48125);
  for (let i = 0; i < 300; i++) updateFinalNight(50);
  expect(finalNightState().progress).toBe(.78); expect(finalNightState().phase).toBe("evening");
  expect(finalNightState().wordsHeard).toBe(false);
});
it("rejects impossible candles, phases, choices and closed-exchange saves", () => {
  const initial = finalNightState();
  for (const patch of [{ phase: "buried" }, { distance: -1 }, { progress: Infinity }, { progress: .99 },
    { candle: "bedside" }, { response: "save-him" }, { vigilSeen: true }, { wordsHeard: true },
    { wordsSeen: true }, { phase: "left", candle: "out" }, { finalSeen: true }]) {
    storage.set("journey.kurtzFinalNight", { ...initial, ...patch } as never);
    expect(finalNightState()).toEqual(initial);
  }
});

import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { finalNightCheckpoint } from "../src/content/state/kurtzFinalNightState";
import { aftermathCheckpoint, aftermathState, beginAftermath, hearBurial, securePapers,
  chooseCareResponse, receiveHelp, finishCareExchange, collectWater, beginRest, finishRest,
  finishAftermath, updateAftermath } from "../src/content/state/kurtzAftermathState";

afterEach(() => ["kurtzFinalNight", "kurtzAftermath", "aftermathPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => finalNightCheckpoint.write({ phase: "confirmed", distance: 400, progress: .78,
  candle: "out", response: "listen", vigilSeen: true, wordsHeard: true, wordsSeen: true, finalSeen: true });
const fever = () => { ready(); beginAftermath(); hearBurial(); securePapers(); };

it("requires the closed death announcement, seeds travel and cannot enter twice", () => {
  expect(beginAftermath()).toBe(false); ready();
  finalNightCheckpoint.write({ ...finalNightCheckpoint.read()!, finalSeen: false });
  expect(beginAftermath()).toBe(false); ready(); expect(beginAftermath()).toBe(true);
  expect(aftermathState().phase).toBe("morning"); expect(aftermathState().distance).toBe(400);
  expect(beginAftermath()).toBe(false);
});
it("requires burial news and secured papers before care, then care before sheltered rest", () => {
  expect(hearBurial()).toBe(false); ready(); beginAftermath();
  expect(securePapers()).toBe(false); expect(chooseCareResponse("help")).toBe(false);
  expect(hearBurial()).toBe(true); expect(hearBurial()).toBe(false);
  expect(aftermathState().phase).toBe("bereaved"); expect(securePapers()).toBe(true);
  expect(securePapers()).toBe(false); expect(beginRest()).toBe(false); expect(finishAftermath()).toBe(false);
});
it.each(["help", "alone"] as const)("%s has a distinct care route but never changes Marlow's survival", response => {
  fever(); expect(chooseCareResponse(response)).toBe(true);
  expect(chooseCareResponse(response === "help" ? "alone" : "help")).toBe(false);
  expect(beginRest()).toBe(false);
  if (response === "help") { expect(collectWater()).toBe(false); expect(receiveHelp()).toBe(true); }
  else { expect(receiveHelp()).toBe(false); expect(collectWater()).toBe(false); }
  finishCareExchange();
  if (response === "alone") { expect(beginRest()).toBe(false); expect(collectWater()).toBe(true); }
  expect(aftermathState().waterReceived).toBe(true); expect(beginRest()).toBe(true);
  expect(beginRest()).toBe(false); expect(finishAftermath()).toBe(false); finishRest();
  expect(aftermathState().phase).toBe("recovering"); expect(finishAftermath()).toBe(true);
  expect(aftermathState().phase).toBe("survived"); expect(aftermathState().response).toBe(response);
  expect(finishAftermath()).toBe(false); expect(hearBurial()).toBe(false);
});
it("does not close incomplete care or rest, and restores a choice before water", () => {
  fever(); finishCareExchange(); expect(aftermathState().careSeen).toBe(false); finishRest();
  expect(aftermathState().phase).toBe("fever"); chooseCareResponse("alone"); finishCareExchange();
  const beforeWater = JSON.parse(JSON.stringify(aftermathState())); collectWater(); beginRest(); finishRest(); finishAftermath();
  aftermathCheckpoint.write(beforeWater); expect(aftermathState()).toEqual(beforeWater);
  expect(beginRest()).toBe(false); expect(collectWater()).toBe(true);
});
it("restores partial help and rest without reselecting or replaying burial", () => {
  fever(); chooseCareResponse("help"); const partial = JSON.parse(JSON.stringify(aftermathState()));
  receiveHelp(); finishCareExchange(); beginRest(); const rest = JSON.parse(JSON.stringify(aftermathState()));
  finishRest(); finishAftermath(); aftermathCheckpoint.write(rest); expect(aftermathState()).toEqual(rest);
  expect(beginRest()).toBe(false); finishRest(); expect(finishAftermath()).toBe(true);
  aftermathCheckpoint.write(partial); expect(chooseCareResponse("alone")).toBe(false);
  expect(hearBurial()).toBe(false); expect(receiveHelp()).toBe(true);
});
it("updates only bounded travel and atmospheric progress, never advances the narrative by waiting", () => {
  updateAftermath(50); expect(aftermathState().distance).toBe(0); ready(); beginAftermath();
  for (const ms of [NaN, Infinity, 0, -50]) updateAftermath(ms);
  expect(aftermathState().distance).toBe(400); updateAftermath(60000);
  expect(aftermathState().distance).toBeCloseTo(401.2);
  for (let i = 0; i < 400; i++) updateAftermath(50);
  expect(aftermathState().progress).toBe(.78); expect(aftermathState().phase).toBe("morning");
  expect(aftermathState().response).toBeUndefined(); expect(aftermathState().waterReceived).toBe(false);
});
it("rejects malformed saves and impossible care sequences", () => {
  const initial = aftermathState();
  for (const patch of [{ phase: "Europe" }, { distance: NaN }, { progress: .99 }, { response: "cure" },
    { papersSecured: true }, { careSeen: true }, { waterReceived: true }, { phase: "resting" }]) {
    storage.set("journey.kurtzAftermath", { ...initial, ...patch } as never); expect(aftermathState()).toEqual(initial);
  }
  fever(); const noChoice = aftermathState();
  for (const patch of [{ careSeen: true }, { waterReceived: true }, { phase: "survived" },
    { phase: "recovering", response: "alone", careSeen: true }]) {
    storage.set("journey.kurtzAftermath", { ...noChoice, ...patch } as never); expect(aftermathState()).toEqual(initial);
  }
});

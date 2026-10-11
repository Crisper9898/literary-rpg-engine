import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { legacyCheckpoint } from "../src/content/state/kurtzLegacyState";
import { intendedCheckpoint, intendedPosition, intendedState, canBeginIntended, beginIntended,
  observeIntendedRoom, deliverIntendedLetters, chooseIntendedApproach, finishIntendedExchange,
  hearLastWordsRequest, finishLastWords, leaveIntended } from "../src/content/state/kurtzIntendedState";

afterEach(() => ["kurtzLegacy", "kurtzIntended", "intendedPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const ready = () => legacyCheckpoint.write({ phase: "complete", cousinResponse: "witness", journalistResponse: "motive" });
it("requires the completed legacy episode and cannot enter twice", () => {
  expect(canBeginIntended()).toBe(false); expect(beginIntended()).toBe(false);
  legacyCheckpoint.write({ phase: "remaining", cousinResponse: "music", journalistResponse: "party" });
  expect(beginIntended()).toBe(false); ready(); expect(beginIntended()).toBe(true);
  expect(beginIntended()).toBe(false); expect(intendedState().phase).toBe("arrived");
});
it.each(["witness", "listen"] as const)("%s: delivery, reply closure, last words and departure remain ordered", approach => {
  ready(); beginIntended(); expect(chooseIntendedApproach(approach)).toBe(false);
  expect(hearLastWordsRequest()).toBe(false); expect(leaveIntended()).toBe(false);
  expect(deliverIntendedLetters()).toBe(true); expect(deliverIntendedLetters()).toBe(false);
  expect(chooseIntendedApproach(approach)).toBe(true);
  expect(chooseIntendedApproach(approach === "witness" ? "listen" : "witness")).toBe(false);
  expect(hearLastWordsRequest()).toBe(false); expect(finishIntendedExchange()).toBe(true);
  expect(finishLastWords()).toBe(false); expect(hearLastWordsRequest()).toBe(true);
  expect(hearLastWordsRequest()).toBe(false); expect(leaveIntended()).toBe(false);
  expect(finishLastWords()).toBe(true); expect(leaveIntended()).toBe(true);
  expect(leaveIntended()).toBe(false); expect(intendedState().approach).toBe(approach);
});
it("room observations are optional, independent and cannot be gained outside the visit", () => {
  expect(observeIntendedRoom("window")).toBe(false); ready(); beginIntended();
  expect(observeIntendedRoom("piano")).toBe(true); expect(observeIntendedRoom("piano")).toBe(false);
  expect(intendedState().windowObserved).toBe(false); expect(observeIntendedRoom("window")).toBe(true);
  expect(intendedState().pianoObserved).toBe(true);
});
it("round-trips partial replies, delivered packet, departure and exact bounded coordinates", () => {
  ready(); beginIntended(); const arrival = structuredClone(intendedState());
  deliverIntendedLetters(); observeIntendedRoom("window"); chooseIntendedApproach("witness");
  const partial = structuredClone(intendedState()); finishIntendedExchange(); hearLastWordsRequest();
  const question = structuredClone(intendedState()); finishLastWords(); const departure = structuredClone(intendedState());
  leaveIntended(); for (const saved of [departure, question, partial, arrival]) {
    intendedCheckpoint.write(saved); expect(intendedState()).toEqual(saved);
  }
  intendedPosition.write({ x: 1341.75, y: 811.5 }); expect(intendedPosition.read()).toEqual({ x: 1341.75, y: 811.5 });
  storage.set("journey.intendedPosition", { x: 0, y: NaN }); expect(intendedPosition.read()).toBeUndefined();
});
it("rejects impossible phases, premature choices and malformed observations", () => {
  const initial = intendedState();
  for (const patch of [{ phase: "thames" }, { phase: "heard" }, { approach: "witness" },
    { phase: "arrived", approach: "listen" }, { phase: "speaking", approach: "truth" },
    { windowObserved: true }, { pianoObserved: "yes" }]) {
    storage.set("journey.kurtzIntended", { ...initial, ...patch } as never); expect(intendedState()).toEqual(initial);
  }
});

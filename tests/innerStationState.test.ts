import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { dockingProgress, stationPosition, observeStation, stationObservations,
  canMeetRussian, rememberTopic, russianTopics, setRussianStance, russianStance,
  stationReady, completeRussianConversation, stationEvent, startStationEvent,
  updateStationEvent } from "../src/content/state/innerStationState";

afterEach(() => { for (const key of ["dockProgress", "stationPosition", "stationObserved",
  "russianTopics", "russianStance", "russianComplete", "stationEvent", "kurtzPresenceForeshadowed"])
  storage.set(`journey.${key}`, undefined); });
it("requires two distinct observations and keeps their order without duplicates", () => {
  observeStation("planks"); observeStation("planks"); expect(canMeetRussian()).toBe(false);
  observeStation("house"); expect(canMeetRussian()).toBe(true);
  expect(stationObservations()).toEqual(["planks", "house"]);
});
it("remembers investigation order and stance; a completed exchange gates Kurtz preparation", () => {
  rememberTopic("station"); rememberTopic("kurtz"); rememberTopic("station");
  expect(russianTopics()).toEqual(["station", "kurtz"]); expect(stationReady()).toBe(false);
  setRussianStance("question"); completeRussianConversation();
  expect(russianStance()).toBe("question"); expect(stationReady()).toBe(true);
});
it("saves docking and shore coordinates using existing checkpoints with finite validation", () => {
  dockingProgress.write(.45); stationPosition.write({ x: 543, y: 805 });
  expect(dockingProgress.read()).toBe(.45); expect(stationPosition.read()).toEqual({ x: 543, y: 805 });
  expect(() => dockingProgress.write(2)).toThrow();
  expect(() => stationPosition.write({ x: Infinity, y: 1 })).toThrow();
});
it("the restrained atmospheric interruption runs once and resumes remaining time", () => {
  startStationEvent(); updateStationEvent(100); const saved = stationEvent();
  expect(saved.remainingMS).toBe(2300);
  updateStationEvent(500); expect(stationEvent().remainingMS).toBe(2200);
  storage.set("journey.stationEvent", saved); updateStationEvent(100);
  expect(stationEvent().remainingMS).toBe(2200);
  for (let i = 0; i < 30; i++) updateStationEvent(100);
  startStationEvent(); expect(stationEvent()).toEqual({ occurred: true, remainingMS: 0 });
});

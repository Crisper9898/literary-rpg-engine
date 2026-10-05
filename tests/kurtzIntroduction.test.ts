import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { markStation, setRussianStance, completeRussianConversation } from "../src/content/state/innerStationState";
import { beginKurtzIntroduction, kurtzIntroduction, updateKurtzIntroduction, kurtzStage,
  kurtzPosition, kurtzPose, chooseKurtzResponse, kurtzFirstResponse } from "../src/content/state/kurtzIntroductionState";

afterEach(() => { for (const key of ["kurtzIntroduction", "kurtzFirstResponse", "kurtzPose", "russianComplete",
  "russianStance", "kurtzEncounterPrepared"]) storage.set(`journey.${key}`, undefined); });
const unlock = () => { completeRussianConversation(); setRussianStance("listen"); markStation("kurtzEncounterPrepared"); };
it("requires the prepared Russian encounter and never restarts an activated introduction", () => {
  expect(beginKurtzIntroduction()).toBe(false); unlock(); expect(beginKurtzIntroduction()).toBe(true);
  updateKurtzIntroduction(1000); expect(beginKurtzIntroduction()).toBe(false);
  expect(kurtzIntroduction().elapsedMS).toBe(1000);
});
it("stages a 32-second playable anticipation then silhouette, detail, command, cough and arrival", () => {
  unlock(); beginKurtzIntroduction();
  const advance = (ms: number) => { for (let i = 0; i < ms / 1000; i++) updateKurtzIntroduction(1000); };
  advance(31000); expect(kurtzStage()).toBe("anticipation");
  advance(1000); expect(kurtzStage()).toBe("silhouette");
  advance(6000); expect(kurtzStage()).toBe("partial");
  advance(6000); expect(kurtzStage()).toBe("authority"); expect(kurtzPose()).toBe("commanding");
  const halted = kurtzPosition(); advance(3000); expect(kurtzPosition()).toEqual(halted);
  advance(1000); expect(kurtzStage()).toBe("coughing");
  advance(4000); expect(kurtzStage()).toBe("present"); expect(kurtzPose()).toBe("weak");
  advance(3000); expect(kurtzIntroduction().elapsedMS).toBe(52000);
});
it("restores a partial entrance through Pixi storage without losing position or replaying the beginning", () => {
  unlock(); beginKurtzIntroduction(); for (let i = 0; i < 39; i++) updateKurtzIntroduction(1000);
  const saved = { ...kurtzIntroduction() }, position = kurtzPosition();
  for (let i = 0; i < 20; i++) updateKurtzIntroduction(1000);
  storage.set("journey.kurtzIntroduction", saved);
  expect(kurtzStage()).toBe("partial"); expect(kurtzPosition()).toEqual(position);
  expect(beginKurtzIntroduction()).toBe(false);
});
it.each(["listen", "challenge"] as const)("stores %s with a distinct pose and rejects preappearance choices", response => {
  expect(chooseKurtzResponse(response)).toBe(false); unlock(); beginKurtzIntroduction();
  for (let i = 0; i < 52; i++) updateKurtzIntroduction(1000);
  expect(chooseKurtzResponse(response)).toBe(true);
  expect(kurtzFirstResponse()).toBe(response); expect(kurtzPose()).toBe(response === "listen" ? "intense" : "commanding");
  expect(chooseKurtzResponse(response === "listen" ? "challenge" : "listen")).toBe(false);
});
it("ignores invalid deltas and bounds stalls so a background tab cannot skip the appearance", () => {
  unlock(); beginKurtzIntroduction(); updateKurtzIntroduction(NaN); updateKurtzIntroduction(-5);
  expect(kurtzIntroduction().elapsedMS).toBe(0); updateKurtzIntroduction(90000);
  expect(kurtzIntroduction().elapsedMS).toBe(1000);
});

import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { approachCheckpoint, approachProfile, markApproachBeat, seenApproachBeat, helmsmanFate,
  setApproachHelm, atApproachHelm } from "../src/content/state/approachState";
import { updateRiverApproach } from "../src/content/scenes/updateRiverApproach";
import { NavigationController } from "../src/puzzles/riverApproach/NavigationController";
import { approachRoute } from "../src/story/heart-of-darkness/riverApproach";
afterEach(() => { for (const key of ["approachNavigation", "approachSeen", "approachAtmosphere", "approachPosition", "helmsmanLost", "approachAtHelm"])
  storage.set(`journey.${key}`, undefined); });
it("hut branches trade initial visibility for sounding distance, without choosing a winning route", () => {
  expect(approachProfile("wait").initialMist).toBeLessThan(approachProfile("proceed").initialMist);
  expect(approachProfile("proceed").lookAhead).toBeGreaterThan(approachProfile("wait").lookAhead);
  expect(approachProfile("wait").speed).toBe(approachProfile("proceed").speed);
});
it("the loss interrupts the helm once; restoring an earlier checkpoint permits the event again", () => {
  const c = new NavigationController(approachRoute, { progress: .649 });
  approachCheckpoint.write({ ...c.state }); setApproachHelm(true);
  updateRiverApproach(c, { helm: true, steer: 0, throttle: 1 }, 100);
  expect(helmsmanFate()).toBe("lost"); expect(atApproachHelm()).toBe(false);
  expect(c.state.interruptionMS).toBe(2400);
  updateRiverApproach(c, { helm: true, steer: 0, throttle: 1 }, 100);
  expect(c.state.interruptionMS).toBe(2300);
  storage.set("journey.helmsmanLost", undefined);
  approachCheckpoint.write({ ...c.state, progress: .649, interruptionMS: 0 });
  updateRiverApproach(c, { helm: true, steer: 0, throttle: 1 }, 100);
  expect(c.state.interruptionMS).toBe(2400);
});
it("Pixi checkpoints keep navigation, contacts, whistle and interrupt; seen beats are idempotent", () => {
  const c = new NavigationController(approachRoute); c.interrupt(2400);
  approachCheckpoint.write({ ...c.state });
  expect(approachCheckpoint.read()?.interruptionMS).toBe(2400);
  markApproachBeat("helmsman"); markApproachBeat("helmsman");
  expect(seenApproachBeat("helmsman")).toBe(true);
  expect(helmsmanFate()).toBe("lost");
  expect(() => approachCheckpoint.write({ ...c.state, heading: Infinity })).toThrow();
});

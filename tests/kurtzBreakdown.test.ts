import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { departureCheckpoint, departureState } from "../src/content/state/kurtzDepartureState";
import { breakdownCheckpoint, breakdownState, beginBreakdown, updateBreakdown, hearBreakdown,
  examineEngine, startForge, fitRod, choosePapersResponse, finishPapersExchange, resumeDownstream,
  finishBreakdownExchange } from "../src/content/state/kurtzBreakdownState";

afterEach(() => ["kurtzDeparture", "kurtzBreakdown", "breakdownPosition"].forEach(id => storage.set(`journey.${id}`, undefined)));
const departed = () => departureCheckpoint.write({ ...departureState(), phase: "departed", response: "whistle",
  whistleUsed: true, progress: 1, finalSeen: true });
const forge = { x: 1250, y: 800 }, far = { x: 450, y: 820 };
const stop = () => { departed(); beginBreakdown(); for (let i = 0; i < 120; i++) updateBreakdown(100, far); hearBreakdown(); };
const repair = () => { examineEngine(); startForge(); for (let i = 0; i < 80; i++) updateBreakdown(100, forge); fitRod(); };

it("requires the closed departure and begins once", () => {
  expect(beginBreakdown()).toBe(false); departed();
  departureCheckpoint.write({ ...departureState(), finalSeen: false }); expect(beginBreakdown()).toBe(false);
  departureCheckpoint.write({ ...departureState(), finalSeen: true }); expect(beginBreakdown()).toBe(true);
  expect(beginBreakdown()).toBe(false); expect(breakdownState().phase).toBe("downstream");
});
it("halts the vessel once after bounded travel, while invalid/stalled ticks cannot skip it", () => {
  departed(); beginBreakdown(); updateBreakdown(NaN, far); updateBreakdown(-1, far);
  expect(breakdownState().distance).toBe(0); updateBreakdown(60000, far);
  expect(breakdownState().distance).toBe(2);
  for (let i = 0; i < 130; i++) updateBreakdown(100, far);
  expect(breakdownState().phase).toBe("stopped"); expect(breakdownState().distance).toBe(240);
  updateBreakdown(100, far); expect(breakdownState().distance).toBe(240);
  expect(hearBreakdown()).toBe(true); expect(hearBreakdown()).toBe(false);
});
it("requires inspection and actual proximity to tend the forge, then a separate rod fitting", () => {
  stop(); expect(startForge()).toBe(false); expect(fitRod()).toBe(false);
  expect(examineEngine()).toBe(true); expect(examineEngine()).toBe(false); expect(startForge()).toBe(true);
  expect(startForge()).toBe(false); for (let i = 0; i < 100; i++) updateBreakdown(100, far);
  expect(breakdownState().repairProgress).toBe(0);
  updateBreakdown(100, { x: NaN, y: 800 }); expect(breakdownState().repairProgress).toBe(0);
  for (let i = 0; i < 80; i++) updateBreakdown(100, forge);
  expect(breakdownState().repairProgress).toBe(1); expect(breakdownState().rodFitted).toBe(false);
  expect(fitRod()).toBe(true); expect(fitRod()).toBe(false); expect(resumeDownstream()).toBe(false);
});
it.each(["sealed", "ask"] as const)("%s papers response persists and cannot be rewritten; both paths require the closed exchange", response => {
  expect(choosePapersResponse(response)).toBe(false); stop();
  expect(choosePapersResponse(response)).toBe(true); expect(choosePapersResponse(response === "sealed" ? "ask" : "sealed")).toBe(false);
  repair(); expect(resumeDownstream()).toBe(false); finishPapersExchange();
  const saved = JSON.parse(JSON.stringify(breakdownState())); expect(resumeDownstream()).toBe(true);
  updateBreakdown(100, far); expect(breakdownState().distance).toBeGreaterThan(saved.distance);
  breakdownCheckpoint.write(saved); expect(breakdownState()).toEqual(saved);
  expect(resumeDownstream()).toBe(true); expect(resumeDownstream()).toBe(false);
  finishBreakdownExchange(); expect(breakdownState().finalSeen).toBe(true);
});
it("restores partial forge work without progressing while the worker is away", () => {
  stop(); examineEngine(); startForge(); for (let i = 0; i < 10; i++) updateBreakdown(100, forge);
  const saved = JSON.parse(JSON.stringify(breakdownState())); updateBreakdown(100, forge);
  breakdownCheckpoint.write(saved); updateBreakdown(100, far); expect(breakdownState()).toEqual(saved);
  expect(saved.repairProgress).toBeGreaterThan(0); expect(saved.repairProgress).toBeLessThan(1);
});
it("rejects impossible saved phases, work and custody combinations", () => {
  for (const patch of [{ phase: "dead" }, { distance: Infinity }, { distance: -1 }, { phase: "stopped", distance: 20 },
    { repairProgress: .5 }, { rodFitted: true }, { papersResponse: "give-manager" }, { papersSeen: true },
    { finalSeen: true }, { phase: "underway", distance: 240 }]) {
    storage.set("journey.kurtzBreakdown", { ...breakdownState(), ...patch } as never);
    expect(breakdownState().phase).toBe("inactive");
  }
});

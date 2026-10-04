import { storage } from "@drincs/pixi-vn";
import { afterEach, expect, it } from "vitest";
import { dockingProgress, stationFlag } from "../src/content/state/innerStationState";
import { updateStationDocking } from "../src/content/scenes/updateStationDocking";
afterEach(() => { storage.set("journey.dockProgress", undefined); storage.set("journey.innerStationReached", undefined); });
it("a frame stall cannot skip arrival; a restored fractional approach continues from its checkpoint", () => {
  dockingProgress.write(.4); updateStationDocking(9000);
  expect(dockingProgress.read()).toBeCloseTo(.4 + 100 / 9000, 10); expect(stationFlag("innerStationReached")).toBe(false);
  dockingProgress.write(.4); updateStationDocking(-1); expect(dockingProgress.read()).toBe(.4);
});
it("mooring reaches exactly one and does not restart when the scene is reconstructed", () => {
  for (let i = 0; i < 100; i++) updateStationDocking(100);
  expect(dockingProgress.read()).toBe(1); expect(stationFlag("innerStationReached")).toBe(true);
  updateStationDocking(50); expect(dockingProgress.read()).toBe(1);
});

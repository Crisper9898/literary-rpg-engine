import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { intendedState } from "./kurtzIntendedState";

const phases = ["inactive", "returned", "ebb", "complete"] as const;
export interface ThamesState { phase: typeof phases[number]; mooringObserved: boolean }
const initial = (): ThamesState => ({ phase: "inactive", mooringObserved: false });
export const thamesCheckpoint = createPixiStorageCheckpoint<ThamesState>("journey.thamesConclusion", (v): v is ThamesState => {
  const s = v as ThamesState | undefined;
  return !!s && phases.includes(s.phase) && typeof s.mooringObserved === "boolean" &&
    (s.phase !== "inactive" || !s.mooringObserved);
});
export const thamesState = () => thamesCheckpoint.read() ?? initial();
export const thamesPosition = createPixiStorageCheckpoint<Point>("journey.thamesPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 380 && p.x <= 1540 && Number.isFinite(p.y) && p.y >= 730 && p.y <= 870;
});
const advance = (from: ThamesState["phase"], to: ThamesState["phase"]) => {
  const s = thamesState(); if (s.phase !== from) return false;
  thamesCheckpoint.write({ ...s, phase: to }); return true;
};
export const canBeginThames = () => intendedState().phase === "complete" && thamesState().phase === "inactive";
export const beginThames = () => canBeginThames() && advance("inactive", "returned");
export function observeMooring() {
  const s = thamesState(); if (["inactive", "complete"].includes(s.phase) || s.mooringObserved) return false;
  thamesCheckpoint.write({ ...s, mooringObserved: true }); return true;
}
export const hearEbb = () => advance("returned", "ebb");
export const finishThames = () => advance("ebb", "complete");

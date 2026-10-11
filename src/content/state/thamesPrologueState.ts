import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";

const phases = ["inactive", "anchored", "telling", "ready", "complete"] as const;
export interface PrologueState { phase: typeof phases[number]; anchorageObserved: boolean }
const initial = (): PrologueState => ({ phase: "inactive", anchorageObserved: false });
export const prologueCheckpoint = createPixiStorageCheckpoint<PrologueState>("journey.thamesPrologue", (v): v is PrologueState => {
  const s = v as PrologueState | undefined;
  return !!s && phases.includes(s.phase) && typeof s.anchorageObserved === "boolean" &&
    (s.phase !== "inactive" || !s.anchorageObserved);
});
export const prologueState = () => prologueCheckpoint.read() ?? initial();
export const prologuePosition = createPixiStorageCheckpoint<Point>("journey.prologuePosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 380 && p.x <= 1540 && Number.isFinite(p.y) && p.y >= 730 && p.y <= 870;
});
const advance = (from: PrologueState["phase"], to: PrologueState["phase"]) => {
  const s = prologueState(); if (s.phase !== from) return false;
  prologueCheckpoint.write({ ...s, phase: to }); return true;
};
export const beginPrologue = () => advance("inactive", "anchored");
export function observeAnchorage() {
  const s = prologueState(); if (s.phase !== "anchored" || s.anchorageObserved) return false;
  prologueCheckpoint.write({ ...s, anchorageObserved: true }); return true;
}
export const beginOpeningTale = () => advance("anchored", "telling");
export const finishOpeningTale = () => advance("telling", "ready");
export const leavePrologue = () => advance("ready", "complete");

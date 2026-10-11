import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { legacyState } from "./kurtzLegacyState";

export type IntendedApproach = "witness" | "listen";
const phases = ["inactive", "arrived", "delivered", "speaking", "heard", "lastWords", "departure", "complete"] as const;
export interface IntendedState {
  phase: typeof phases[number];
  windowObserved: boolean;
  pianoObserved: boolean;
  approach?: IntendedApproach;
}
const initial = (): IntendedState => ({ phase: "inactive", windowObserved: false, pianoObserved: false });
const valid = (v: unknown): v is IntendedState => {
  if (!v || typeof v !== "object") return false;
  const s = v as IntendedState, index = phases.indexOf(s.phase);
  if (index < 0 || typeof s.windowObserved !== "boolean" || typeof s.pianoObserved !== "boolean" ||
    s.approach !== undefined && !["witness", "listen"].includes(s.approach)) return false;
  return (index !== 0 || !s.windowObserved && !s.pianoObserved) &&
    (index < 3 ? s.approach === undefined : s.approach !== undefined);
};
export const intendedCheckpoint = createPixiStorageCheckpoint<IntendedState>("journey.kurtzIntended", valid);
export const intendedState = () => intendedCheckpoint.read() ?? initial();
export const intendedPosition = createPixiStorageCheckpoint<Point>("journey.intendedPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 360 && p.x <= 1580 && Number.isFinite(p.y) && p.y >= 700 && p.y <= 870;
});
const advance = (from: IntendedState["phase"], to: IntendedState["phase"], fields: Partial<IntendedState> = {}) => {
  const s = intendedState(); if (s.phase !== from) return false;
  intendedCheckpoint.write({ ...s, ...fields, phase: to }); return true;
};
export const canBeginIntended = () => legacyState().phase === "complete" && intendedState().phase === "inactive";
export function beginIntended() { return canBeginIntended() && advance("inactive", "arrived"); }
export function observeIntendedRoom(point: "window" | "piano") {
  const s = intendedState(), field = point === "window" ? "windowObserved" : "pianoObserved";
  if (s.phase === "inactive" || s.phase === "complete" || s[field]) return false;
  intendedCheckpoint.write({ ...s, [field]: true }); return true;
}
export const deliverIntendedLetters = () => advance("arrived", "delivered");
export const chooseIntendedApproach = (approach: IntendedApproach) => advance("delivered", "speaking", { approach });
export const finishIntendedExchange = () => advance("speaking", "heard");
export const hearLastWordsRequest = () => advance("heard", "lastWords");
export const finishLastWords = () => advance("lastWords", "departure");
export const leaveIntended = () => advance("departure", "complete");

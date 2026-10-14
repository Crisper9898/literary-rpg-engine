import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";

const phases = ["inactive", "coast", "landfall", "landed", "works", "grove", "accounting", "ready", "complete"] as const;
export interface OuterState {
  phase: typeof phases[number];
  surfObserved: boolean;
  groveResponse: "give" | "stay" | null;
}
const initial = (): OuterState => ({ phase: "inactive", surfObserved: false, groveResponse: null });
export const outerCheckpoint = createPixiStorageCheckpoint<OuterState>("journey.outerStation", (v): v is OuterState => {
  const s = v as OuterState | undefined;
  if (!s || !phases.includes(s.phase) || typeof s.surfObserved !== "boolean" || ![null, "give", "stay"].includes(s.groveResponse)) return false;
  if (s.phase === "inactive" && s.surfObserved) return false;
  if (!["grove", "accounting", "ready", "complete"].includes(s.phase) && s.groveResponse !== null) return false;
  return !["accounting", "ready", "complete"].includes(s.phase) || s.groveResponse !== null;
});
export const outerState = () => outerCheckpoint.read() ?? initial();
export const outerPosition = createPixiStorageCheckpoint<Point>("journey.outerPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 380 && p.x <= 1540 && Number.isFinite(p.y) && p.y >= 730 && p.y <= 890;
});
const advance = (from: OuterState["phase"], to: OuterState["phase"]) => {
  const s = outerState(); if (s.phase !== from) return false;
  outerCheckpoint.write({ ...s, phase: to }); return true;
};
export const isOuterCoast = () => ["coast", "landfall"].includes(outerState().phase);
export const beginOuterVoyage = () => advance("inactive", "coast");
export function observeSurf() {
  const s = outerState(); if (!isOuterCoast() || s.surfObserved) return false;
  outerCheckpoint.write({ ...s, surfObserved: true }); return true;
}
export const witnessWarship = () => advance("coast", "landfall");
export const landAtOuterStation = () => advance("landfall", "landed");
export const inspectOuterWorks = () => advance("landed", "works");
export const enterOuterGrove = () => advance("works", "grove");
export function chooseGroveResponse(response: NonNullable<OuterState["groveResponse"]>) {
  const s = outerState(); if (s.phase !== "grove" || s.groveResponse) return false;
  outerCheckpoint.write({ ...s, groveResponse: response }); return true;
}
export const leaveOuterGrove = () => outerState().groveResponse !== null && advance("grove", "accounting");
export const hearAccountant = () => advance("accounting", "ready");
export const finishOuterStation = () => advance("ready", "complete");

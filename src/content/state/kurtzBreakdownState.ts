import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { breakdownPoints } from "../../story/heart-of-darkness/kurtzBreakdown";
import { departureState } from "./kurtzDepartureState";
export type PapersResponse = "sealed" | "ask";
export interface BreakdownState {
  phase: "inactive" | "downstream" | "stopped" | "underway";
  distance: number; breakdownSeen: boolean; engineExamined: boolean; repairStarted: boolean;
  repairProgress: number; rodFitted: boolean; papersResponse?: PapersResponse; papersSeen: boolean; finalSeen: boolean;
}
const valid = (v: unknown): v is BreakdownState => {
  if (!v || typeof v !== "object") return false;
  const s = v as BreakdownState;
  return ["inactive", "downstream", "stopped", "underway"].includes(s.phase) &&
    [s.breakdownSeen, s.engineExamined, s.repairStarted, s.rodFitted, s.papersSeen, s.finalSeen].every(x => typeof x === "boolean") &&
    Number.isFinite(s.distance) && s.distance >= 0 && Number.isFinite(s.repairProgress) && s.repairProgress >= 0 && s.repairProgress <= 1 &&
    (s.papersResponse === undefined || s.papersResponse === "sealed" || s.papersResponse === "ask") &&
    (s.phase !== "inactive" || s.distance === 0) && (s.phase !== "downstream" || s.distance < 240) &&
    (s.phase !== "stopped" || s.distance === 240) &&
    (!["inactive", "downstream"].includes(s.phase) || !s.breakdownSeen && !s.engineExamined && !s.repairStarted &&
      s.repairProgress === 0 && !s.rodFitted && !s.papersResponse && !s.papersSeen) &&
    (!s.engineExamined || s.breakdownSeen) && (!s.repairStarted || s.engineExamined) &&
    (s.repairProgress === 0 || s.repairStarted) && (!s.rodFitted || s.repairProgress === 1) &&
    (!s.papersResponse || s.breakdownSeen) && (!s.papersSeen || !!s.papersResponse) &&
    (s.phase !== "underway" || s.distance >= 240 && s.rodFitted && s.papersSeen) && (!s.finalSeen || s.phase === "underway");
};
export const breakdownCheckpoint = createPixiStorageCheckpoint<BreakdownState>("journey.kurtzBreakdown", valid);
export const breakdownState = (): BreakdownState => breakdownCheckpoint.read() ?? {
  phase: "inactive", distance: 0, breakdownSeen: false, engineExamined: false, repairStarted: false,
  repairProgress: 0, rodFitted: false, papersSeen: false, finalSeen: false,
};
const patch = (s: Partial<BreakdownState>) => breakdownCheckpoint.write({ ...breakdownState(), ...s });
export const breakdownPosition = createPixiStorageCheckpoint<Point>("journey.breakdownPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 420 && p.x <= 1500 && Number.isFinite(p.y) && p.y >= 680 && p.y <= 840;
});
export const canBeginBreakdown = () => departureState().phase === "departed" && departureState().finalSeen && breakdownState().phase === "inactive";
export function beginBreakdown() { if (!canBeginBreakdown()) return false; patch({ phase: "downstream" }); return true; }
export function hearBreakdown() {
  const s = breakdownState(); if (s.phase !== "stopped" || s.breakdownSeen) return false;
  patch({ breakdownSeen: true }); return true;
}
export function examineEngine() {
  const s = breakdownState(); if (s.phase !== "stopped" || !s.breakdownSeen || s.engineExamined) return false;
  patch({ engineExamined: true }); return true;
}
export function startForge() {
  const s = breakdownState(); if (s.phase !== "stopped" || !s.engineExamined || s.repairStarted) return false;
  patch({ repairStarted: true }); return true;
}
export function fitRod() {
  const s = breakdownState(); if (s.phase !== "stopped" || s.repairProgress !== 1 || s.rodFitted) return false;
  patch({ rodFitted: true }); return true;
}
export function choosePapersResponse(response: PapersResponse) {
  const s = breakdownState(); if (s.phase !== "stopped" || !s.breakdownSeen || s.papersResponse) return false;
  patch({ papersResponse: response }); return true;
}
export function finishPapersExchange() { if (breakdownState().papersResponse) patch({ papersSeen: true }); }
export const canResumeDownstream = () => breakdownState().phase === "stopped" && breakdownState().rodFitted && breakdownState().papersSeen;
export function resumeDownstream() { if (!canResumeDownstream()) return false; patch({ phase: "underway" }); return true; }
export function finishBreakdownExchange() { if (breakdownState().phase === "underway") patch({ finalSeen: true }); }
/** Episode-local travel/work only. The water keeps flowing while the vessel is moored. */
export function updateBreakdown(ms: number, worker: Point) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  const s = breakdownState(), dt = Math.min(ms, 50);
  if (s.phase === "downstream" || s.phase === "underway") {
    const distance = s.phase === "downstream" ? Math.min(240, s.distance + dt * .04) : s.distance + dt * .04;
    patch({ distance, phase: s.phase === "downstream" && distance >= 240 ? "stopped" : s.phase });
  } else if (s.phase === "stopped" && s.repairStarted && s.repairProgress < 1 &&
    Number.isFinite(worker.x) && Number.isFinite(worker.y) && Math.hypot(worker.x - breakdownPoints.forge.x, worker.y - breakdownPoints.forge.y) <= 85) {
    patch({ repairProgress: Math.min(1, s.repairProgress + dt / 3000) });
  }
}

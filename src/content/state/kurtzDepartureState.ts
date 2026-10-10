import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { evacuationState } from "./kurtzEvacuationState";
export type DepartureResponse = "whistle" | "intervene";
export interface DepartureState {
  phase: "inactive" | "aboard" | "pressure" | "departing" | "departed";
  patientSeen: boolean; bankSeen: boolean; response?: DepartureResponse;
  crewWarned: boolean; whistleUsed: boolean; progress: number; finalSeen: boolean;
}
const valid = (v: unknown): v is DepartureState => {
  if (!v || typeof v !== "object") return false;
  const s = v as DepartureState;
  return ["inactive", "aboard", "pressure", "departing", "departed"].includes(s.phase) &&
    [s.patientSeen, s.bankSeen, s.crewWarned, s.whistleUsed, s.finalSeen].every(x => typeof x === "boolean") &&
    (s.response === undefined || s.response === "whistle" || s.response === "intervene") &&
    Number.isFinite(s.progress) && s.progress >= 0 && s.progress <= 1 &&
    (!s.response || !["inactive", "aboard"].includes(s.phase)) &&
    (!s.crewWarned || s.response === "intervene") && (!s.whistleUsed || !!s.response && (s.response !== "intervene" || s.crewWarned)) &&
    (!s.bankSeen || !["inactive", "aboard"].includes(s.phase)) &&
    (!["departing", "departed"].includes(s.phase) || s.whistleUsed) &&
    (s.phase !== "departed" || s.progress === 1) && (s.progress === 0 || ["departing", "departed"].includes(s.phase)) &&
    (!s.finalSeen || s.phase === "departed");
};
export const departureCheckpoint = createPixiStorageCheckpoint<DepartureState>("journey.kurtzDeparture", valid);
export const departureState = (): DepartureState => departureCheckpoint.read() ?? {
  phase: "inactive", patientSeen: false, bankSeen: false, crewWarned: false, whistleUsed: false, progress: 0, finalSeen: false,
};
const patch = (s: Partial<DepartureState>) => departureCheckpoint.write({ ...departureState(), ...s });
export const departurePosition = createPixiStorageCheckpoint<Point>("journey.departurePosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 420 && p.x <= 1500 && Number.isFinite(p.y) && p.y >= 680 && p.y <= 840;
});
export const canBeginDeparture = () => evacuationState().phase === "ready" && evacuationState().readySeen && departureState().phase === "inactive";
export function beginDeparture() {
  if (!canBeginDeparture()) return false;
  patch({ phase: "aboard" }); return true;
}
export function visitDeparturePatient() {
  if (departureState().phase === "inactive") return false;
  patch({ patientSeen: true }); return true;
}
export function releaseMooring() {
  if (departureState().phase !== "aboard") return false;
  patch({ phase: "pressure" }); return true;
}
export function observeBank() {
  const s = departureState(); if (s.phase === "inactive" || s.phase === "aboard" || s.bankSeen) return false;
  patch({ bankSeen: true }); return true;
}
export function chooseDepartureResponse(response: DepartureResponse) {
  const s = departureState(); if (s.phase !== "pressure" || s.response) return false;
  patch({ response }); return true;
}
export function warnCrew() {
  const s = departureState(); if (s.phase !== "pressure" || s.response !== "intervene" || s.crewWarned) return false;
  patch({ crewWarned: true }); return true;
}
export function useWhistle() {
  const s = departureState(); if (s.phase !== "pressure" || !s.response || s.whistleUsed || s.response === "intervene" && !s.crewWarned) return false;
  patch({ whistleUsed: true }); return true;
}
export function startManoeuvre() {
  if (departureState().phase !== "pressure" || !departureState().whistleUsed) return false;
  patch({ phase: "departing" }); return true;
}
/** Saved distance of this short manoeuvre; does not advance the downstream chapter. */
export function updateDeparture(ms: number) {
  const s = departureState(); if (s.phase !== "departing" || !Number.isFinite(ms) || ms <= 0) return;
  const progress = Math.min(1, s.progress + Math.min(100, ms) / 8000);
  patch({ progress, phase: progress >= 1 ? "departed" : "departing" });
}
export function finishDepartureExchange() { if (departureState().phase === "departed") patch({ finalSeen: true }); }

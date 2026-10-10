import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { finalNightState } from "./kurtzFinalNightState";

export type CareResponse = "help" | "alone";
export interface AftermathState {
  phase: "inactive" | "morning" | "bereaved" | "fever" | "resting" | "recovering" | "survived";
  distance: number;
  progress: number;
  papersSecured: boolean;
  response?: CareResponse;
  careSeen: boolean;
  waterReceived: boolean;
}
const initial = (): AftermathState => ({ phase: "inactive", distance: 0, progress: .48,
  papersSecured: false, careSeen: false, waterReceived: false });
const valid = (v: unknown): v is AftermathState => {
  if (!v || typeof v !== "object") return false;
  const s = v as AftermathState;
  if (!["inactive", "morning", "bereaved", "fever", "resting", "recovering", "survived"].includes(s.phase) ||
    !Number.isFinite(s.distance) || s.distance < 0 || !Number.isFinite(s.progress) || s.progress < .48 || s.progress > .78 ||
    ![s.papersSecured, s.careSeen, s.waterReceived].every(x => typeof x === "boolean") ||
    s.response !== undefined && s.response !== "help" && s.response !== "alone") return false;
  if (s.phase === "inactive" && (s.distance !== 0 || s.progress !== .48)) return false;
  if (["inactive", "morning", "bereaved"].includes(s.phase)) return !s.papersSecured && !s.response && !s.careSeen && !s.waterReceived;
  if (!s.papersSecured || (s.careSeen || s.waterReceived) && !s.response) return false;
  // Help is delivered in the reply; self-care requires the closed reply first.
  if (s.response === "help" && s.careSeen && !s.waterReceived || s.response === "alone" && s.waterReceived && !s.careSeen) return false;
  return s.phase === "fever" || !!s.response && s.careSeen && s.waterReceived;
};
export const aftermathCheckpoint = createPixiStorageCheckpoint<AftermathState>("journey.kurtzAftermath", valid);
export const aftermathState = () => aftermathCheckpoint.read() ?? initial();
const patch = (s: Partial<AftermathState>) => aftermathCheckpoint.write({ ...aftermathState(), ...s });
export const aftermathPosition = createPixiStorageCheckpoint<Point>("journey.aftermathPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 420 && p.x <= 1500 && Number.isFinite(p.y) && p.y >= 680 && p.y <= 840;
});
export const canBeginAftermath = () => finalNightState().phase === "confirmed" && finalNightState().finalSeen && aftermathState().phase === "inactive";
export function beginAftermath() {
  if (!canBeginAftermath()) return false;
  patch({ phase: "morning", distance: finalNightState().distance }); return true;
}
export function hearBurial() {
  if (aftermathState().phase !== "morning") return false;
  patch({ phase: "bereaved" }); return true;
}
export function securePapers() {
  if (aftermathState().phase !== "bereaved") return false;
  patch({ phase: "fever", papersSecured: true }); return true;
}
export function chooseCareResponse(response: CareResponse) {
  if (aftermathState().phase !== "fever" || aftermathState().response) return false;
  patch({ response }); return true;
}
export function receiveHelp() {
  const s = aftermathState();
  if (s.phase !== "fever" || s.response !== "help" || s.waterReceived) return false;
  patch({ waterReceived: true }); return true;
}
export function finishCareExchange() {
  const s = aftermathState();
  if (s.phase === "fever" && s.response && (s.response === "alone" || s.waterReceived)) patch({ careSeen: true });
}
export function collectWater() {
  const s = aftermathState();
  if (s.phase !== "fever" || s.response !== "alone" || !s.careSeen || s.waterReceived) return false;
  patch({ waterReceived: true }); return true;
}
export function beginRest() {
  const s = aftermathState();
  if (s.phase !== "fever" || !s.careSeen || !s.waterReceived) return false;
  patch({ phase: "resting" }); return true;
}
export function finishRest() { if (aftermathState().phase === "resting") patch({ phase: "recovering" }); }
export function finishAftermath() {
  if (aftermathState().phase !== "recovering") return false;
  patch({ phase: "survived" }); return true;
}
/** Travel/atmosphere only. Time never buries Kurtz, selects care or cures Marlow. */
export function updateAftermath(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0 || aftermathState().phase === "inactive") return;
  const s = aftermathState(), dt = Math.min(ms, 50);
  patch({ distance: s.distance + dt * .024, progress: Math.min(.78, s.progress + dt * .000015) });
}

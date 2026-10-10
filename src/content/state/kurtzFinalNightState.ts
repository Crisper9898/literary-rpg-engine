import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { breakdownState } from "./kurtzBreakdownState";

export type VigilResponse = "reassure" | "listen";
export interface FinalNightState {
  phase: "inactive" | "evening" | "vigil" | "words" | "left" | "confirmed";
  distance: number;
  progress: number;
  candle: "rack" | "held" | "bedside" | "out";
  response?: VigilResponse;
  vigilSeen: boolean;
  wordsHeard: boolean;
  wordsSeen: boolean;
  finalSeen: boolean;
}
const initial = (): FinalNightState => ({ phase: "inactive", distance: 0, progress: .48, candle: "rack",
  vigilSeen: false, wordsHeard: false, wordsSeen: false, finalSeen: false });
const valid = (v: unknown): v is FinalNightState => {
  if (!v || typeof v !== "object") return false;
  const s = v as FinalNightState;
  if (!["inactive", "evening", "vigil", "words", "left", "confirmed"].includes(s.phase) ||
    !Number.isFinite(s.distance) || s.distance < 0 || !Number.isFinite(s.progress) || s.progress < .48 || s.progress > .78 ||
    ![s.vigilSeen, s.wordsHeard, s.wordsSeen, s.finalSeen].every(x => typeof x === "boolean") ||
    s.response !== undefined && s.response !== "reassure" && s.response !== "listen") return false;
  if (s.phase === "inactive" && (s.distance !== 0 || s.progress !== .48)) return false;
  if (["inactive", "evening"].includes(s.phase)) return (s.candle === "rack" || s.phase === "evening" && s.candle === "held") &&
    !s.response && !s.vigilSeen && !s.wordsHeard && !s.wordsSeen && !s.finalSeen;
  if (s.phase === "vigil") return s.candle === "bedside" && (!s.vigilSeen || !!s.response) && !s.wordsHeard && !s.wordsSeen && !s.finalSeen;
  return !!s.response && s.vigilSeen && s.wordsHeard &&
    (s.phase === "words" ? s.candle === "bedside" && !s.finalSeen : s.candle === "out" && s.wordsSeen) &&
    (!s.finalSeen || s.phase === "confirmed");
};
export const finalNightCheckpoint = createPixiStorageCheckpoint<FinalNightState>("journey.kurtzFinalNight", valid);
export const finalNightState = () => finalNightCheckpoint.read() ?? initial();
const patch = (state: Partial<FinalNightState>) => finalNightCheckpoint.write({ ...finalNightState(), ...state });
export const finalNightPosition = createPixiStorageCheckpoint<Point>("journey.finalNightPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 420 && p.x <= 1500 && Number.isFinite(p.y) && p.y >= 680 && p.y <= 840;
});
export const canBeginFinalNight = () => breakdownState().phase === "underway" && breakdownState().finalSeen && finalNightState().phase === "inactive";
export function beginFinalNight() {
  if (!canBeginFinalNight()) return false;
  patch({ phase: "evening", distance: breakdownState().distance }); return true;
}
export function takeCandle() {
  if (finalNightState().phase !== "evening" || finalNightState().candle !== "rack") return false;
  patch({ candle: "held" }); return true;
}
export function placeCandle() {
  if (finalNightState().phase !== "evening" || finalNightState().candle !== "held") return false;
  patch({ phase: "vigil", candle: "bedside" }); return true;
}
export function chooseVigilResponse(response: VigilResponse) {
  if (finalNightState().phase !== "vigil" || finalNightState().response) return false;
  patch({ response }); return true;
}
export function finishVigil() { if (finalNightState().phase === "vigil" && finalNightState().response) patch({ vigilSeen: true }); }
export function hearFinalWords() {
  if (finalNightState().phase !== "vigil" || !finalNightState().vigilSeen) return false;
  patch({ phase: "words", wordsHeard: true }); return true;
}
export function finishFinalWords() { if (finalNightState().phase === "words") patch({ wordsSeen: true }); }
export function leavePatient() {
  if (finalNightState().phase !== "words" || !finalNightState().wordsSeen) return false;
  patch({ phase: "left", candle: "out" }); return true;
}
export function confirmKurtzDeath() {
  if (finalNightState().phase !== "left") return false;
  patch({ phase: "confirmed" }); return true;
}
export function finishFinalNight() { if (finalNightState().phase === "confirmed") patch({ finalSeen: true }); }
/** Travel and dusk only. Waiting never speaks the words, leaves the patient or announces death. */
export function updateFinalNight(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0 || finalNightState().phase === "inactive") return;
  const s = finalNightState(), dt = Math.min(ms, 50);
  patch({ distance: s.distance + dt * .028, progress: Math.min(.78, s.progress + dt * .000025) });
}

import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { nightState } from "./kurtzNightEscapeState";
export type EvacuationPriority = "patient" | "cargo";
export type EvacuationPhase = "inactive" | "morning" | "preparing" | "transfer" | "ready";
export interface EvacuationState {
  phase: EvacuationPhase; morningMS: number; patientSeen: boolean; priority?: EvacuationPriority;
  cotSecured: boolean; landingClear: boolean; cargoFirst: boolean; cot: Point;
  pose: "weak" | "coughing" | "intense"; readySeen: boolean;
}
const valid = (v: unknown): v is EvacuationState => {
  if (!v || typeof v !== "object") return false;
  const s = v as EvacuationState;
  return ["inactive", "morning", "preparing", "transfer", "ready"].includes(s.phase) &&
    Number.isFinite(s.morningMS) && s.morningMS >= 0 && s.morningMS <= 3000 &&
    [s.patientSeen, s.cotSecured, s.landingClear, s.cargoFirst, s.readySeen].every(x => typeof x === "boolean") &&
    (s.priority === undefined || s.priority === "patient" || s.priority === "cargo") &&
    ["weak", "coughing", "intense"].includes(s.pose) && !!s.cot &&
    Number.isFinite(s.cot.x) && s.cot.x >= 590 && s.cot.x <= 1315 && Number.isFinite(s.cot.y) && s.cot.y >= 775 && s.cot.y <= 780 &&
    (!s.priority || s.patientSeen) && (!s.cargoFirst || s.priority === "cargo") &&
    (!(s.cotSecured || s.landingClear) || !!s.priority) && (!s.readySeen || s.phase === "ready") &&
    (!["transfer", "ready"].includes(s.phase) || !!s.priority && s.cotSecured && s.landingClear &&
      (s.priority !== "cargo" || s.cargoFirst));
};
export const evacuationCheckpoint = createPixiStorageCheckpoint<EvacuationState>("journey.kurtzEvacuation", valid);
export const evacuationState = (): EvacuationState => evacuationCheckpoint.read() ?? {
  phase: "inactive", morningMS: 0, patientSeen: false, cotSecured: false, landingClear: false,
  cargoFirst: false, cot: { x: 1315, y: 780 }, pose: "weak", readySeen: false,
};
const patch = (value: Partial<EvacuationState>) => evacuationCheckpoint.write({ ...evacuationState(), ...value });
export const morningBlend = createPixiStorageCheckpoint<number>("journey.kurtzEvacuationMorning",
  (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1);
export const canBeginEvacuation = () => nightState().phase === "returned" && nightState().returnedSeen && evacuationState().phase === "inactive";
export function beginEvacuation() {
  if (!canBeginEvacuation()) return false;
  patch({ phase: "morning" }); morningBlend.write(0); return true;
}
export function updateEvacuationMorning(ms: number) {
  const s = evacuationState(); if (s.phase !== "morning" || !Number.isFinite(ms) || ms <= 0) return;
  patch({ morningMS: Math.min(3000, s.morningMS + Math.min(1000, ms)) });
  if (evacuationState().morningMS === 3000 && (morningBlend.read() ?? 0) >= .99) patch({ phase: "preparing" });
}
export function examinePatient() {
  const s = evacuationState(); if (s.phase !== "preparing" || s.patientSeen) return false;
  patch({ patientSeen: true, pose: "coughing" }); return true;
}
export function chooseEvacuationPriority(priority: EvacuationPriority) {
  const s = evacuationState(); if (s.phase !== "preparing" || !s.patientSeen || s.priority) return false;
  patch({ priority, pose: "weak" }); return true;
}
export function secureCot() {
  const s = evacuationState(); if (s.phase !== "preparing" || !s.priority || s.cotSecured) return false;
  patch({ cotSecured: true }); return true;
}
export function clearLanding() {
  const s = evacuationState(); if (s.phase !== "preparing" || !s.priority || s.landingClear) return false;
  patch({ landingClear: true }); return true;
}
export function loadFirstCargo() {
  const s = evacuationState(); if (s.phase !== "preparing" || s.priority !== "cargo" || s.cargoFirst) return false;
  patch({ cargoFirst: true, pose: "coughing" }); return true;
}
export const canTransferCot = () => {
  const s = evacuationState(); return s.phase === "preparing" && !!s.priority && s.cotSecured && s.landingClear &&
    (s.priority !== "cargo" || s.cargoFirst);
};
export function beginCotTransfer() {
  if (!canTransferCot()) return false;
  patch({ phase: "transfer", pose: "weak" }); return true;
}
/** One story route: Marlow walks ahead of the bearers; no new navigation/save system. */
export function updateCotTransfer(player: Point, ms: number) {
  const s = evacuationState(); if (s.phase !== "transfer" || !Number.isFinite(ms) || ms <= 0) return;
  const gap = Math.hypot(player.x - s.cot.x, player.y - s.cot.y);
  if (gap > 200 || player.x > s.cot.x - 30 || gap < 40) return;
  const distance = Math.hypot(s.cot.x - 590, s.cot.y - 775);
  if (distance < .01) return;
  const step = Math.min(distance, 68 * Math.min(50, ms) / 1000, gap - 40);
  patch({ cot: { x: Math.max(590, s.cot.x + (590 - s.cot.x) * step / distance),
    y: Math.max(775, s.cot.y + (775 - s.cot.y) * step / distance) } });
}
export const cotAtLanding = () => Math.hypot(evacuationState().cot.x - 590, evacuationState().cot.y - 775) <= 28;
export function finishEvacuation(player: Point) {
  if (evacuationState().phase !== "transfer" || !cotAtLanding() || Math.hypot(player.x - 510, player.y - 800) > 110) return false;
  patch({ phase: "ready", pose: "weak" }); return true;
}
export const setEvacuationPose = (pose: EvacuationState["pose"]) => patch({ pose });
export function finishEvacuationExchange() {
  if (evacuationState().phase === "ready") patch({ readySeen: true });
}

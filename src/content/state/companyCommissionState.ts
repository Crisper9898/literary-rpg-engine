import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";

const phases = ["inactive", "recommended", "waiting", "admitted", "contracted", "examining", "cleared", "ready", "complete"] as const;
export interface CommissionState {
  phase: typeof phases[number];
  mapObserved: boolean;
  medicalResponse: "return" | "question" | null;
}
const initial = (): CommissionState => ({ phase: "inactive", mapObserved: false, medicalResponse: null });
export const commissionCheckpoint = createPixiStorageCheckpoint<CommissionState>("journey.companyCommission", (v): v is CommissionState => {
  const s = v as CommissionState | undefined;
  if (!s || !phases.includes(s.phase) || typeof s.mapObserved !== "boolean" ||
    ![null, "return", "question"].includes(s.medicalResponse)) return false;
  if (s.phase === "inactive" && s.mapObserved) return false;
  if (!["examining", "cleared", "ready", "complete"].includes(s.phase) && s.medicalResponse !== null) return false;
  return !["cleared", "ready", "complete"].includes(s.phase) || s.medicalResponse !== null;
});
export const commissionState = () => commissionCheckpoint.read() ?? initial();
export const commissionPosition = createPixiStorageCheckpoint<Point>("journey.commissionPosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 360 && p.x <= 1580 && Number.isFinite(p.y) && p.y >= 700 && p.y <= 870;
});
const advance = (from: CommissionState["phase"], to: CommissionState["phase"]) => {
  const s = commissionState(); if (s.phase !== from) return false;
  commissionCheckpoint.write({ ...s, phase: to }); return true;
};
export const beginCommission = () => advance("inactive", "recommended");
export function observeCompanyMap() {
  const s = commissionState();
  if (!["recommended", "waiting", "admitted", "contracted"].includes(s.phase) || s.mapObserved) return false;
  commissionCheckpoint.write({ ...s, mapObserved: true }); return true;
}
export const receiveAppointment = () => advance("recommended", "waiting");
export const enterCompany = () => advance("waiting", "admitted");
export const signContract = () => advance("admitted", "contracted");
export const beginExamination = () => advance("contracted", "examining");
export function chooseMedicalResponse(response: NonNullable<CommissionState["medicalResponse"]>) {
  const s = commissionState(); if (s.phase !== "examining" || s.medicalResponse) return false;
  commissionCheckpoint.write({ ...s, medicalResponse: response }); return true;
}
export const finishExamination = () => commissionState().medicalResponse !== null && advance("examining", "cleared");
export const recallFarewell = () => advance("cleared", "ready");
export const leaveCompany = () => advance("ready", "complete");

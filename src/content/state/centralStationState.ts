import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";

const phases = ["inactive", "trail", "ravine", "camp", "companion", "approach", "arrived", "wreck", "ready", "complete"] as const;
export interface CentralState {
  phase: typeof phases[number];
  villageObserved: boolean;
  companionResponse: "shade" | "load" | null;
}
const initial = (): CentralState => ({ phase: "inactive", villageObserved: false, companionResponse: null });
export const centralCheckpoint = createPixiStorageCheckpoint<CentralState>("journey.centralStation", (value): value is CentralState => {
  const state = value as CentralState | undefined;
  if (!state || !phases.includes(state.phase) || typeof state.villageObserved !== "boolean" ||
    ![null, "shade", "load"].includes(state.companionResponse)) return false;
  if (state.phase === "inactive" && state.villageObserved) return false;
  if (["inactive", "trail", "ravine", "camp"].includes(state.phase) && state.companionResponse !== null) return false;
  return !["approach", "arrived", "wreck", "ready", "complete"].includes(state.phase) || state.companionResponse !== null;
});
export const centralState = () => centralCheckpoint.read() ?? initial();
export const centralPosition = createPixiStorageCheckpoint<Point>("journey.centralPosition", (value): value is Point => {
  const point = value as Point | undefined;
  return !!point && Number.isFinite(point.x) && point.x >= 380 && point.x <= 1540 &&
    Number.isFinite(point.y) && point.y >= 730 && point.y <= 890;
});
const advance = (from: CentralState["phase"], to: CentralState["phase"]) => {
  const state = centralState();
  if (state.phase !== from) return false;
  centralCheckpoint.write({ ...state, phase: to }); return true;
};
export const isCaravan = () => ["trail", "ravine", "camp", "companion", "approach"].includes(centralState().phase);
export const beginCaravan = () => advance("inactive", "trail");
export function observeVillage() {
  const state = centralState();
  if (!["trail", "ravine", "camp"].includes(state.phase) || state.villageObserved) return false;
  centralCheckpoint.write({ ...state, villageObserved: true }); return true;
}
export const crossRavine = () => advance("trail", "ravine");
export const reachCamp = () => advance("ravine", "camp");
export const meetCompanion = () => advance("camp", "companion");
export function chooseCompanionResponse(response: NonNullable<CentralState["companionResponse"]>) {
  const state = centralState();
  if (state.phase !== "companion" || state.companionResponse || !["shade", "load"].includes(response)) return false;
  centralCheckpoint.write({ ...state, companionResponse: response }); return true;
}
export const resumeCaravan = () => centralState().companionResponse !== null && advance("companion", "approach");
export const arriveCentralStation = () => advance("approach", "arrived");
export const hearWreckNews = () => advance("arrived", "wreck");
export const inspectSunkenSteamer = () => advance("wreck", "ready");
export const finishCentralArrival = () => advance("ready", "complete");

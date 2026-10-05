import { storage } from "@drincs/pixi-vn";
import { stationFlag } from "./innerStationState";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
export type Discovery = "ivory" | "palisade" | "influence" | "report";
export type Interpretation = "understand" | "brutality";
const flags: Record<Discovery, string> = { ivory: "ivoryObserved", palisade: "palisadeObserved",
  influence: "kurtzInfluenceObserved", report: "kurtzReportObserved" };
export const revelationsAvailable = () => stationFlag("kurtzIntroductionComplete");
export function discoveries(): Discovery[] {
  const value = storage.get<unknown>("journey.stationDiscoveries");
  return Array.isArray(value) ? [...new Set(value.filter((id): id is Discovery => typeof id === "string" && Object.hasOwn(flags, id)))] : [];
}
export function discover(id: Discovery) {
  if (!revelationsAvailable() || discoveries().includes(id)) return false;
  storage.set(`journey.${flags[id]}`, true);
  storage.set("journey.stationDiscoveries", [...discoveries(), id]); return true;
}
export const revelationsReady = () => revelationsAvailable() && discoveries().length >= 2;
export const interpretation = () => {
  const value = storage.get("journey.kurtzInterpretation");
  return value === "understand" || value === "brutality" ? value : undefined;
};
export function chooseInterpretation(value: Interpretation) {
  if (!revelationsReady() || interpretation()) return false;
  storage.set("journey.kurtzInterpretation", value); return true;
}
/** Comprehension, not a timer, drives the cooler/darker composition. */
export const revelationsPressure = () => discoveries().length / 4;
export const revelationAtmosphere = createPixiStorageCheckpoint("journey.revelationAtmosphere",
  (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1);

import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { stationFlag } from "./innerStationState";
import { interpretation } from "./stationRevelationsState";
export type NightPhase = "inactive" | "dusk" | "search" | "trail" | "clearing" | "return" | "returned";
export type NightResponse = "reason" | "challenge";
export type NightPose = "collapsed" | "bracing" | "dominant" | "exhausted";
export type NightTrace = "grass" | "prints" | "branches";
export interface NightEscapeState {
  phase: NightPhase; duskMS: number; absence: boolean; traces: NightTrace[]; found: boolean;
  choice?: NightResponse; pose: NightPose; escort: Point; returnedSeen: boolean;
}
const traceOrder: NightTrace[] = ["grass", "prints", "branches"];
const finitePoint = (v: unknown): v is Point => !!v && typeof v === "object" && "x" in v && "y" in v &&
  typeof v.x === "number" && Number.isFinite(v.x) && v.x >= 370 && v.x <= 1650 &&
  typeof v.y === "number" && Number.isFinite(v.y) && v.y >= 680 && v.y <= 860;
const valid = (v: unknown): v is NightEscapeState => {
  if (!v || typeof v !== "object") return false;
  const s = v as NightEscapeState;
  return ["inactive", "dusk", "search", "trail", "clearing", "return", "returned"].includes(s.phase) &&
    Number.isFinite(s.duskMS) && s.duskMS >= 0 && s.duskMS <= 8000 && typeof s.absence === "boolean" &&
    Array.isArray(s.traces) && s.traces.length <= 3 && s.traces.every((id, i) => id === traceOrder[i]) &&
    typeof s.found === "boolean" && (s.choice === undefined || s.choice === "reason" || s.choice === "challenge") &&
    ["collapsed", "bracing", "dominant", "exhausted"].includes(s.pose) && finitePoint(s.escort) && typeof s.returnedSeen === "boolean";
};
export const nightCheckpoint = createPixiStorageCheckpoint<NightEscapeState>("journey.kurtzNightEscape", valid);
export const nightState = (): NightEscapeState => nightCheckpoint.read() ?? {
  phase: "inactive", duskMS: 0, absence: false, traces: [], found: false, pose: "collapsed",
  escort: { x: 1100, y: 800 }, returnedSeen: false,
};
const patch = (value: Partial<NightEscapeState>) => nightCheckpoint.write({ ...nightState(), ...value });
const progress = (key: string) => createPixiStorageCheckpoint<number>(key,
  (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1);
export const nightAtmosphere = progress("journey.kurtzNightAtmosphere");
export const nightForestBlend = progress("journey.kurtzNightForestBlend");
export const canBeginNight = () => stationFlag("stationRevelationsComplete") && !!interpretation() && nightState().phase === "inactive";
export function beginNight() {
  if (!canBeginNight()) return false;
  patch({ phase: "dusk" }); nightAtmosphere.write(0); nightForestBlend.write(0); return true;
}
export function updateNight(elapsedMS: number) {
  const s = nightState(); if (s.phase !== "dusk" || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
  patch({ duskMS: Math.min(8000, s.duskMS + Math.min(1000, elapsedMS)) });
  if (nightState().duskMS === 8000 && (nightAtmosphere.read() ?? 0) >= .99) patch({ phase: "search" });
}
export function observeAbsence() {
  if (nightState().phase !== "search") return false;
  patch({ absence: true, phase: "trail" }); return true;
}
export function followTrace(id: NightTrace) {
  const s = nightState(); if (s.phase !== "trail" || id !== traceOrder[s.traces.length]) return false;
  patch({ traces: [...s.traces, id] }); return true;
}
export function enterNightClearing() {
  if (nightState().phase !== "trail" || nightState().traces.length !== 3) return false;
  patch({ phase: "clearing" }); return true;
}
export function meetNightKurtz() {
  // Following the last clue permits the encounter; entry itself has no dialogue.
  if (nightState().phase === "trail") enterNightClearing();
  if (nightState().phase !== "clearing" || nightState().found) return false;
  patch({ found: true, pose: "bracing" }); return true;
}
export const setNightPose = (pose: NightPose) => patch({ pose });
export function chooseNightResponse(choice: NightResponse) {
  const s = nightState(); if (s.phase !== "clearing" || !s.found || s.choice) return false;
  patch({ choice, pose: choice === "reason" ? "bracing" : "dominant" }); return true;
}
export function beginNightReturn() {
  if (nightState().phase !== "clearing" || !nightState().choice) return false;
  patch({ phase: "return", pose: "exhausted" }); return true;
}
/** Story-specific assistance, not a new generic NPC/pathfinding system. */
export function updateNightEscort(player: Point, elapsedMS: number) {
  const s = nightState(); if (s.phase !== "return" || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
  const distance = Math.hypot(player.x - s.escort.x, player.y - s.escort.y);
  if (distance > 180 || distance < 35) return;
  const step = Math.min(distance - 35, 75 * Math.min(50, elapsedMS) / 1000);
  patch({ escort: { x: s.escort.x + (player.x - s.escort.x) * step / distance,
    y: s.escort.y + (player.y - s.escort.y) * step / distance } });
}
export function finishNightReturn() {
  const s = nightState(); if (s.phase !== "return" || Math.hypot(s.escort.x - 1640, s.escort.y - 800) > 100) return false;
  patch({ phase: "returned", pose: "exhausted" }); return true;
}
export const finishNightEpilogue = () => patch({ returnedSeen: true });

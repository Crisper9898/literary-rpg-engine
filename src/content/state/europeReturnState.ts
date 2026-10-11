import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
import { aftermathState } from "./kurtzAftermathState";

export type CompanyResponse = "private" | "commerce";
export interface EuropeState {
  phase: "inactive" | "returned" | "sorted" | "prepared" | "challenged" | "carrying" | "offered" | "resolved";
  streetObserved: boolean;
  reportRead: boolean;
  lettersRead: boolean;
  response?: CompanyResponse;
  exchangeSeen: boolean;
}
const initial = (): EuropeState => ({ phase: "inactive", streetObserved: false,
  reportRead: false, lettersRead: false, exchangeSeen: false });
const valid = (v: unknown): v is EuropeState => {
  if (!v || typeof v !== "object") return false;
  const s = v as EuropeState;
  if (!["inactive", "returned", "sorted", "prepared", "challenged", "carrying", "offered", "resolved"].includes(s.phase) ||
    ![s.streetObserved, s.reportRead, s.lettersRead, s.exchangeSeen].every(x => typeof x === "boolean") ||
    s.response !== undefined && s.response !== "private" && s.response !== "commerce") return false;
  if (s.phase === "inactive" && s.streetObserved) return false;
  if (["inactive", "returned"].includes(s.phase)) return !s.reportRead && !s.lettersRead && !s.response && !s.exchangeSeen;
  if (s.phase === "sorted") return !s.response && !s.exchangeSeen;
  if (!s.reportRead || !s.lettersRead) return false;
  if (s.phase === "prepared") return !s.response && !s.exchangeSeen;
  return !!s.response && (s.phase === "challenged" || s.exchangeSeen);
};
export const europeCheckpoint = createPixiStorageCheckpoint<EuropeState>("journey.europeReturn", valid);
export const europeState = () => europeCheckpoint.read() ?? initial();
const patch = (s: Partial<EuropeState>) => europeCheckpoint.write({ ...europeState(), ...s });
export const europePosition = createPixiStorageCheckpoint<Point>("journey.europePosition", (v): v is Point => {
  const p = v as Point | undefined;
  return !!p && Number.isFinite(p.x) && p.x >= 360 && p.x <= 1580 && Number.isFinite(p.y) && p.y >= 700 && p.y <= 870;
});
export const canBeginEurope = () => aftermathState().phase === "survived" && europeState().phase === "inactive";
export function beginEurope() { if (!canBeginEurope()) return false; patch({ phase: "returned" }); return true; }
export function observeStreet() {
  const s = europeState(); if (s.phase === "inactive" || s.streetObserved) return false;
  patch({ streetObserved: true }); return true;
}
export function openPacket() { if (europeState().phase !== "returned") return false; patch({ phase: "sorted" }); return true; }
export function readReport() {
  const s = europeState(); if (s.phase !== "sorted" || s.reportRead) return false;
  patch({ reportRead: true }); return true;
}
export function readLetters() {
  const s = europeState(); if (s.phase !== "sorted" || s.lettersRead) return false;
  patch({ lettersRead: true }); return true;
}
export function prepareReport() {
  const s = europeState(); if (s.phase !== "sorted" || !s.reportRead || !s.lettersRead) return false;
  patch({ phase: "prepared" }); return true;
}
export function chooseCompanyResponse(response: CompanyResponse) {
  if (europeState().phase !== "prepared") return false;
  patch({ phase: "challenged", response }); return true;
}
export function finishCompanyExchange() {
  if (europeState().phase === "challenged") patch({ exchangeSeen: true });
}
export function collectReport() {
  const s = europeState(); if (s.phase !== "challenged" || !s.exchangeSeen) return false;
  patch({ phase: "carrying" }); return true;
}
export function offerReport() { if (europeState().phase !== "carrying") return false; patch({ phase: "offered" }); return true; }
export function finishEurope() { if (europeState().phase !== "offered") return false; patch({ phase: "resolved" }); return true; }

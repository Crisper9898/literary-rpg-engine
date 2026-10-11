import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import { europeState } from "./europeReturnState";

export type CousinResponse = "music" | "witness";
export type JournalistResponse = "party" | "motive";
const phases = ["inactive", "cousin", "cousinAnswered", "familyReady", "familyCarrying",
  "journalist", "journalistAnswered", "reportReady", "reportCarrying", "remaining", "complete"] as const;
export interface LegacyState {
  phase: typeof phases[number];
  cousinResponse?: CousinResponse;
  journalistResponse?: JournalistResponse;
}
const initial = (): LegacyState => ({ phase: "inactive" });
const valid = (v: unknown): v is LegacyState => {
  if (!v || typeof v !== "object") return false;
  const s = v as LegacyState, index = phases.indexOf(s.phase);
  if (index < 0 || s.cousinResponse !== undefined && !["music", "witness"].includes(s.cousinResponse) ||
    s.journalistResponse !== undefined && !["party", "motive"].includes(s.journalistResponse)) return false;
  return (index < 2 ? s.cousinResponse === undefined : s.cousinResponse !== undefined) &&
    (index < 6 ? s.journalistResponse === undefined : s.journalistResponse !== undefined);
};
export const legacyCheckpoint = createPixiStorageCheckpoint<LegacyState>("journey.kurtzLegacy", valid);
export const legacyState = () => legacyCheckpoint.read() ?? initial();
const advance = (from: LegacyState["phase"], to: LegacyState["phase"], fields: Partial<LegacyState> = {}) => {
  const s = legacyState(); if (s.phase !== from) return false;
  legacyCheckpoint.write({ ...s, ...fields, phase: to }); return true;
};
export const canBeginLegacy = () => europeState().phase === "resolved" && legacyState().phase === "inactive";
export function beginLegacy() { return canBeginLegacy() && advance("inactive", "cousin"); }
export const chooseCousinResponse = (response: CousinResponse) => advance("cousin", "cousinAnswered", { cousinResponse: response });
export const finishCousinExchange = () => advance("cousinAnswered", "familyReady");
export const collectFamilyLetters = () => advance("familyReady", "familyCarrying");
export const deliverFamilyLetters = () => advance("familyCarrying", "journalist");
export const chooseJournalistResponse = (response: JournalistResponse) => advance("journalist", "journalistAnswered", { journalistResponse: response });
export const finishJournalistExchange = () => advance("journalistAnswered", "reportReady");
export const collectLegacyReport = () => advance("reportReady", "reportCarrying");
export const deliverLegacyReport = () => advance("reportCarrying", "remaining");
export const finishLegacy = () => advance("remaining", "complete");

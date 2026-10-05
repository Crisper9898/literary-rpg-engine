import { storage } from "@drincs/pixi-vn";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import { stationReady, stationFlag } from "./innerStationState";
export type KurtzPose = "weak" | "commanding" | "intense" | "coughing";
export type KurtzResponse = "listen" | "challenge";
export interface KurtzIntroduction { activated: boolean; elapsedMS: number }
const checkpoint = createPixiStorageCheckpoint<KurtzIntroduction>("journey.kurtzIntroduction", (v): v is KurtzIntroduction =>
  !!v && typeof v === "object" && "activated" in v && typeof v.activated === "boolean" && "elapsedMS" in v &&
  typeof v.elapsedMS === "number" && Number.isFinite(v.elapsedMS) && v.elapsedMS >= 0 && v.elapsedMS <= 52000);
export const kurtzIntroduction = (): KurtzIntroduction => checkpoint.read() ?? { activated: false, elapsedMS: 0 };
export function beginKurtzIntroduction() {
  if (!stationReady() || !stationFlag("kurtzEncounterPrepared") || kurtzIntroduction().activated) return false;
  checkpoint.write({ activated: true, elapsedMS: 0 }); return true;
}
export function updateKurtzIntroduction(elapsedMS: number) {
  const state = kurtzIntroduction();
  if (!state.activated || state.elapsedMS >= 52000 || !Number.isFinite(elapsedMS) || elapsedMS <= 0) return;
  checkpoint.write({ activated: true, elapsedMS: Math.min(52000, state.elapsedMS + Math.min(1000, elapsedMS)) });
}
export const kurtzStage = () => {
  const { activated, elapsedMS: t } = kurtzIntroduction();
  return !activated ? "waiting" : t < 32000 ? "anticipation" : t < 38000 ? "silhouette" :
    t < 44000 ? "partial" : t < 48000 ? "authority" : t < 52000 ? "coughing" : "present";
};
export const kurtzFirstResponse = () => storage.get<KurtzResponse>("journey.kurtzFirstResponse");
export function chooseKurtzResponse(response: KurtzResponse) {
  if (kurtzStage() !== "present" || kurtzFirstResponse()) return false;
  storage.set("journey.kurtzFirstResponse", response);
  setKurtzPose(response === "listen" ? "intense" : "commanding"); return true;
}
export const setKurtzPose = (pose: KurtzPose) => storage.set("journey.kurtzPose", pose);
export const kurtzPose = (): KurtzPose => {
  const stage = kurtzStage();
  return stage === "authority" ? "commanding" : stage === "coughing" ? "coughing" :
    stage === "present" ? storage.get<KurtzPose>("journey.kurtzPose") ?? "weak" : "weak";
};
/** Position and silhouette are reconstructed from saved progression, not a second save format. */
export function kurtzPosition() {
  const t = kurtzIntroduction().elapsedMS;
  const amount = Math.max(0, Math.min(1, (t - 32000) / 12000));
  return { x: 1580 - amount * 265, y: 725 + amount * 55 };
}
export const kurtzObserved = () => storage.get<string[]>("journey.kurtzObserved") ?? [];
export function observeKurtz(id: string) {
  if (!kurtzObserved().includes(id)) storage.set("journey.kurtzObserved", [...kurtzObserved(), id]);
}

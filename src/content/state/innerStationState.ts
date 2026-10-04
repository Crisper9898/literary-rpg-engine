import { storage } from "@drincs/pixi-vn";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";
export type StationObservation = "planks" | "fence" | "grass" | "house";
export type RussianTopic = "kurtz" | "station" | "attack" | "relation";
export type RussianStance = "listen" | "question";
const progress = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 1;
const point = (v: unknown): v is Point => !!v && typeof v === "object" && "x" in v && "y" in v &&
  typeof v.x === "number" && Number.isFinite(v.x) && typeof v.y === "number" && Number.isFinite(v.y);
export const dockingProgress = createPixiStorageCheckpoint("journey.dockProgress", progress);
export const dockingPosition = createPixiStorageCheckpoint("journey.dockPosition", point);
export const stationPosition = createPixiStorageCheckpoint("journey.stationPosition", point);
export const stationAtmosphere = createPixiStorageCheckpoint("journey.stationAtmosphere", progress);
export const stationFlag = (id: string) => storage.get<boolean>(`journey.${id}`) === true;
export const markStation = (id: string) => storage.set(`journey.${id}`, true);
export const stationObservations = () => storage.get<StationObservation[]>("journey.stationObserved") ?? [];
export function observeStation(id: StationObservation) {
  if (!stationObservations().includes(id)) storage.set("journey.stationObserved", [...stationObservations(), id]);
  if (id === "house") markStation("kurtzPresenceForeshadowed");
}
export const canMeetRussian = () => stationObservations().length >= 2;
export const russianTopics = () => storage.get<RussianTopic[]>("journey.russianTopics") ?? [];
export function rememberTopic(id: RussianTopic) {
  if (!russianTopics().includes(id)) storage.set("journey.russianTopics", [...russianTopics(), id]);
  if (id === "kurtz") markStation("kurtzPresenceForeshadowed");
}
export const russianStance = () => storage.get<RussianStance>("journey.russianStance");
export const setRussianStance = (stance: RussianStance) => storage.set("journey.russianStance", stance);
export const completeRussianConversation = () => markStation("russianComplete");
export const stationReady = () => stationFlag("russianComplete") && !!russianStance();
export const russianMood = () => storage.get<string>("journey.russianMood") ?? "eager";
export const setRussianMood = (value: "eager" | "nervous" | "fervent") => storage.set("journey.russianMood", value);
export const stationEvent = () => storage.get<{ occurred: boolean; remainingMS: number }>("journey.stationEvent") ??
  { occurred: false, remainingMS: 0 };
export function startStationEvent() {
  if (!stationEvent().occurred) storage.set("journey.stationEvent", { occurred: true, remainingMS: 2400 });
}
export function updateStationEvent(elapsedMS: number) {
  const event = stationEvent();
  if (event.remainingMS > 0 && Number.isFinite(elapsedMS) && elapsedMS > 0)
    storage.set("journey.stationEvent", { ...event, remainingMS: Math.max(0, event.remainingMS - Math.min(100, elapsedMS)) });
}
export const stationPressure = () => Math.min(1, .2 + stationObservations().length * .1 + russianTopics().length * .07);

import { storage } from "@drincs/pixi-vn";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";
import type { Point } from "../../engine/movement/MovementController";

export type ApproachDecision = "wait" | "proceed";
export const currentJourneySpace = () => {
  const value = storage.get<string>("journey.currentSpace");
  return value === "wood-stop" || value === "approach" ? value : "deck";
};
export const setJourneySpace = (space: "deck" | "wood-stop" | "approach") => storage.set("journey.currentSpace", space);
export const deckConversationCompleted = () => storage.get<boolean>("journey.deckConversationCompleted") === true;
export const completeDeckConversation = () => storage.set("journey.deckConversationCompleted", true);
export const woodLoaded = () => storage.get<boolean>("journey.woodLoaded") === true;
export const loadWood = () => storage.set("journey.woodLoaded", true);
export const warningRead = () => storage.get<boolean>("journey.warningRead") === true;
export const readWarning = () => storage.set("journey.warningRead", true);
export const seamanshipBookRead = () => storage.get<boolean>("journey.seamanshipBookRead") === true;
export const readSeamanshipBook = () => storage.set("journey.seamanshipBookRead", true);
export const approachDecision = (): ApproachDecision | undefined => {
  const value = storage.get<string>("journey.approachDecision");
  return value === "wait" || value === "proceed" ? value : undefined;
};
export const decideApproach = (value: ApproachDecision) => storage.set("journey.approachDecision", value);
export const leaveWoodStop = () => storage.set("journey.woodStopDeparted", true);
export const woodStopDeparted = () => storage.get<boolean>("journey.woodStopDeparted") === true;
export const woodStopPosition = createPixiStorageCheckpoint<Point>("journey.woodStopPosition",
  (value): value is Point => !!value && typeof value === "object" && "x" in value && "y" in value &&
    typeof value.x === "number" && Number.isFinite(value.x) && typeof value.y === "number" && Number.isFinite(value.y));
export const woodStopAtmosphere = createPixiStorageCheckpoint<number>("journey.woodStopAtmosphere",
  (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1);
export const woodStopProgress = () => .55 + (woodLoaded() ? .12 : 0) +
  (warningRead() ? .12 : 0) + (seamanshipBookRead() ? .06 : 0) + (approachDecision() ? .15 : 0);

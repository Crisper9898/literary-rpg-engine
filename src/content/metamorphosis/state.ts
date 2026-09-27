import { storage } from "@drincs/pixi-vn";
import type { Point } from "../../engine/movement/MovementController";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";

const POSITION = "metamorphosis.gregorPosition";
const WINDOW_SEEN = "metamorphosis.windowSeen";
const DOOR_HEARD = "metamorphosis.doorHeard";
const GRETE_RESPONSE = "metamorphosis.greteResponse";
export type GreteResponse = "stay" | "leave";
const isPoint = (value: unknown): value is Point => value !== null && typeof value === "object" &&
  "x" in value && "y" in value && typeof value.x === "number" && Number.isFinite(value.x) &&
  typeof value.y === "number" && Number.isFinite(value.y);

export const gregorPosition = createPixiStorageCheckpoint(POSITION, isPoint);
export const hasSeenWindow = () => storage.get<boolean>(WINDOW_SEEN) === true;
export const hasHeardDoor = () => storage.get<boolean>(DOOR_HEARD) === true;
export const markWindowSeen = () => storage.set(WINDOW_SEEN, true);
export const markDoorHeard = () => storage.set(DOOR_HEARD, true);
export const greteResponse = (): GreteResponse | undefined => {
  const value = storage.get<string>(GRETE_RESPONSE);
  return value === "stay" || value === "leave" ? value : undefined;
};
export const setGreteResponse = (response: GreteResponse) => storage.set(GRETE_RESPONSE, response);

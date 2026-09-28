import { storage } from "@drincs/pixi-vn";
import type { Point } from "../../engine/movement/MovementController";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";

const POSITION = "metamorphosis.gregorPosition";
const WINDOW_SEEN = "metamorphosis.windowSeen";
const DOOR_HEARD = "metamorphosis.doorHeard";
const GRETE_RESPONSE = "metamorphosis.greteResponse";
const FAMILY_ACTIVITY_HEARD = "metamorphosis.familyActivityHeard";
const FAMILY_RESPONSE = "metamorphosis.familyResponse";
const CLERK_ARRIVAL_HEARD = "metamorphosis.clerkArrivalHeard";
const CLERK_RESPONSE = "metamorphosis.clerkResponse";
const CURRENT_SPACE = "metamorphosis.currentSpace";
const GRETE_SAW_GREGOR = "metamorphosis.greteSawGregor";
const GRETE_REACTED = "metamorphosis.greteReacted";
const GRETE_LEFT = "metamorphosis.greteLeft";
const CLERK_SAW_GREGOR = "metamorphosis.clerkSawGregor";
const CLERK_LEAVING = "metamorphosis.clerkLeaving";
const CLERK_LEFT = "metamorphosis.clerkLeft";
export type GreteResponse = "stay" | "leave";
export type FamilyResponse = "answered" | "silent";
export type ClerkResponse = "explain" | "silent";
export type MetamorphosisSpace = "room" | "hallway";
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
export const hasHeardFamilyActivity = () => storage.get<boolean>(FAMILY_ACTIVITY_HEARD) === true;
export const markFamilyActivityHeard = () => storage.set(FAMILY_ACTIVITY_HEARD, true);
export const familyResponse = (): FamilyResponse | undefined => {
  const value = storage.get<string>(FAMILY_RESPONSE);
  return value === "answered" || value === "silent" ? value : undefined;
};
export const setFamilyResponse = (response: FamilyResponse) => storage.set(FAMILY_RESPONSE, response);
export const hasHeardClerkArrival = () => storage.get<boolean>(CLERK_ARRIVAL_HEARD) === true;
export const markClerkArrivalHeard = () => storage.set(CLERK_ARRIVAL_HEARD, true);
export const clerkResponse = (): ClerkResponse | undefined => {
  const value = storage.get<string>(CLERK_RESPONSE);
  return value === "explain" || value === "silent" ? value : undefined;
};
export const setClerkResponse = (response: ClerkResponse) => storage.set(CLERK_RESPONSE, response);
export const currentSpace = (): MetamorphosisSpace =>
  storage.get<string>(CURRENT_SPACE) === "hallway" ? "hallway" : "room";
export const setCurrentSpace = (space: MetamorphosisSpace) => storage.set(CURRENT_SPACE, space);
export const hasGreteSeenGregor = () => storage.get<boolean>(GRETE_SAW_GREGOR) === true;
export const markGreteSawGregor = () => storage.set(GRETE_SAW_GREGOR, true);
export const hasGreteReacted = () => storage.get<boolean>(GRETE_REACTED) === true;
export const markGreteReacted = () => storage.set(GRETE_REACTED, true);
export const hasGreteLeft = () => storage.get<boolean>(GRETE_LEFT) === true;
export const markGreteLeft = () => storage.set(GRETE_LEFT, true);
export const hasClerkSeenGregor = () => storage.get<boolean>(CLERK_SAW_GREGOR) === true;
export const markClerkSawGregor = () => storage.set(CLERK_SAW_GREGOR, true);
export const hasClerkLeaving = () => storage.get<boolean>(CLERK_LEAVING) === true;
export const markClerkLeaving = () => storage.set(CLERK_LEAVING, true);
export const hasClerkLeft = () => storage.get<boolean>(CLERK_LEFT) === true;
export const markClerkLeft = () => storage.set(CLERK_LEFT, true);

import { storage } from "@drincs/pixi-vn";
import type { Point } from "../../engine/movement/MovementController";
import { createPixiStorageCheckpoint } from "../../engine/world/createPixiStorageCheckpoint";

const CARGO_MARK_KEY = "journey.cargoMarkInspected";
const PLAYER_POSITION_KEY = "journey.playerPosition";
const VOYAGE_DISTANCE_KEY = "journey.voyageDistance";
const ATMOSPHERE_PROGRESS_KEY = "journey.atmosphereProgress";

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const isPoint = (value: unknown): value is Point => value !== null && typeof value === "object" &&
  "x" in value && "y" in value && isFiniteNumber(value.x) && isFiniteNumber(value.y);

export const journeyPlayerPosition = createPixiStorageCheckpoint(PLAYER_POSITION_KEY, isPoint);
export const journeyVoyageDistance = createPixiStorageCheckpoint(VOYAGE_DISTANCE_KEY, isFiniteNumber);
export const journeyAtmosphereProgress = createPixiStorageCheckpoint(ATMOSPHERE_PROGRESS_KEY, isFiniteNumber);

export function hasInspectedCargoMark(): boolean {
  return storage.get<boolean>(CARGO_MARK_KEY) === true;
}

export function inspectCargoMark(): void {
  storage.set(CARGO_MARK_KEY, true);
}

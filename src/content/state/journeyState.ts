import { storage } from "@drincs/pixi-vn";
import type { Point } from "../../engine/movement/MovementController";
import type { CheckpointChannel } from "../../engine/world/CheckpointChannel";

const CARGO_MARK_KEY = "journey.cargoMarkInspected";
const PLAYER_POSITION_KEY = "journey.playerPosition";
const VOYAGE_DISTANCE_KEY = "journey.voyageDistance";
const ATMOSPHERE_PROGRESS_KEY = "journey.atmosphereProgress";

export const journeyPlayerPosition: CheckpointChannel<Point> = {
  read: () => {
    const value = storage.get<Point>(PLAYER_POSITION_KEY);
    return value && Number.isFinite(value.x) && Number.isFinite(value.y) ? value : undefined;
  },
  write: (value) => storage.set(PLAYER_POSITION_KEY, { x: value.x, y: value.y }),
};

function numberCheckpoint(key: string): CheckpointChannel<number> {
  return {
    read: () => {
      const value = storage.get<number>(key);
      return typeof value === "number" && Number.isFinite(value) ? value : undefined;
    },
    write: (value) => storage.set(key, value),
  };
}

export const journeyVoyageDistance = numberCheckpoint(VOYAGE_DISTANCE_KEY);
export const journeyAtmosphereProgress = numberCheckpoint(ATMOSPHERE_PROGRESS_KEY);

export function hasInspectedCargoMark(): boolean {
  return storage.get<boolean>(CARGO_MARK_KEY) === true;
}

export function inspectCargoMark(): void {
  storage.set(CARGO_MARK_KEY, true);
}

import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { cargoMark } from "../../story/heart-of-darkness/cargoMark";
import { hasInspectedCargoMark, inspectCargoMark } from "../state/journeyState";

/** One optional world action; its outcome belongs to Pixi'VN storage. */
export function createJourneyCargoInspection(): SpatialAction {
  return {
    id: "inspect-cargo-tally",
    prompt: cargoMark.prompt,
    target: () => cargoMark.position,
    range: cargoMark.reach,
    priority: 10,
    enabled: () => !hasInspectedCargoMark(),
    execute: inspectCargoMark,
  };
}

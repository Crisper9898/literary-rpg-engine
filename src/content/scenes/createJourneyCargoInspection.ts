import type { Container } from "pixi.js";
import { cargoMark } from "../../story/heart-of-darkness/cargoMark";
import { hasInspectedCargoMark, inspectCargoMark } from "../state/journeyState";

/** One optional world action; its outcome belongs to Pixi'VN storage. */
export function createJourneyCargoInspection(player: Container) {
  return {
    prompt: cargoMark.prompt,
    available() {
      return !hasInspectedCargoMark() &&
        Math.hypot(player.x - cargoMark.position.x, player.y - cargoMark.position.y) <= cargoMark.reach;
    },
    inspect: inspectCargoMark,
  };
}

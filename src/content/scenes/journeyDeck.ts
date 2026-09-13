import { canvas } from "@drincs/pixi-vn";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";

const DECK_LAYER = "journey-deck";

/** Rebuild transient scenery on label entry; Pixi'VN remains the canvas owner. */
export function showJourneyDeck(): void {
  const previous = canvas.layers.get(DECK_LAYER);
  if (previous) {
    canvas.layers.remove(DECK_LAYER);
    previous.destroy({ children: true });
  }
  canvas.layers.add(DECK_LAYER, createJourneyDeck());
}

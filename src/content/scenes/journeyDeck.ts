import { canvas } from "@drincs/pixi-vn";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";

const DECK_LAYER = "journey-deck";

/** Rebuild transient scenery on label entry; Pixi'VN remains the canvas owner. */
export function showJourneyDeck(): void {
  const previous = canvas.layers.get(DECK_LAYER);
  if (previous) {
    canvas.layers.remove(DECK_LAYER);
    previous.destroy({ children: true });
  }
  const { presentation, player } = createJourneyDeck();
  canvas.layers.add(DECK_LAYER, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Heart of Darkness: mueve a Marlow con WASD o las flechas");
  attachPlayerMovement(player, canvas.app.ticker, surface, {
    position: journeyDeck.anchors.playerSpawn,
    bounds: journeyDeck.walkableArea,
    ...marlowMovement,
  });
  surface.focus({ preventScroll: true });
}

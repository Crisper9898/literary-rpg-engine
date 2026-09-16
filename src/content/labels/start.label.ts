import { narration, newLabel } from "@drincs/pixi-vn";
import { showJourneyDeck } from "../scenes/journeyDeck";

export const startLabel = newLabel("start", [
  () => {
    showJourneyDeck();
    narration.dialogue = undefined;
  },
  () => { narration.dialogue = undefined; },
]);

import { narration, newLabel } from "@drincs/pixi-vn";
import { journeySlice } from "../../story/heart-of-darkness/journey";
import { showJourneyDeck } from "../scenes/journeyDeck";

export const startLabel = newLabel("start", [
  () => {
    showJourneyDeck();
    narration.dialogue = `${journeySlice.title} — La cubierta.`;
  },
]);

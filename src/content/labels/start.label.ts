import { narration, newLabel } from "@drincs/pixi-vn";
import { journeySlice } from "../../story/heart-of-darkness/journey";

export const startLabel = newLabel("start", [
  () => {
    narration.dialogue = `${journeySlice.title} — foundation ready.`;
  },
]);

import { narration, newChoiceOption, newLabel } from "@drincs/pixi-vn";
import { deckConversation as lines } from "../../story/heart-of-darkness/conversation";
import { journeyDeckhand, marlow } from "../characters";

export const journeyRiverAnswer = newLabel("journey-talk-river", [
  () => { narration.dialogue = { character: marlow, text: lines.riverQuestion }; },
  () => { narration.dialogue = { character: journeyDeckhand, text: lines.riverAnswer }; },
]);

export const journeyCargoAnswer = newLabel("journey-talk-cargo", [
  () => { narration.dialogue = { character: marlow, text: lines.cargoQuestion }; },
  () => { narration.dialogue = { character: journeyDeckhand, text: lines.cargoAnswer }; },
]);

export const journeyConversation = newLabel("journey-talk", [
  () => { narration.dialogue = { character: journeyDeckhand, text: lines.greeting }; },
  () => { narration.dialogue = { character: marlow, text: lines.marlow }; },
  () => {
    narration.dialogue = { character: journeyDeckhand, text: lines.question };
    narration.choices = [
      newChoiceOption(lines.choices[0], journeyRiverAnswer, {}),
      newChoiceOption(lines.choices[1], journeyCargoAnswer, {}),
    ];
  },
  () => { narration.dialogue = { character: journeyDeckhand, text: lines.farewell }; },
  () => {
    narration.dialogue = undefined;
    narration.choices = undefined;
    // Return to the still-mounted deck without advancing/rebuilding its start step.
    narration.labels.closeCurrent();
  },
]);

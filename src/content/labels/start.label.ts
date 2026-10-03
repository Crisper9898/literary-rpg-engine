import { canvas, narration, newLabel } from "@drincs/pixi-vn";

export const startLabel = newLabel("start", [
  async () => {
    // Stop the old world writing checkpoints before yielding for scene code.
    // Game.start has reset storage; a live old ticker must not populate it again.
    const previous = canvas.layers.get("journey-deck");
    if (previous) { canvas.layers.remove("journey-deck"); previous.destroy({ children: true }); }
    const { showJourneyDeck } = await import("../scenes/journeyDeck");
    showJourneyDeck();
    narration.dialogue = undefined;
  },
  () => { narration.dialogue = undefined; },
]);

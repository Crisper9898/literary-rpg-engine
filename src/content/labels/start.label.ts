import { canvas, narration, newLabel } from "@drincs/pixi-vn";

export const startLabel = newLabel("start", [
  async () => {
    // Stop the old world writing checkpoints before yielding for scene code.
    // Game.start has reset storage; a live old ticker must not populate it again.
    for (const id of ["journey-deck", "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
      const previous = canvas.layers.get(id);
      if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
    }
    const { showJourneySpace } = await import("../scenes/journeyDeck");
    await showJourneySpace();
    narration.dialogue = undefined;
  },
  () => { narration.dialogue = undefined; },
]);

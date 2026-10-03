import { NavigationController } from "../../puzzles/riverApproach/NavigationController";
import { approachCheckpoint, helmsmanFate, loseHelmsman, setApproachHelm } from "../state/approachState";

/** Simulation boundary shared by the ticker and deterministic replay. */
export function updateRiverApproach(controller: NavigationController,
  input: Parameters<NavigationController["update"]>[0], elapsedMS: number) {
  const saved = approachCheckpoint.read();
  if (saved) controller.restore(saved);
  controller.update(input, elapsedMS);
  if (controller.state.progress >= .65 && helmsmanFate() === "alive") {
    loseHelmsman(); controller.interrupt(2400); setApproachHelm(false);
  }
  approachCheckpoint.write({ ...controller.state, contacts: [...controller.state.contacts] });
  return controller.state;
}

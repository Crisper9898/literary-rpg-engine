import type { Container, Ticker } from "pixi.js";
import { NpcRoutineController, type NpcRoutineOptions, type NpcRoutineState } from "./NpcRoutineController";

/** Uses the existing world ticker; removing an actor removes its simulation too. */
export function attachNpcRoutine(actor: Container, ticker: Ticker, options: NpcRoutineOptions,
  pose?: (state: NpcRoutineState, elapsedMS: number) => void): NpcRoutineController {
  const npc = new NpcRoutineController(options);
  const apply = (state: NpcRoutineState, elapsedMS: number) => {
    actor.position.set(state.position.x, state.position.y);
    pose?.(state, elapsedMS);
  };
  const update = (frame: Ticker) => apply(npc.update(frame.deltaMS), Math.min(frame.deltaMS, 50));
  apply(npc.state, 0);
  ticker.add(update);
  actor.once("destroyed", () => ticker.remove(update));
  return npc;
}

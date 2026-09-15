import type { NpcRoutineOptions } from "../../engine/npc/NpcRoutineController";
import { journeyDeck } from "./deck";

export const deckhandIdentity = { id: "journey-deckhand", name: "Marinero", color: "#a0bdb2" } as const;

/** A deckhand secures a rope, checks cargo and surveys the river before returning. */
export const deckhandRoutine = {
  position: journeyDeck.anchors.npcStation,
  bounds: journeyDeck.walkableArea,
  speed: 95,
  footprintRadius: 20,
  stops: [
    { position: journeyDeck.anchors.npcStation, idleMS: 2600, facing: { x: 0, y: 1 }, activity: "coil-rope" },
    { position: { x: 1420, y: 690 }, idleMS: 2400, facing: { x: 0, y: -1 }, activity: "check-cargo" },
    { position: { x: 1260, y: 815 }, idleMS: 1700, facing: { x: 1, y: 0.3 }, activity: "lookout" },
  ],
} as const satisfies NpcRoutineOptions;

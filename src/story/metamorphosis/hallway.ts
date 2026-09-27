import type { WorldLayout } from "../../engine/world/worldLayout";
import type { Point } from "../../engine/movement/MovementController";
import type { NpcRoutineOptions } from "../../engine/npc/NpcRoutineController";

export const metamorphosisHallway = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 260, y: 420, width: 1400, height: 460 },
  anchors: {
    roomDoor: { x: 370, y: 680 },
    picture: { x: 1280, y: 650 },
    arrival: { x: 560, y: 700 },
    grete: { x: 760, y: 690 },
    clerk: { x: 1070, y: 700 },
  },
} as const satisfies WorldLayout;

export const hallwayInteractionRange = 145;
export const hallwayNpcRange = 105;
export const hallwayReactionRange = 145;
export const hallwayReactionStep = 42;
export const clerkExit = { x: 1560, y: 700 } as const;

/** One authored destination; the scene removes the actor on first arrival. */
export const clerkDeparture = (position: Point): NpcRoutineOptions => ({
  position, bounds: metamorphosisHallway.walkableArea,
  speed: 115, footprintRadius: 20,
  stops: [{ position: clerkExit, idleMS: 1000, activity: "leave-building" }],
});

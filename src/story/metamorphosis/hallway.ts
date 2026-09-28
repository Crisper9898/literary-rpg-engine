import type { WorldLayout } from "../../engine/world/worldLayout";
import type { Point } from "../../engine/movement/MovementController";
import type { NpcRoutineOptions } from "../../engine/npc/NpcRoutineController";

export const fatherIdentity = { id: "gregor-father", name: "Padre de Gregor", color: "#d0b7ae" } as const;

export const metamorphosisHallway = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 260, y: 420, width: 1400, height: 460 },
  anchors: {
    roomDoor: { x: 370, y: 680 },
    picture: { x: 1280, y: 650 },
    arrival: { x: 560, y: 700 },
    grete: { x: 760, y: 690 },
    clerk: { x: 1070, y: 700 },
    fatherTrigger: { x: 1230, y: 730 },
    fatherEntry: { x: 1560, y: 760 },
    fatherStop: { x: 1380, y: 760 },
  },
} as const satisfies WorldLayout;

export const hallwayInteractionRange = 145;
export const hallwayNpcRange = 105;
export const hallwayReactionRange = 145;
export const hallwayReactionStep = 42;
export const fatherArrivalRange = 120;
export const clerkExit = { x: 1560, y: 700 } as const;
export const greteExit = { x: 1560, y: 760 } as const;
export const greteRetreatTarget = (askedToLeave: boolean, familyAnswered: boolean): Point =>
  askedToLeave ? greteExit : familyAnswered ? { x: 920, y: 760 } : { x: 970, y: 800 };

/** A brief retreat precedes departure; a sister who stays waits at her new spot. */
export const greteRetreat = (position: Point, askedToLeave: boolean,
  familyAnswered: boolean): NpcRoutineOptions => ({
  position, bounds: metamorphosisHallway.walkableArea,
  speed: askedToLeave ? 115 : 45, footprintRadius: 20,
  stops: askedToLeave ? [
    { position: familyAnswered ? { x: 950, y: 860 } : { x: 900, y: 860 },
      idleMS: 350, activity: "step-back" },
    { position: { x: 1400, y: 860 }, idleMS: 350, activity: "pass-behind" },
    { position: greteExit, idleMS: 1000, activity: "leave-hallway" },
  ] : [{ position: greteRetreatTarget(false, familyAnswered),
    idleMS: 1000, activity: "keep-distance" }],
});

/** One authored destination; the scene removes the actor on first arrival. */
export const clerkDeparture = (position: Point): NpcRoutineOptions => ({
  position, bounds: metamorphosisHallway.walkableArea,
  speed: 115, footprintRadius: 20,
  stops: [{ position: clerkExit, idleMS: 1000, activity: "leave-building" }],
});

/** The father approaches from the far doorway and remains at one authored stop. */
export const fatherArrival = (): NpcRoutineOptions => ({
  position: metamorphosisHallway.anchors.fatherEntry,
  bounds: metamorphosisHallway.walkableArea,
  speed: 90, footprintRadius: 20,
  stops: [{ position: metamorphosisHallway.anchors.fatherStop,
    idleMS: 1000, activity: "watch-gregor" }],
});

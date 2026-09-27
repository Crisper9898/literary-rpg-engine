import type { WorldLayout } from "../../engine/world/worldLayout";

export const metamorphosisHallway = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 260, y: 420, width: 1400, height: 460 },
  anchors: {
    roomDoor: { x: 370, y: 680 },
    picture: { x: 1280, y: 650 },
    arrival: { x: 560, y: 700 },
  },
} as const satisfies WorldLayout;

export const hallwayInteractionRange = 145;

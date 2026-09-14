import type { WorldLayout } from "../../engine/world/worldLayout";

export const journeyDeck = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 400, y: 660, width: 1120, height: 200 },
  anchors: {
    playerSpawn: { x: 650, y: 760 },
    npcStation: { x: 1300, y: 710 },
    cameraFocus: { x: 960, y: 760 },
  },
} as const satisfies WorldLayout;

// Collision footprint around the feet, independent of portrait/sprite artwork.
export const marlowMovement = { speed: 240, footprintRadius: 20 } as const;

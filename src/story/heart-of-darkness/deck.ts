import type { WorldLayout } from "../../engine/world/worldLayout";

export const journeyDeck = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 400, y: 660, width: 1120, height: 200 },
  anchors: {
    playerSpawn: { x: 650, y: 760 },
    npcStation: { x: 1080, y: 740 },
    cameraFocus: { x: 960, y: 760 },
  },
} as const satisfies WorldLayout;

// Collision footprint around the feet, independent of portrait/sprite artwork.
export const marlowMovement = { speed: 240, footprintRadius: 20 } as const;

// Keep the feet in the lower half of the frame and leave room for the river.
export const journeyCamera = { zoom: 1.5, smoothing: 6, offset: { x: 0, y: -160 } } as const;

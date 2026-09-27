import type { WorldLayout } from "../../engine/world/worldLayout";

export const metamorphosisRoom = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 260, y: 430, width: 1400, height: 440 },
  anchors: {
    gregorSpawn: { x: 960, y: 730 },
    window: { x: 440, y: 630 },
    door: { x: 1480, y: 650 },
  },
} as const satisfies WorldLayout;

export const gregorMovement = { speed: 230, footprintRadius: 22 } as const;
export const roomCamera = { zoom: 1.2, smoothing: 6 } as const;
export const roomInteractionRange = 150;
export const familyActivityRange = 185;
export const gregorIdentity = { id: "gregor-samsa", name: "Gregor Samsa", color: "#e2d4bb" } as const;
export const greteIdentity = { id: "grete-samsa", name: "Grete Samsa", color: "#d8bd9b" } as const;

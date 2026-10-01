import type { VisualSource } from "../../ui/visualAssetSlot";

/** Only these story-owned entries need new URLs when coordinated art is approved. */
export const journeyArtAssets = {
  skyWater: { width: 1920, height: 1080 },
  distantRidge: { width: 1920, height: 1080 },
  farVegetation: { width: 1920, height: 1080 },
  nearBank: { width: 1920, height: 1080 },
  riverCurrent: { width: 1920, height: 1080,
    clip: { x: 0, y: 500, width: 1920, height: 580 } },
  foregroundReeds: { width: 1920, height: 1080 },
  deckBase: { width: 1920, height: 1080 },
  deckFittings: { width: 1920, height: 1080 },
  cargo: { width: 1920, height: 1080 },
  marlowSheet: {
    width: 160, height: 160,
    frames: {
      idle: { x: 0, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkA: { x: 160, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkB: { x: 320, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
    },
  },
  deckhandSheet: {
    width: 160, height: 160,
    frames: {
      idle: { x: 0, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkA: { x: 160, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkB: { x: 320, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      coilA: { x: 480, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      coilB: { x: 640, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      cargo: { x: 800, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      lookout: { x: 960, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
    },
  },
} satisfies Record<string, VisualSource>;

export type JourneyArtAsset = keyof typeof journeyArtAssets;

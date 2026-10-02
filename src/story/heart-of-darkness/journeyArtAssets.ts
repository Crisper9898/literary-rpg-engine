import type { VisualSource } from "../../ui/visualAssetSlot";

/** Independent illustrated plates; SVGs remain the frozen composition reference. */
export const journeyArtAssets = {
  skyWater: { url: "/assets/art/journey-deck/illustrated/journey-sky-water.webp", width: 1920, height: 1080 },
  distantRidge: { url: "/assets/art/journey-deck/illustrated/journey-distant-ridge.webp", width: 1920, height: 245, y: 280 },
  farVegetation: { url: "/assets/art/journey-deck/illustrated/journey-far-vegetation.webp", width: 1920, height: 320, y: 215 },
  nearBank: { url: "/assets/art/journey-deck/illustrated/journey-near-bank.webp", width: 1920, height: 165, y: 395 },
  riverCurrent: { url: "/assets/art/journey-deck/illustrated/journey-river-current.webp", width: 1920, height: 500, y: 520 },
  foregroundReeds: { url: "/assets/art/journey-deck/illustrated/journey-foreground-reeds.webp", width: 1920, height: 190, y: 890 },
  deckBase: { url: "/assets/art/journey-deck/illustrated/journey-deck-base.webp", width: 1550, height: 580, x: 205, y: 410 },
  deckFittings: { url: "/assets/art/journey-deck/illustrated/journey-deck-fittings.webp", width: 1400, height: 410, x: 255, y: 540 },
  cargo: { url: "/assets/art/journey-deck/illustrated/journey-cargo.webp", width: 1110, height: 170, x: 420, y: 540 },
  marlowSheet: {
    url: "/assets/art/journey-deck/illustrated/marlow-sheet.webp",
    width: 160, height: 160,
    frames: {
      idle: { x: 0, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkA: { x: 160, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkB: { x: 320, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      concern: { x: 480, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      alarm: { x: 640, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
    },
  },
  deckhandSheet: {
    url: "/assets/art/journey-deck/illustrated/deckhand-sheet.webp",
    width: 160, height: 160,
    frames: {
      idle: { x: 0, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkA: { x: 160, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkB: { x: 320, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      coilA: { x: 480, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      coilB: { x: 640, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      cargo: { x: 800, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      lookout: { x: 960, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      concern: { x: 1120, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      alarm: { x: 1280, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
    },
  },
} satisfies Record<string, VisualSource>;

export type JourneyArtAsset = keyof typeof journeyArtAssets;

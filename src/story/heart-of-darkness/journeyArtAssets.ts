import type { VisualSource } from "../../ui/visualAssetSlot";

/** Authored SVG plates; each URL remains independently replaceable in content. */
export const journeyArtAssets = {
  skyWater: { url: "/assets/art/journey-deck/journey-sky-water.svg", width: 1920, height: 1080 },
  distantRidge: { url: "/assets/art/journey-deck/journey-distant-ridge.svg", width: 1920, height: 150, y: 340 },
  farVegetation: { url: "/assets/art/journey-deck/journey-far-vegetation.svg", width: 1920, height: 155, y: 355 },
  nearBank: { url: "/assets/art/journey-deck/journey-near-bank.svg", width: 1920, height: 105, y: 425 },
  // Marks are already confined to the water in the SVG, avoiding a large tile mask.
  riverCurrent: { url: "/assets/art/journey-deck/journey-river-current.svg", width: 1920, height: 565, y: 510 },
  foregroundReeds: { url: "/assets/art/journey-deck/journey-foreground-reeds.svg", width: 1920, height: 190, y: 890 },
  deckBase: { url: "/assets/art/journey-deck/journey-deck-base.svg", width: 1550, height: 480, x: 205, y: 470 },
  deckFittings: { url: "/assets/art/journey-deck/journey-deck-fittings.svg", width: 1400, height: 410, x: 255, y: 540 },
  cargo: { url: "/assets/art/journey-deck/journey-cargo.svg", width: 1110, height: 170, x: 420, y: 540 },
  marlowSheet: {
    url: "/assets/art/journey-deck/marlow-sheet.svg",
    width: 160, height: 160,
    frames: {
      idle: { x: 0, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkA: { x: 160, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
      walkB: { x: 320, y: 0, width: 160, height: 160, pivot: { x: 80, y: 142 } },
    },
  },
  deckhandSheet: {
    url: "/assets/art/journey-deck/deckhand-sheet.svg",
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

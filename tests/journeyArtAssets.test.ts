import { describe, expect, it } from "vitest";
import { journeyArtAssets } from "../src/story/heart-of-darkness/journeyArtAssets";

describe("Journey's replaceable art contract", () => {
  it("keeps eleven independently replaceable pieces, including five seamless river depths", () => {
    expect(Object.keys(journeyArtAssets)).toHaveLength(11);
    for (const key of ["distantRidge", "farVegetation", "nearBank", "riverCurrent", "foregroundReeds"] as const) {
      expect(journeyArtAssets[key].width).toBe(1920);
      expect(journeyArtAssets[key].y + journeyArtAssets[key].height).toBeLessThanOrEqual(1080);
    }
    for (const [name, source] of Object.entries(journeyArtAssets)) {
      expect(source.url, `${name} must resolve to a story-owned plate`)
        .toMatch(/^\/assets\/art\/journey-deck\/.+\.svg$/);
    }
  });

  it("keeps transparent plates cropped to their painted bounds for software rendering", () => {
    const staticPlates = Object.values(journeyArtAssets).slice(0, 9);
    const pixels = staticPlates.reduce((sum, plate) => sum + plate.width * plate.height, 0);
    expect(pixels).toBeLessThan(7_000_000);
  });

  it("shares a foot registration point across every actor frame", () => {
    for (const actor of [journeyArtAssets.marlowSheet, journeyArtAssets.deckhandSheet]) {
      const pivots = Object.values(actor.frames).map((frame) => frame.pivot);
      expect(new Set(pivots.map(({ x, y }) => `${x}:${y}`)).size).toBe(1);
      expect(actor.width).toBe(160);
      expect(actor.height).toBe(160);
    }
  });
});

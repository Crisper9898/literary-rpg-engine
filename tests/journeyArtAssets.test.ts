import { describe, expect, it } from "vitest";
import { journeyArtAssets } from "../src/story/heart-of-darkness/journeyArtAssets";

describe("Journey's replaceable art contract", () => {
  it("keeps eleven independently replaceable pieces, including five seamless river depths", () => {
    expect(Object.keys(journeyArtAssets)).toHaveLength(11);
    for (const key of ["distantRidge", "farVegetation", "nearBank", "riverCurrent", "foregroundReeds"] as const) {
      expect(journeyArtAssets[key].width).toBe(1920);
      expect(journeyArtAssets[key].height).toBe(1080);
    }
    expect(journeyArtAssets.riverCurrent.clip).toEqual({ x: 0, y: 500, width: 1920, height: 580 });
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

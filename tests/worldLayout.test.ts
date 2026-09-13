import { describe, expect, it } from "vitest";
import { validateWorldLayout } from "../src/engine/world/worldLayout";
import { journeyDeck } from "../src/story/heart-of-darkness/deck";

describe("deck authoring boundaries", () => {
  it("accepts the authored deck and its future actor/camera anchors", () => {
    expect(() => validateWorldLayout(journeyDeck)).not.toThrow();
  });

  it("rejects a playable area extending outside the world", () => {
    expect(() => validateWorldLayout({
      ...journeyDeck,
      walkableArea: { x: 1800, y: 700, width: 200, height: 120 },
    })).toThrow(/walkable/i);
  });

  it.each([
    { x: 399, y: 730 }, { x: 1521, y: 730 },
    { x: 800, y: 659 }, { x: 800, y: 861 }, { x: NaN, y: 730 },
  ])("rejects an anchor outside the playable deck: %o", (playerSpawn) => {
    expect(() => validateWorldLayout({
      ...journeyDeck, anchors: { ...journeyDeck.anchors, playerSpawn },
    })).toThrow(/playerSpawn/);
  });

  it.each([0, -1, NaN, Infinity])("rejects invalid world size %s", (width) => {
    expect(() => validateWorldLayout({ ...journeyDeck, size: { width, height: 1080 } })).toThrow();
  });
});

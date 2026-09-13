import { describe, expect, it } from "vitest";
import { journeySlice } from "../src/story/heart-of-darkness/journey";

describe("PixiVN foundation", () => {
  it("keeps Heart of Darkness as the first vertical slice", () => {
    expect(journeySlice.id).toBe("heart-of-darkness-journey");
    expect(journeySlice.protagonist).toBe("Marlow");
  });

  it("defines the ten foundation proof points", () => {
    expect(journeySlice.qualityGate).toHaveLength(10);
  });
});

import { describe, expect, it } from "vitest";
import { createPixiStorageCheckpoint } from "../src/engine/world/createPixiStorageCheckpoint";
import { storage } from "@drincs/pixi-vn";

describe("Pixi'VN checkpoint adapter", () => {
  it("stores a validated value under a caller-owned key", () => {
    const key = "portability.test-state";
    const checkpoint = createPixiStorageCheckpoint(key,
      (value): value is number => typeof value === "number" && Number.isFinite(value));
    checkpoint.write(0.375);
    expect(storage.get(key)).toBe(0.375);
    expect(checkpoint.read()).toBe(0.375);
    storage.set(key, "invalid");
    expect(checkpoint.read()).toBeUndefined();
    expect(() => checkpoint.write(NaN)).toThrow(RangeError);
    storage.set(key, undefined);
  });
});

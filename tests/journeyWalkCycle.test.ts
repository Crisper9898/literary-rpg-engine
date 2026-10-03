import { expect, it } from "vitest";
import { JourneyWalkCycle } from "../src/story/heart-of-darkness/JourneyWalkCycle";

it("visits six poses per distance cycle and is independent of frame cadence", () => {
  const walk = new JourneyWalkCycle(60);
  const frames = Array.from({ length: 6 }, () => walk.advance(10).frame);
  expect(new Set(frames).size).toBe(6);
  const slow = new JourneyWalkCycle(60), fast = new JourneyWalkCycle(60);
  slow.advance(27);
  for (let i = 0; i < 9; i++) fast.advance(3);
  expect(slow.advance(3)).toEqual(fast.advance(3));
});

it("idles at a boundary, never advances on invalid motion, and keeps bobbing subtle", () => {
  const walk = new JourneyWalkCycle(60);
  expect(walk.advance(0).moving).toBe(false);
  for (const distance of [10, 10, 10, 10, 10, 10]) expect(Math.abs(walk.advance(distance).lift)).toBeLessThanOrEqual(1);
  expect(walk.advance(0).lift).toBe(0);
  expect(walk.advance(Number.NaN).moving).toBe(false);
});

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const names = ["journey-river", "journey-shore", "journey-engine"];

function inspectWav(name) {
  const file = readFileSync(new URL(`../public/assets/audio/${name}.wav`, import.meta.url));
  expect(file.toString("ascii", 0, 4)).toBe("RIFF");
  expect(file.toString("ascii", 8, 12)).toBe("WAVE");
  expect(file.readUInt16LE(20)).toBe(1); // PCM
  expect(file.readUInt16LE(22)).toBe(1); // mono
  expect(file.readUInt16LE(34)).toBe(16);
  const rate = file.readUInt32LE(24);
  const samples = file.readUInt32LE(40) / 2;
  const values = Array.from({ length: samples }, (_, index) => file.readInt16LE(44 + index * 2) / 32768);
  const rms = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / samples);
  return { file, seconds: samples / rate, rms,
    peak: Math.max(...values.slice(0, 1000).map(Math.abs)),
    edge: Math.abs(values[0] - values.at(-1)),
  };
}

describe("provisional Journey ambience", () => {
  it("provides three distinct audible, loop-safe PCM files", () => {
    const assets = names.map(inspectWav);
    for (const asset of assets) {
      expect(asset.seconds).toBeGreaterThanOrEqual(6);
      expect(asset.rms).toBeGreaterThan(0.035);
      expect(asset.rms).toBeLessThan(0.45);
      expect(asset.peak).toBeLessThan(0.95);
      expect(asset.edge).toBeLessThan(0.03);
    }
    expect(new Set(assets.map(asset => asset.file.toString("base64"))).size).toBe(3);
  });
});

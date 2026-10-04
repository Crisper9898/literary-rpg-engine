import { expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { SpatialAudioController } from "../src/engine/audio/SpatialAudioController";
import { createStationAudio } from "../src/story/heart-of-darkness/stationAudio";
it("the one-time creak removes forest chatter but retains faint river; cleanup releases sources", () => {
  let creaking = false; const active = new Set();
  const output = { play: id => active.add(id), stop: id => active.delete(id), setVolume: () => {},
    isPlaying: id => active.has(id), pause: () => {}, resume: () => {}, dispose: () => active.clear() };
  const mixer = new SpatialAudioController(() => ({ x: 900, y: 730 }), createStationAudio(() => creaking), output);
  mixer.update(2000); expect(active.has("forest")).toBe(true); expect(active.has("wood")).toBe(false);
  creaking = true; mixer.update(2000); expect(active.has("forest")).toBe(false); expect(active.has("wood")).toBe(true);
  expect(mixer.getLayerState("distant-water").volume).toBeGreaterThan(0);
  creaking = false; mixer.update(2000); expect(active.has("forest")).toBe(true); expect(active.has("wood")).toBe(false);
  mixer.dispose(); expect(active.size).toBe(0);
});
it("the authored wood strain cue has audible, unclipped PCM", () => {
  const wav = readFileSync("public/assets/audio/journey-inner-station/wood-creak.wav");
  let peak = 0; for (let i = 44; i < wav.length; i += 2) peak = Math.max(peak, Math.abs(wav.readInt16LE(i)));
  expect(wav.toString("ascii", 0, 4)).toBe("RIFF"); expect(peak).toBeGreaterThan(1000); expect(peak).toBeLessThan(32767);
});

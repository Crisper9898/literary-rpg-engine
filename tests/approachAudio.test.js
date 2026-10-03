import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createApproachAudioLayers } from "../src/story/heart-of-darkness/approachAudio";
import { SpatialAudioController } from "../src/engine/audio/SpatialAudioController";
import { NavigationController } from "../src/puzzles/riverApproach/NavigationController";
import { approachRoute } from "../src/story/heart-of-darkness/riverApproach";
describe("work-owned approach sound cues", () => {
  it("uses audible stereo sources with opposite bank balance, no clipped samples", () => {
    for (const name of ["left", "right", "whistle", "impacts"]) {
      const wav = readFileSync(`public/assets/audio/journey-approach/${name}.wav`);
      expect(wav.toString("ascii", 0, 4)).toBe("RIFF"); expect(wav.readUInt16LE(22)).toBe(2);
      let left = 0, right = 0, peak = 0;
      for (let i = 44; i < wav.length; i += 4) {
        const l = wav.readInt16LE(i), r = wav.readInt16LE(i + 2);
        left += l * l; right += r * r; peak = Math.max(peak, Math.abs(l), Math.abs(r));
      }
      expect(peak).toBeGreaterThan(1000); expect(peak).toBeLessThan(32767);
      if (name === "left") expect(left).toBeGreaterThan(right * 5);
      if (name === "right") expect(right).toBeGreaterThan(left * 5);
    }
  });
  it("anticipates attack, ducks on loss, crossfades to whistle and releases every source", () => {
    const active = new Set();
    const output = { play: id => { active.add(id); }, setVolume: () => {}, stop: id => { active.delete(id); },
      isPlaying: id => active.has(id), pause: () => {}, resume: () => {}, dispose: () => { active.clear(); } };
    const navigation = new NavigationController(approachRoute, { progress: .12 });
    const mixer = new SpatialAudioController(() => ({ x: -.5, y: 0 }), createApproachAudioLayers(() => navigation.state), output);
    mixer.update(2000); expect(active.has("left")).toBe(true); expect(active.has("impacts")).toBe(false);
    navigation.restore({ ...navigation.state, progress: .5 }); mixer.update(2000);
    expect(active.has("left")).toBe(false); expect(active.has("impacts")).toBe(true);
    navigation.interrupt(2400); mixer.update(100);
    expect(active.has("engine")).toBe(false); expect(active.has("impacts")).toBe(false);
    navigation.restore({ ...navigation.state, progress: .86, interruptionMS: 0, whistle: true }); mixer.update(2000);
    expect(active.has("whistle")).toBe(true); expect(active.has("impacts")).toBe(false);
    mixer.dispose(); expect(active.size).toBe(0);
  });
});

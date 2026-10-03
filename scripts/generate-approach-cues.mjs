import { mkdirSync, writeFileSync } from "node:fs";

// Original procedural nonverbal sound sketches, no third-party recordings.
// Stereo placement belongs to the work's source files, not a new engine panner.
const rate = 22050, seconds = 6, count = rate * seconds;
const directory = new URL("../public/assets/audio/journey-approach/", import.meta.url);
mkdirSync(directory, { recursive: true });
for (const [name, pan] of [["left", -.8], ["right", .8], ["impacts", .35], ["whistle", 0]]) {
  const file = Buffer.alloc(44 + count * 4);
  file.write("RIFF"); file.writeUInt32LE(file.length - 8, 4); file.write("WAVEfmt ", 8);
  file.writeUInt32LE(16, 16); file.writeUInt16LE(1, 20); file.writeUInt16LE(2, 22);
  file.writeUInt32LE(rate, 24); file.writeUInt32LE(rate * 4, 28); file.writeUInt16LE(4, 32);
  file.writeUInt16LE(16, 34); file.write("data", 36); file.writeUInt32LE(count * 4, 40);
  let seed = 87123, filtered = 0;
  for (let i = 0; i < count; i++) {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    const noise = (seed >>> 0) / 0x80000000 - 1, t = i / rate;
    filtered += .08 * (noise - filtered);
    const gate = Math.sin(Math.PI / 2 * Math.min(1, t / .25)) ** 2 * Math.min(1, (seconds - t) / .2);
    const call = Math.max(0, Math.sin(t * Math.PI * 2 / 3)) ** 5;
    const frequency = 180 + 45 * Math.sin(t * 3);
    const vocal = Math.sin(2 * Math.PI * (180 * t - 15 * Math.cos(t * 3))) +
      .35 * Math.sin(2 * Math.PI * frequency * t * 2);
    const tap = Math.exp(-((t % .8) * 27));
    let sample = name === "whistle" ? (Math.sin(t * 2 * Math.PI * 370) + .32 * Math.sin(t * 2 * Math.PI * 740)) *
      Math.max(0, Math.sin(t * Math.PI / 3)) ** 2 * .3 :
      name === "impacts" ? (noise * .38 + Math.sin(t * 2 * Math.PI * 95) * .22) * tap :
      vocal * call * .11 + filtered * .25 + Math.sin(t * 2 * Math.PI * 85) * tap * .18 + noise * tap * .03;
    sample *= gate;
    for (let channel = 0; channel < 2; channel++) {
      const gain = Math.sqrt((1 + (channel === 0 ? -pan : pan)) / 2);
      file.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample * gain)) * 32767), 44 + i * 4 + channel * 2);
    }
  }
  writeFileSync(new URL(`${name}.wav`, directory), file);
}

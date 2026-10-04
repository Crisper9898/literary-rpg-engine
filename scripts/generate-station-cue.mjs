import { mkdirSync, writeFileSync } from "node:fs";
// Original wood strain / leaf rustle, not a voice or third-party sample.
const directory = new URL("../public/assets/audio/journey-inner-station/", import.meta.url);
mkdirSync(directory, { recursive: true });
const rate = 22050, count = rate * 3, file = Buffer.alloc(44 + count * 2);
file.write("RIFF"); file.writeUInt32LE(file.length - 8, 4); file.write("WAVEfmt ", 8);
file.writeUInt32LE(16, 16); file.writeUInt16LE(1, 20); file.writeUInt16LE(1, 22);
file.writeUInt32LE(rate, 24); file.writeUInt32LE(rate * 2, 28); file.writeUInt16LE(2, 32);
file.writeUInt16LE(16, 34); file.write("data", 36); file.writeUInt32LE(count * 2, 40);
let seed = 38411, low = 0;
for (let i = 0; i < count; i++) {
  const t = i / rate; seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  const noise = (seed >>> 0) / 0x80000000 - 1; low += .05 * (noise - low);
  const envelope = Math.sin(Math.PI * Math.min(1, t / 2.6)) ** 2;
  const grain = .08 + .12 * Math.max(0, Math.sin(t * 19)) ** 7;
  const sample = (Math.sin(2 * Math.PI * (125 * t + 7 * Math.sin(t * 2))) * grain + low * .15) * envelope;
  file.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
}
writeFileSync(new URL("wood-creak.wav", directory), file);

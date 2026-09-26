import { mkdirSync, writeFileSync } from "node:fs";

// Original provisional synthesis; no recordings, samples or external libraries.
const rate = 22_050;
const seconds = 4;
const count = rate * seconds;
const output = new URL("../../../public/assets/audio/metamorphosis/", import.meta.url);
mkdirSync(output, { recursive: true });
const tau = 2 * Math.PI;

function noise(seed) {
  const table = new Float64Array(count);
  let state = seed >>> 0;
  for (let i = 0; i < count; i++) {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    table[i] = (state >>> 0) / 0x80000000 - 1;
  }
  return table;
}

function lowpass(input, amount) {
  const result = new Float64Array(count);
  let value = 0;
  for (let pass = 0; pass < 3; pass++) for (let i = 0; i < count; i++) {
    value += amount * (input[i] - value);
    if (pass === 2) result[i] = value;
  }
  return result;
}

const air = lowpass(noise(0x24708231), .026);
const rain = lowpass(noise(0x71955041), .11);
const voice = lowpass(noise(0x12403016), .052);

function render(kind) {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const phase = i / count;
    if (kind === "room") {
      samples[i] = .14 * Math.sin(tau * 55 * t) + .08 * Math.sin(tau * 110 * t) + air[i] * .25;
    } else if (kind === "outside") {
      const swell = .65 + .2 * Math.sin(tau * 3 * phase);
      samples[i] = (rain[i] * .75 + air[i] * .45) * swell;
    } else {
      const syllables = Math.max(0, Math.sin(tau * 7 * phase)) ** 2;
      const murmur = Math.sin(tau * 121 * t) + .48 * Math.sin(tau * 181 * t);
      samples[i] = (murmur * .21 + voice[i] * .22) * (.18 + .5 * syllables);
    }
  }
  const seam = 512;
  for (let i = 0; i < seam; i++) {
    const blend = (i / (seam - 1)) ** 2 * (3 - 2 * i / (seam - 1));
    samples[count - seam + i] = samples[count - seam + i] * (1 - blend) + samples[0] * blend;
  }
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = .7 / peak;
  const file = Buffer.allocUnsafe(44 + count * 2);
  file.write("RIFF", 0); file.writeUInt32LE(file.length - 8, 4);
  file.write("WAVEfmt ", 8); file.writeUInt32LE(16, 16);
  file.writeUInt16LE(1, 20); file.writeUInt16LE(1, 22);
  file.writeUInt32LE(rate, 24); file.writeUInt32LE(rate * 2, 28);
  file.writeUInt16LE(2, 32); file.writeUInt16LE(16, 34);
  file.write("data", 36); file.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) {
    file.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * scale)) * 32767), 44 + i * 2);
  }
  writeFileSync(new URL(`${kind}.wav`, output), file);
}

for (const kind of ["room", "outside", "voices"]) render(kind);

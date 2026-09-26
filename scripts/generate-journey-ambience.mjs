import { writeFileSync } from "node:fs";

// Original procedural drafts: no recordings, samples, or third-party audio.
const rate = 22_050;
const seconds = 8;
const count = rate * seconds;
const output = new URL("../public/assets/audio/", import.meta.url);

function noise(seed) {
  const values = new Float64Array(count);
  let state = seed >>> 0;
  for (let i = 0; i < count; i++) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    values[i] = (state >>> 0) / 0x80000000 - 1;
  }
  return values;
}

// Running the same finite noise table through the filter settles its state at
// the seam, so the resulting texture can loop without restarting its motion.
function lowpass(input, alpha) {
  const result = new Float64Array(count);
  let previous = 0;
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < count; i++) {
      previous += alpha * (input[i] - previous);
      if (pass === 2) result[i] = previous;
    }
  }
  return result;
}

const riverLow = lowpass(noise(0x19021999), 0.045);
const riverBubbles = lowpass(noise(0x770451ac), 0.31);
const shoreWind = lowpass(noise(0x356004c0), 0.027);
const shoreLeaves = lowpass(noise(0x85018400), 0.19);
const engineHiss = lowpass(noise(0x18571900), 0.13);
const twoPi = Math.PI * 2;

function render(kind) {
  const samples = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const phase = i / count;
    if (kind === "river") {
      const surge = 0.7 + 0.23 * Math.sin(twoPi * (5 * phase + 0.08 * Math.sin(twoPi * phase)));
      const ripple = Math.max(0, Math.sin(twoPi * 11 * phase)) ** 4;
      samples[i] = surge * riverLow[i] * 1.6 + riverBubbles[i] * (0.16 + 0.18 * ripple);
    } else if (kind === "shore") {
      const breeze = 0.65 + 0.24 * Math.sin(twoPi * 3 * phase);
      const chirpGate = Math.max(0, Math.sin(twoPi * 21 * phase)) ** 10;
      const insect = Math.sin(twoPi * (2_340 * t - 35 * Math.cos(twoPi * phase))) * chirpGate;
      samples[i] = shoreWind[i] * 1.15 * breeze + shoreLeaves[i] * 0.20 + insect * 0.09;
    } else {
      const piston = 0.75 + 0.20 * Math.sin(twoPi * 20 * phase);
      const rumble = Math.sin(twoPi * 42 * t) * 0.42 +
        Math.sin(twoPi * 84 * t + 0.3) * 0.22 +
        Math.sin(twoPi * 126 * t + 0.8) * 0.09;
      samples[i] = rumble * piston + engineHiss[i] * 0.075;
    }
  }

  // A short seam blend prevents a click from the finite noise component.
  const seam = 512;
  for (let i = 0; i < seam; i++) {
    const blend = (i / (seam - 1)) ** 2 * (3 - 2 * i / (seam - 1));
    samples[count - seam + i] = samples[count - seam + i] * (1 - blend) + samples[0] * blend;
  }

  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = 0.78 / peak;
  const pcmBytes = count * 2;
  const file = Buffer.allocUnsafe(44 + pcmBytes);
  file.write("RIFF", 0);
  file.writeUInt32LE(file.length - 8, 4);
  file.write("WAVEfmt ", 8);
  file.writeUInt32LE(16, 16);
  file.writeUInt16LE(1, 20);
  file.writeUInt16LE(1, 22);
  file.writeUInt32LE(rate, 24);
  file.writeUInt32LE(rate * 2, 28);
  file.writeUInt16LE(2, 32);
  file.writeUInt16LE(16, 34);
  file.write("data", 36);
  file.writeUInt32LE(pcmBytes, 40);
  for (let i = 0; i < count; i++) {
    file.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i] * scale)) * 32767), 44 + i * 2);
  }
  writeFileSync(new URL(`journey-${kind}.wav`, output), file);
}

for (const kind of ["river", "shore", "engine"]) render(kind);

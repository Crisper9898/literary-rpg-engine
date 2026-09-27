import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { metamorphosisRoom as room } from "./room";

const sources = [
  { alias: "metamorphosis-room-tone", src: "/assets/audio/metamorphosis/room.wav" },
  { alias: "metamorphosis-window-outside", src: "/assets/audio/metamorphosis/outside.wav" },
  { alias: "metamorphosis-door-voices", src: "/assets/audio/metamorphosis/voices.wav" },
] as const;
let registered = false;

export function registerMetamorphosisAudio(): void {
  if (registered) return;
  for (const source of sources) Assets.add(source);
  registered = true;
}

export const metamorphosisAudioLayers: readonly AudioLayer[] = [
  { id: "room", source: sources[0].alias, volume: .17, fadeInMS: 900, fadeOutMS: 1100 },
  { id: "outside", source: sources[1].alias, volume: .28,
    zone: { center: () => room.anchors.window, innerRadius: 80, outerRadius: 540 },
    fadeInMS: 900, fadeOutMS: 1100 },
  { id: "voices", source: sources[2].alias, volume: .24,
    zone: { center: () => room.anchors.door, innerRadius: 80, outerRadius: 560 },
    fadeInMS: 900, fadeOutMS: 1100 },
];

export const metamorphosisHallwayAudioLayers: readonly AudioLayer[] = [
  { id: "room", source: sources[0].alias, volume: .12,
    fadeInMS: 900, fadeOutMS: 1100 },
];

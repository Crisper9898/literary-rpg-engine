import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
export const departurePoints = {
  board: { x: 420, y: 745 }, patient: { x: 650, y: 760 }, mooring: { x: 1440, y: 790 },
  bank: { x: 1120, y: 705 }, whistle: { x: 530, y: 740 }, crew: { x: 1040, y: 800 }, helm: { x: 780, y: 750 },
};
export const departureAudio: readonly AudioLayer[] = [
  { id: "engine", source: "journey-audio-engine", volume: .12, fadeInMS: 1400, fadeOutMS: 1600 },
  { id: "water", source: "journey-audio-river", volume: .085, fadeInMS: 1700, fadeOutMS: 1200 },
  { id: "bank", source: "journey-audio-shore", volume: .028, fadeInMS: 2200, fadeOutMS: 2000,
    zone: { center: () => departurePoints.bank, innerRadius: 80, outerRadius: 650 } },
];

import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
export const breakdownPoints = {
  entry: { x: 780, y: 750 }, patient: { x: 650, y: 760 }, engine: { x: 950, y: 735 },
  forge: { x: 1250, y: 800 }, helm: { x: 780, y: 750 },
};
export const breakdownAudio: readonly AudioLayer[] = [
  { id: "engine", source: "journey-audio-engine", volume: .14, fadeInMS: 1200, fadeOutMS: 1700 },
  { id: "water", source: "journey-audio-river", volume: .095, fadeInMS: 1500, fadeOutMS: 1200 },
  { id: "bank", source: "journey-audio-shore", volume: .038, fadeInMS: 2000, fadeOutMS: 2000,
    zone: { center: () => breakdownPoints.engine, innerRadius: 70, outerRadius: 650 } },
];

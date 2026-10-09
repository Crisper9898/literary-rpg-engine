import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
export const evacuationPoints = {
  start: { x: 420, y: 745 }, patient: { x: 1315, y: 780 }, priority: { x: 760, y: 800 },
  bindings: { x: 1410, y: 800 }, landing: { x: 510, y: 800 }, cargo: { x: 650, y: 745 },
};
export const evacuationAudio: readonly AudioLayer[] = [
  { id: "water", source: "journey-audio-river", volume: .028, fadeInMS: 1800, fadeOutMS: 1400,
    zone: { center: () => ({ x: 430, y: 760 }), innerRadius: 180, outerRadius: 1450 } },
  { id: "canopy", source: "journey-audio-shore", volume: .014, fadeInMS: 2300, fadeOutMS: 1600,
    zone: { center: () => ({ x: 1500, y: 740 }), innerRadius: 200, outerRadius: 1400 } },
  { id: "wood", source: "station-wood-creak", volume: .04, fadeInMS: 900, fadeOutMS: 1200,
    zone: { center: () => evacuationPoints.landing, innerRadius: 60, outerRadius: 260 } },
];

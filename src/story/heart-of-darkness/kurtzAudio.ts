import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { createStationAudio } from "./stationAudio";
import { kurtzIntroduction, kurtzStage } from "../../content/state/kurtzIntroductionState";
export const createKurtzStationAudio = (creaking: () => boolean): readonly AudioLayer[] => [
  ...createStationAudio(creaking),
  { id: "stretcher-wood", source: "station-wood-creak", volume: .07, fadeInMS: 700, fadeOutMS: 1300,
    enabled: () => { const t = kurtzIntroduction().elapsedMS; return t > 18000 && t < 22000; },
    zone: { center: () => ({ x: 1500, y: 750 }), innerRadius: 140, outerRadius: 1000 } },
  { id: "after-voice", source: "journey-audio-shore", volume: .035, fadeInMS: 5000, fadeOutMS: 1500,
    enabled: () => kurtzStage() === "present", zone: { center: () => ({ x: 1315, y: 780 }), innerRadius: 150, outerRadius: 1000 } },
];
/** Silence is a story decision, mixed by the existing transport, never heroic music. */
export const kurtzAmbientGain = () => {
  const { activated, elapsedMS: t } = kurtzIntroduction();
  return !activated ? 1 : t < 12000 ? 1 - t / 12000 : t < 52000 ? 0 : .16;
};

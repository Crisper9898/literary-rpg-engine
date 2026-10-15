import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { journeyArtAssets } from "./journeyArtAssets";
import { registerJourneyAudioAssets } from "./journeyAudio";

export const centralRoom = {
  size: { width: 1920, height: 1080 },
  walkableArea: { x: 360, y: 710, width: 1200, height: 200 },
};
export const centralPoints = {
  entry: { x: 660, y: 825 }, village: { x: 430, y: 770 }, ravine: { x: 930, y: 800 },
  camp: { x: 510, y: 850 }, companion: { x: 1330, y: 785 }, arrival: { x: 1490, y: 855 },
  agent: { x: 1190, y: 780 }, wreck: { x: 490, y: 845 }, exit: { x: 1490, y: 865 }, far: { x: 380, y: 890 },
};
export const centralArt = {
  forest: { ...journeyArtAssets.farVegetation, y: 235 },
  figure: journeyArtAssets.marlowSheet,
};
export const registerCentralAudio = registerJourneyAudioAssets;
export const centralAudio = (caravan: boolean): readonly AudioLayer[] => [
  { id: "vegetation", source: "journey-audio-shore", volume: caravan ? .12 : .075, fadeInMS: 1200, fadeOutMS: 1000 },
  { id: "water", source: "journey-audio-river", volume: caravan ? .07 : .16, fadeInMS: 1400, fadeOutMS: 1200,
    zone: { center: () => caravan ? centralPoints.ravine : centralPoints.wreck, innerRadius: 150, outerRadius: 1000 } },
];

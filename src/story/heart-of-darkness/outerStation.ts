import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { journeyArtAssets } from "./journeyArtAssets";
import { registerJourneyAudioAssets } from "./journeyAudio";

export const outerRoom = { size: { width: 1920, height: 1080 },
  walkableArea: { x: 360, y: 710, width: 1200, height: 200 } };
export const outerPoints = { entry: { x: 710, y: 825 }, surf: { x: 450, y: 790 },
  warship: { x: 1080, y: 750 }, landing: { x: 1420, y: 820 },
  works: { x: 1040, y: 780 }, grove: { x: 480, y: 815 }, accountant: { x: 1310, y: 775 },
  exit: { x: 1510, y: 865 }, far: { x: 380, y: 890 } };
// Reuse approved plates/atlas without changing the original Deck manifest or files.
export const outerArt = {
  forest: { ...journeyArtAssets.farVegetation, y: 235 },
  figure: journeyArtAssets.marlowSheet,
};
export const registerOuterAudio = registerJourneyAudioAssets;
export const outerAudio = (coast: boolean): readonly AudioLayer[] => [
  { id: "water", source: "journey-audio-river", volume: coast ? .15 : .09, fadeInMS: 1200, fadeOutMS: 1000 },
  { id: "machinery", source: "journey-audio-engine", volume: .085, fadeInMS: 1000, fadeOutMS: 1100,
    enabled: () => coast, zone: { center: () => outerPoints.landing, innerRadius: 80, outerRadius: 900 } },
  { id: "grove", source: "journey-audio-shore", volume: .13, fadeInMS: 1300, fadeOutMS: 1000,
    enabled: () => !coast, zone: { center: () => outerPoints.grove, innerRadius: 130, outerRadius: 850 } },
];

import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { registerJourneyAudioAssets } from "./journeyAudio";
let registered = false;
export function registerStationAudio() {
  registerJourneyAudioAssets();
  if (!registered) { Assets.add({ alias: "station-wood-creak", src: "/assets/audio/journey-inner-station/wood-creak.wav" }); registered = true; }
}
export const createStationAudio = (creaking: () => boolean): readonly AudioLayer[] => [
  { id: "distant-water", source: "journey-audio-river", volume: .08, fadeInMS: 1400, fadeOutMS: 1000,
    zone: { center: () => ({ x: 380, y: 760 }), innerRadius: 100, outerRadius: 1400 } },
  { id: "forest", source: "journey-audio-shore", volume: .12, fadeInMS: 1000, fadeOutMS: 180,
    enabled: () => !creaking(), zone: { center: () => ({ x: 1300, y: 730 }), innerRadius: 250, outerRadius: 1500 } },
  { id: "wood", source: "station-wood-creak", volume: .18, fadeInMS: 160, fadeOutMS: 800,
    enabled: creaking, zone: { center: () => ({ x: 900, y: 720 }), innerRadius: 300, outerRadius: 1100 } },
];

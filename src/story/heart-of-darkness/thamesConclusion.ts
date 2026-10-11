import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
export const thamesDeck = { size: { width: 1920, height: 1080 },
  walkableArea: { x: 360, y: 710, width: 1200, height: 180 } };
export const thamesPoints = { entry: { x: 650, y: 810 }, mooring: { x: 460, y: 800 },
  director: { x: 1250, y: 800 }, horizon: { x: 970, y: 740 }, far: { x: 400, y: 860 } };
// Existing project-authored water loop; no steamer, tropical shore or new audio asset.
export const thamesAudio: readonly AudioLayer[] = [
  { id: "water", source: "journey-audio-river", volume: .12, fadeInMS: 1400, fadeOutMS: 1400 },
];

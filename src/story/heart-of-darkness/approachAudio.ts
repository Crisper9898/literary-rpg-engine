import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { registerJourneyAudioAssets } from "./journeyAudio";
import type { NavigationState } from "../../puzzles/riverApproach/NavigationController";

let registered = false;
export function registerApproachAudio() {
  registerJourneyAudioAssets();
  if (registered) return;
  for (const id of ["left", "right", "impacts", "whistle"])
    Assets.add({ alias: `approach-${id}`, src: `/assets/audio/journey-approach/${id}.wav` });
  registered = true;
}
export const createApproachAudioLayers = (state: () => Readonly<NavigationState>): readonly AudioLayer[] => [
  { id: "water", source: "journey-audio-river", volume: .22, fadeInMS: 1200, fadeOutMS: 700 },
  { id: "engine", source: "journey-audio-engine", volume: .18, fadeInMS: 500, fadeOutMS: 80,
    enabled: () => state().interruptionMS === 0 },
  ...["left", "right"].map((side): AudioLayer => ({ id: side, source: `approach-${side}`, volume: .32,
    fadeInMS: 650, fadeOutMS: 1400,
    enabled: () => { const p = state().progress;
      return side === "left" ? p >= .07 && p < .22 : p >= .25 && p < .4; },
    zone: { center: () => ({ x: side === "left" ? -1 : 1, y: 0 }), innerRadius: .2, outerRadius: 2.4 } })),
  { id: "impacts", source: "approach-impacts", volume: .32, fadeInMS: 200, fadeOutMS: 100,
    enabled: () => { const s = state(); return s.progress >= .48 && s.progress < .93 &&
      !s.whistle && s.interruptionMS === 0; } },
  { id: "whistle", source: "approach-whistle", volume: .3, fadeInMS: 100, fadeOutMS: 1500,
    enabled: () => { const s = state(); return s.whistle && s.progress < .96; } },
];

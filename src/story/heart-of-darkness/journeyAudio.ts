import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { journeyDeck } from "./deck";

// Replace these asset paths here when the final soundscape is produced.
const placeholder = "/assets/audio/silent-placeholder.wav";
const assets = [
  { alias: "journey-audio-river", src: placeholder },
  { alias: "journey-audio-shore", src: placeholder },
  { alias: "journey-audio-engine", src: placeholder },
] as const;
let registered = false;

export function registerJourneyAudioAssets(): void {
  if (registered) return;
  for (const asset of assets) Assets.add(asset);
  registered = true;
}

export const journeyAudioLayers: readonly AudioLayer[] = [
  { id: "river", source: assets[0].alias, group: "waterside", priority: 0,
    volume: 0.22, fadeInMS: 850, fadeOutMS: 1000 },
  { id: "shore", source: assets[1].alias, group: "waterside", priority: 10,
    volume: 0.34, fadeInMS: 850, fadeOutMS: 1000,
    zone: { center: () => ({ x: journeyDeck.walkableArea.x, y: 760 }),
      innerRadius: 70, outerRadius: 500 } },
  { id: "engine", source: assets[2].alias, volume: 0.13,
    fadeInMS: 750, fadeOutMS: 750,
    zone: { center: () => ({ x: 1280, y: 760 }), innerRadius: 70, outerRadius: 450 } },
];

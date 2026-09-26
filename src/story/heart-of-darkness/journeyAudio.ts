import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
import { journeyDeck } from "./deck";

// Provisional loops. Replace these paths here when the authored soundscape arrives.
const assets = [
  { alias: "journey-audio-river", src: "/assets/audio/journey-river.wav" },
  { alias: "journey-audio-shore", src: "/assets/audio/journey-shore.wav" },
  { alias: "journey-audio-engine", src: "/assets/audio/journey-engine.wav" },
] as const;
let registered = false;

export function registerJourneyAudioAssets(): void {
  if (registered) return;
  for (const asset of assets) Assets.add(asset);
  registered = true;
}

export const journeyAudioLayers: readonly AudioLayer[] = [
  { id: "river", source: assets[0].alias, group: "waterside", priority: 0,
    volume: 0.25, fadeInMS: 1000, fadeOutMS: 1200 },
  { id: "shore", source: assets[1].alias, group: "waterside", priority: 10,
    volume: 0.36, fadeInMS: 1000, fadeOutMS: 1200,
    zone: { center: () => ({ x: journeyDeck.walkableArea.x, y: 760 }),
      innerRadius: 70, outerRadius: 400 } },
  { id: "engine", source: assets[2].alias, volume: 0.26,
    fadeInMS: 900, fadeOutMS: 1100,
    zone: { center: () => ({ x: 1280, y: 760 }), innerRadius: 70, outerRadius: 450 } },
];

import { Assets } from "pixi.js";
import type { AudioLayer } from "../../engine/audio/SpatialAudioController";
export const europeRoom = { size: { width: 1920, height: 1080 },
  walkableArea: { x: 340, y: 680, width: 1260, height: 210 } };
export const europePoints = { entry: { x: 760, y: 805 }, window: { x: 470, y: 725 },
  packet: { x: 860, y: 745 }, report: { x: 860, y: 745 }, letters: { x: 1140, y: 745 },
  door: { x: 1510, y: 790 }, far: { x: 380, y: 860 } };
let registered = false;
export function registerEuropeAudio() {
  if (registered) return;
  // Existing project-authored neutral room tone; no voyage engine/water in Europe.
  Assets.add({ alias: "journey-europe-room", src: "/assets/audio/metamorphosis/room.wav" });
  registered = true;
}
export const europeAudio: readonly AudioLayer[] = [
  { id: "room", source: "journey-europe-room", volume: .065, fadeInMS: 1000, fadeOutMS: 1000 },
];

import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite } from "pixi.js";
import { createWoodStop } from "../../story/heart-of-darkness/createWoodStop";
import { woodStop, woodStopAudio } from "../../story/heart-of-darkness/woodStop";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { registerJourneyAudioAssets } from "../../story/heart-of-darkness/journeyAudio";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { leaveWoodStop, setJourneySpace, woodStopAtmosphere, woodStopPosition, woodStopProgress } from "../state/woodStopState";
import { showJourneySpace } from "./journeyDeck";
import { attachWoodStopInteractions } from "./attachWoodStopInteractions";

export function showWoodStop() {
  const { presentation, layers, actor, sailor, art, background } = createWoodStop();
  canvas.layers.add("journey-wood-stop", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Heart of Darkness: explora la cabaña con WASD o flechas · E para interactuar");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(actor, canvas.app.ticker, surface, { position: woodStop.anchors.arrival,
    bounds: woodStop.walkableArea, ...marlowMovement }, woodStopPosition);
  attachMarlowArt(actor, canvas.app.ticker, art.setState, () => "concern");
  attachActorDepth(layers.actors, canvas.app.ticker, [actor, sailor.actor]);
  attachNpcRoutine(sailor.actor, canvas.app.ticker, { bounds: woodStop.walkableArea,
    position: { x: 1460, y: 780 },
    footprintRadius: 20, speed: 70, stops: [{ position: { x: 1460, y: 780 },
      idleMS: 4500, activity: "coil-rope" }] }, sailor.pose);
  const camera = attachWorldCamera(layers.root, canvas.app.ticker, {
    world: woodStop.size, viewport: woodStop.size, position: { x: 960, y: 540 }, zoom: 1, smoothing: 6,
  });
  // This small landing is staged as one theatrical frame; the reusable director
  // remains available without pulling important props out of view.
  const texture = createFogTexture();
  const fog = [
    { id: "shore-background-fog", parent: layers.environment, y: 310, height: 250, speed: 8 },
    { id: "shore-foreground-fog", parent: layers.foreground, y: 715, height: 170, speed: 21 },
  ].map(({ id, parent, y, height, speed }) => attachParallaxLayer(parent, canvas.app.ticker, camera, {
    id, period: 1920, speed, depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 },
    createTile: () => { const tile = new Container(); const mist = new Sprite({ texture, y, tint: 0x93aaa1 });
      mist.width = 1920; mist.height = height; tile.addChild(mist); return tile; },
  }).layer);
  const atmosphere = attachAtmosphere(layers.root, canvas.app.ticker, {
    progress: woodStopProgress, checkpoint: woodStopAtmosphere,
    keyframes: [{ progress: 0, values: { mist: .05, shade: 0 } },
      { progress: .55, values: { mist: .18, shade: .02 } },
      { progress: 1, values: { mist: .46, shade: .13 } }],
    apply: state => { fog[0].alpha = state.mist; fog[1].alpha = state.mist * .35;
      const value = Math.round(255 * (1 - state.shade)); layers.root.tint = (value << 16) | (value << 8) | value; },
  });
  presentation.once("destroyed", () => texture.destroy(true));
  registerJourneyAudioAssets();
  const audio = attachSpatialAudio(presentation, canvas.app.ticker, surface,
    { namespace: "journey-wood-stop", listener: () => actor.position, layers: woodStopAudio });
  attachWoodStopInteractions(presentation, actor, canvas.app.ticker, surface, async () => {
    leaveWoodStop(); setJourneySpace("deck");
    narration.dialogue = undefined; narration.choices = undefined;
    await showJourneySpace();
  });
  surface.focus({ preventScroll: true });
  return { actor, camera, atmosphere, audio, background };
}

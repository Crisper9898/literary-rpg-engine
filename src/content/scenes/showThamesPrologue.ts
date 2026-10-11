import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Graphics, type Ticker } from "pixi.js";
import { createThamesConclusion } from "../../story/heart-of-darkness/createThamesConclusion";
import { thamesDeck, thamesPoints, thamesAudio } from "../../story/heart-of-darkness/thamesConclusion";
import { registerJourneyAudioAssets } from "../../story/heart-of-darkness/journeyAudio";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { prologuePosition, prologueState } from "../state/thamesPrologueState";
import { prologueAnchorage, prologueTale, prologueContinue } from "../labels/thamesPrologue.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

/** Opening content composes the existing yacht; closing-frame state stays independent. */
export function showThamesPrologue() {
  const scene = createThamesConclusion(), { presentation, layers, player, art } = scene;
  player.label = "prologue-player";
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Prólogo · Nellie en el Támesis · WASD o flechas · E explorar");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: thamesDeck.walkableArea,
    position: thamesPoints.entry }, prologuePosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: thamesDeck.size, viewport: thamesDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  attachParallaxLayer(layers.environment, ticker, camera, { id: "prologue-current", period: 1920,
    reference: { x: 960, y: 540 }, speed: 18, depth: { x: 0, y: 0 }, createTile: () => {
      const g = new Graphics();
      for (let i = 0; i < 14; i++) g.moveTo(i * 149 % 1850, 528 + i * 39)
        .lineTo(i * 149 % 1850 + 75, 530 + i * 39).stroke({ color: 0x6c8b8e, alpha: .12, width: 2 });
      const tile = new Container(); tile.addChild(g); return tile;
    } });
  registerJourneyAudioAssets();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-prologue", listener: () => player.position, layers: thamesAudio });
  const action = (id: keyof typeof thamesPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `prologue-${id}-${prompt}`, prompt,
    target: () => thamesPoints[id], range: 65, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("mooring", "E · Escuchar el agua del fondeadero", () => prologueState().phase === "anchored" && !prologueState().anchorageObserved, prologueAnchorage),
    action("horizon", "E · Comenzar el relato de Marlow", () => prologueState().phase === "anchored", prologueTale),
    action("director", "E · Continuar el viaje en el vapor", () => prologueState().phase === "ready", prologueContinue),
  ], "PRÓLOGO / LA NELLIE", () => prologueState().phase === "ready" ?
    "Continúa hacia el vapor desde el extremo derecho de la cubierta · E" :
    "Explora la amarra a la izquierda o comienza el relato junto al centro de la baranda · E");
  const update = (_frame: Ticker) => { scene.veil.alpha = prologueState().phase === "anchored" ? .05 : prologueState().phase === "telling" ? .14 : .18; };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

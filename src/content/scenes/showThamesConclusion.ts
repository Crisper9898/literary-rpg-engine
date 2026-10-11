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
import { thamesPosition, thamesState } from "../state/thamesConclusionState";
import { thamesMooring, thamesEbb, thamesHorizon, thamesMemory } from "../labels/thamesConclusion.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showThamesConclusion() {
  const scene = createThamesConclusion(), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Nellie en el Támesis · WASD o flechas · E explorar");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: thamesDeck.walkableArea,
    position: thamesPoints.entry }, thamesPosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: thamesDeck.size, viewport: thamesDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  attachParallaxLayer(layers.environment, ticker, camera, { id: "thames-current", period: 1920,
    reference: { x: 960, y: 540 }, speed: 18, depth: { x: 0, y: 0 }, createTile: () => {
      const g = new Graphics();
      for (let i = 0; i < 14; i++) g.moveTo(i * 149 % 1850, 528 + i * 39)
        .lineTo(i * 149 % 1850 + 75, 530 + i * 39).stroke({ color: 0x6c8b8e, alpha: .12, width: 2 });
      const tile = new Container(); tile.addChild(g); return tile;
    } });
  registerJourneyAudioAssets();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-thames", listener: () => player.position, layers: thamesAudio });
  const action = (id: keyof typeof thamesPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `thames-${id}-${prompt}`, prompt,
    target: () => thamesPoints[id], range: 65, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("mooring", "E · Escuchar el agua junto a la amarra", () => !thamesState().mooringObserved && thamesState().phase !== "complete", thamesMooring),
    action("director", "E · Escuchar al Director", () => thamesState().phase === "returned", thamesEbb),
    action("horizon", "E · Levantar la mirada hacia el horizonte", () => thamesState().phase === "ebb", thamesHorizon),
    action("horizon", "E · Contemplar el río después del relato", () => thamesState().phase === "complete", thamesMemory),
  ], "EPÍLOGO / EL TÁMESIS", () => {
    const phase = thamesState().phase;
    if (phase === "returned") return "El Director está al otro extremo, a la derecha · Acércate y pulsa E";
    if (phase === "ebb") return "Mira el horizonte desde el centro de la baranda · E";
    return "Fin del relato · El río sigue vivo · E junto a la baranda para contemplarlo";
  });
  const update = (_frame: Ticker) => { scene.veil.alpha = thamesState().phase === "complete" ? .28 : thamesState().phase === "ebb" ? .2 : .1; };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

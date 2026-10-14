import { canvas, narration } from "@drincs/pixi-vn";
import type { Ticker } from "pixi.js";
import { createOuterStation } from "../../story/heart-of-darkness/createOuterStation";
import { outerRoom, outerPoints, outerAudio, registerOuterAudio } from "../../story/heart-of-darkness/outerStation";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { outerState, outerPosition, isOuterCoast } from "../state/outerStationState";
import { outerSurf, outerWarship, outerLanding, outerWorks, outerGrove, outerAccountant, outerContinue } from "../labels/outerStation.label";
import { attachStationInteractions } from "./attachStationInteractions";

export function showOuterStation() {
  const coast = isOuterCoast(), scene = createOuterStation(coast), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Costa y Estación Exterior · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: outerRoom.walkableArea,
    position: outerPoints.entry }, outerPosition);
  attachMarlowArt(player, ticker, art.setState, () => coast ? "concern" : "alarm");
  const camera = attachWorldCamera(layers.root, ticker, { world: outerRoom.size, viewport: outerRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerOuterAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-outer", listener: () => player.position, layers: outerAudio(coast) });
  const action = (id: keyof typeof outerPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `outer-${id}`, prompt, target: () => outerPoints[id],
    range: 65, enabled, execute: () => narration.call(label, {}) });
  const phase = () => outerState().phase;
  attachStationInteractions(presentation, player, ticker, surface, [
    action("surf", "E · Escuchar la rompiente", () => coast && !outerState().surfObserved, outerSurf),
    action("warship", "E · Observar el buque de guerra", () => phase() === "coast", outerWarship),
    action("landing", "E · Desembarcar en la Estación Exterior", () => phase() === "landfall", outerLanding),
    action("works", "E · Examinar la maquinaria y el camino", () => phase() === "landed", outerWorks),
    action("grove", "E · Acercarte a los trabajadores en la sombra", () => phase() === "works", outerGrove),
    action("accountant", "E · Escuchar al contable", () => phase() === "accounting", outerAccountant),
    action("exit", "E · Continuar el relato con una elipsis", () => phase() === "ready", outerContinue),
  ], "I / COSTA Y ESTACIÓN EXTERIOR", () => {
    switch (phase()) {
      case "coast": return "Escucha la rompiente a la izquierda o mira el buque desde el centro · E";
      case "landfall": return "Más allá de las escalas, un pequeño vapor te lleva a la estación · Extremo derecho · E";
      case "landed": return "Explora la maquinaria junto al camino · Centro · E";
      case "works": return "La sombra de los árboles está a la izquierda · Acércate · E";
      case "grove": return "Bajo los árboles · 1/2 responder · E continuar";
      case "accounting": return "La oficina del contable está a la derecha · E";
      default: return "Termina este episodio desde el extremo derecho · E";
    }
  });
  let elapsed = 0;
  const update = (frame: Ticker) => {
    elapsed += Math.min(frame.deltaMS ?? 0, 100);
    scene.current.x = Math.sin(elapsed / 4000) * 8;
    if (scene.smoke) scene.smoke.alpha = phase() === "landfall" ? .7 : .15;
    // Spatial shade and narrative pressure are reconstructed from the canonical
    // checkpoint; cosmetic water motion need not serialize a playback clock.
    const shade = coast ? 0 : Math.max(0, 1 - Math.abs(player.x - outerPoints.grove.x) / 600);
    scene.veil.alpha = coast ? .035 : .08 + shade * .1;
  };
  ticker.add(update, undefined, -2); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

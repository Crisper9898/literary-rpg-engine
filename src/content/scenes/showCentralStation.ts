import { canvas, narration } from "@drincs/pixi-vn";
import type { Ticker } from "pixi.js";
import { createCentralStation } from "../../story/heart-of-darkness/createCentralStation";
import { centralRoom, centralPoints, centralAudio, registerCentralAudio } from "../../story/heart-of-darkness/centralStation";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { centralState, centralPosition, isCaravan } from "../state/centralStationState";
import { centralVillage, centralRavine, centralCamp, centralCompanion, centralArrival, centralNews, centralWreck, centralContinue } from "../labels/centralStation.label";
import { attachStationInteractions } from "./attachStationInteractions";

export function showCentralStation() {
  const caravan = isCaravan(), scene = createCentralStation(caravan), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Caravana y Estación Central · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: centralRoom.walkableArea, position: centralPoints.entry }, centralPosition);
  attachMarlowArt(player, ticker, art.setState, () => caravan ? "concern" : "alarm");
  const camera = attachWorldCamera(layers.root, ticker, { world: centralRoom.size, viewport: centralRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerCentralAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-central", listener: () => player.position, layers: centralAudio(caravan) });
  const phase = () => centralState().phase;
  const action = (id: keyof typeof centralPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `central-${id}`, prompt, target: () => centralPoints[id],
    range: 65, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("village", "E · Observar la aldea abandonada", () => ["trail", "ravine", "camp"].includes(phase()) && !centralState().villageObserved, centralVillage),
    action("ravine", "E · Seguir el camino y atravesar el barranco", () => phase() === "trail", centralRavine),
    action("camp", "E · Detenerte en el campamento", () => phase() === "ravine", centralCamp),
    action("companion", "E · Acercarte al compañero enfermo", () => phase() === "camp", centralCompanion),
    action("arrival", "E · Entrar en la Estación Central", () => phase() === "approach", centralArrival),
    action("agent", "E · Escuchar la noticia del vapor", () => phase() === "arrived", centralNews),
    action("wreck", "E · Examinar el vapor hundido", () => phase() === "wreck", centralWreck),
    action("exit", "E · Continuar el relato con una elipsis", () => phase() === "ready", centralContinue),
  ], "I / CARAVANA Y ESTACIÓN CENTRAL", () => {
    switch (phase()) {
      case "trail": return "Aldea a la izquierda · Barranco del centro · Acércate y pulsa E";
      case "ravine": return "El campamento está a la izquierda · E";
      case "camp": return "Un compañero enfermo descansa a la derecha · E";
      case "companion": return "Descanso junto al camino · 1/2 responder · E continuar";
      case "approach": return "La marcha llega al río · Extremo derecho · E";
      case "arrived": return "El agente espera junto a los edificios · Centro derecho · E";
      case "wreck": return "El casco hundido está a la izquierda · Acércate · E";
      default: return "Termina la llegada desde el extremo derecho · E";
    }
  });
  let elapsed = 0;
  const update = (frame: Ticker) => {
    elapsed += Math.min(frame.deltaMS ?? 0, 100);
    scene.current.x = Math.sin(elapsed / 4300) * 7;
    const pressure = caravan ? ["camp", "companion", "approach"].includes(phase()) ? .13 : .055 : phase() === "arrived" ? .12 : .19;
    scene.veil.alpha = pressure;
  };
  ticker.add(update, undefined, -2); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

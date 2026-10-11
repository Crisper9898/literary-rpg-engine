import { canvas, narration } from "@drincs/pixi-vn";
import { type Ticker } from "pixi.js";
import { createKurtzIntended } from "../../story/heart-of-darkness/createKurtzIntended";
import { intendedRoom, intendedPoints } from "../../story/heart-of-darkness/kurtzIntended";
import { europeAudio, registerEuropeAudio } from "../../story/heart-of-darkness/europeReturn";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { intendedPosition, intendedState } from "../state/kurtzIntendedState";
import { intendedWindow, intendedPiano, intendedDelivery, intendedConversation, intendedLastWords,
  intendedDeparture, intendedMemory } from "../labels/kurtzIntended.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showKurtzIntended() {
  const scene = createKurtzIntended(), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Visita a la Prometida · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: intendedRoom.walkableArea,
    position: intendedPoints.entry }, intendedPosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: intendedRoom.size, viewport: intendedRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerEuropeAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-intended", listener: () => player.position, layers: europeAudio });
  const action = (id: keyof typeof intendedPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `intended-${id}-${prompt}`, prompt,
    target: () => intendedPoints[id], range: 65, enabled, execute: () => narration.call(label, {}) });
  const phase = (p: ReturnType<typeof intendedState>["phase"]) => () => intendedState().phase === p;
  attachStationInteractions(presentation, player, ticker, surface, [
    action("window", "E · Mirar las tres ventanas", () => !intendedState().windowObserved && intendedState().phase !== "complete", intendedWindow),
    action("piano", "E · Observar el piano cerrado", () => !intendedState().pianoObserved && intendedState().phase !== "complete", intendedPiano),
    action("table", "E · Entregar las cartas a la Prometida", phase("arrived"), intendedDelivery),
    action("intended", "E · Escuchar a la Prometida", phase("delivered"), intendedConversation),
    action("intended", "E · Afrontar la pregunta de las últimas palabras", phase("heard"), intendedLastWords),
    action("door", "E · Despedirse y salir del salón", phase("departure"), intendedDeparture),
    action("door", "E · Recordar lo que no dije", phase("complete"), intendedMemory),
  ], "III / LA ÚLTIMA PALABRA", () => {
    const s = intendedState();
    if (s.phase === "arrived") return "Lleva el paquete a la mesa pequeña, bajo la ventana derecha · E";
    if (["delivered", "speaking"].includes(s.phase)) return "La Prometida espera a la derecha, junto a la chimenea · E";
    if (["heard", "lastWords"].includes(s.phase)) return "Regresa a la Prometida para escuchar su pregunta · E";
    return "La puerta está a la derecha · E para despedirse o recordar";
  });
  const update = (_frame: Ticker) => {
    const p = intendedState().phase;
    scene.packet.visible = !["inactive", "arrived"].includes(p);
    scene.dusk.alpha = ["lastWords", "departure", "complete"].includes(p) ? .24 : p === "heard" ? .18 : .08;
  };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

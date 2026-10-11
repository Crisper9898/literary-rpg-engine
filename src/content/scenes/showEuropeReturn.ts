import { canvas, narration } from "@drincs/pixi-vn";
import { type Ticker } from "pixi.js";
import { createEuropeReturn } from "../../story/heart-of-darkness/createEuropeReturn";
import { europeRoom, europePoints, europeAudio, registerEuropeAudio } from "../../story/heart-of-darkness/europeReturn";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { europeState, europePosition } from "../state/europeReturnState";
import { europeWindow, europePacket, europeReport, europeLetters, europePrepare, europeCompany,
  europeCollect, europeOffer, europeMemory } from "../labels/europeReturn.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { canBeginLegacy } from "../state/kurtzLegacyState";
import { legacyEntry } from "../labels/kurtzLegacy.label";

export function showEuropeReturn() {
  const scene = createEuropeReturn(), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Regreso a Europa · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: europeRoom.walkableArea, position: europePoints.entry }, europePosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: europeRoom.size, viewport: europeRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerEuropeAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-europe-return", listener: () => player.position, layers: europeAudio });
  const action = (id: keyof typeof europePoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0], range = 70): SpatialAction => ({ id: `europe-${id}`, prompt,
    target: () => europePoints[id], range, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("window", "E · Mirar la ciudad desde la ventana", () => !europeState().streetObserved, europeWindow),
    action("packet", "E · Abrir el paquete de Kurtz", () => europeState().phase === "returned", europePacket),
    action("report", "E · Examinar el informe y su posdata", () => europeState().phase === "sorted" && !europeState().reportRead, europeReport),
    action("letters", "E · Separar las cartas privadas", () => europeState().phase === "sorted" && !europeState().lettersRead, europeLetters),
    action("report", "E · Preparar el informe sin la posdata", () => europeState().phase === "sorted" && europeState().reportRead && europeState().lettersRead, europePrepare),
    action("door", "E · Responder al funcionario", () => europeState().phase === "prepared", europeCompany),
    action("report", "E · Recoger sólo el informe", () => europeState().phase === "challenged" && europeState().exchangeSeen, europeCollect),
    action("door", "E · Ofrecer el informe a la Compañía", () => europeState().phase === "carrying", europeOffer),
    action("door", "E · Recibir al primo de Kurtz", canBeginLegacy, legacyEntry),
    action("letters", "E · Recordar lo que queda", () => europeState().phase === "resolved", europeMemory),
  ].map((a, i) => ({ ...a, id: `${a.id}-${i}` })), "III / LA CIUDAD SEPULCRAL", () => {
    const s = europeState();
    if (s.phase === "returned") return "El paquete está en la mesa · Acércate al informe, a la izquierda · E";
    if (s.phase === "sorted") return !s.reportRead ? "Examina el informe, a la izquierda de la mesa · E" :
      !s.lettersRead ? "Las cartas privadas están a la derecha de la mesa · E" : "Separa la posdata del informe · E";
    if (s.phase === "prepared") return "El funcionario espera junto a la puerta, a la derecha · E";
    if (s.phase === "challenged") return "Recoge el informe preparado en la mesa · E";
    if (s.phase === "carrying") return "Regresa a la puerta con el informe · E";
    return "La Compañía se ha retirado · Las cartas permanecen bajo tu custodia";
  });
  const update = (_frame: Ticker) => {
    const s = europeState();
    scene.report.visible = s.phase !== "carrying" && s.phase !== "offered";
    scene.letters.alpha = s.lettersRead ? 1 : .7;
    scene.postscript.visible = ["returned", "sorted"].includes(s.phase);
    scene.pressure.visible = ["prepared", "challenged", "carrying", "offered"].includes(s.phase);
  };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

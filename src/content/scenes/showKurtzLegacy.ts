import { canvas, narration } from "@drincs/pixi-vn";
import { type Ticker } from "pixi.js";
import { createKurtzLegacy, legacyPoints } from "../../story/heart-of-darkness/createKurtzLegacy";
import { europeRoom, europePoints, europeAudio, registerEuropeAudio } from "../../story/heart-of-darkness/europeReturn";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { europePosition } from "../state/europeReturnState";
import { legacyState } from "../state/kurtzLegacyState";
import { legacyCousin, legacyCollectFamily, legacyGiveFamily, legacyJournalist, legacyCollectReport,
  legacyGiveReport, legacyRemaining, legacyMemory } from "../labels/kurtzLegacy.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { canBeginIntended } from "../state/kurtzIntendedState";
import { intendedEntry } from "../labels/kurtzIntended.label";

export function showKurtzLegacy() {
  const scene = createKurtzLegacy(), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "El legado de Kurtz · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: europeRoom.walkableArea, position: europePoints.entry }, europePosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: europeRoom.size, viewport: europeRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerEuropeAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-legacy", listener: () => player.position, layers: europeAudio });
  const action = (id: keyof typeof legacyPoints, prompt: string, phase: ReturnType<typeof legacyState>["phase"],
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `legacy-${phase}`, prompt,
    target: () => legacyPoints[id], range: 65, enabled: () => legacyState().phase === phase, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("door", "E · Preguntar al primo por Kurtz", "cousin", legacyCousin),
    action("family", "E · Recoger las cartas familiares", "familyReady", legacyCollectFamily),
    action("door", "E · Entregar las cartas al primo", "familyCarrying", legacyGiveFamily),
    action("door", "E · Escuchar al periodista", "journalist", legacyJournalist),
    action("report", "E · Recoger el informe para publicación", "reportReady", legacyCollectReport),
    action("door", "E · Entregar el informe al periodista", "reportCarrying", legacyGiveReport),
    action("letters", "E · Examinar el último paquete", "remaining", legacyRemaining),
    action("letters", "E · Recordar las dos visitas", "complete", legacyMemory),
    { id: "intended-visit", prompt: "E · Visitar a la Prometida con el último paquete", target: () => legacyPoints.door,
      range: 65, enabled: canBeginIntended, execute: () => narration.call(intendedEntry, {}) },
  ], "III / LOS DUEÑOS DEL RECUERDO", () => {
    const s = legacyState();
    if (s.phase === "cousin") return "El primo espera junto a la puerta, a la derecha · E";
    if (["cousinAnswered", "familyReady"].includes(s.phase)) return "Separa las cartas familiares en el centro de la mesa · E";
    if (s.phase === "familyCarrying") return "Regresa a la puerta con las cartas familiares · E";
    if (s.phase === "journalist") return "Un periodista aguarda junto a la puerta · E";
    if (["journalistAnswered", "reportReady"].includes(s.phase)) return "Recoge el informe a la izquierda de la mesa · E";
    if (s.phase === "reportCarrying") return "Regresa a la puerta con el informe · E";
    return s.phase === "complete" ? "Lleva el último paquete a la Prometida desde la puerta de la derecha · E" :
      "Las cartas y la fotografía permanecen a la derecha de la mesa · E";
  });
  const update = (_frame: Ticker) => {
    const s = legacyState();
    scene.family.visible = ["cousin", "cousinAnswered", "familyReady"].includes(s.phase);
    scene.familyHeading.visible = scene.family.visible;
    scene.report.visible = !["reportCarrying", "remaining", "complete"].includes(s.phase);
    scene.pressure.visible = !["remaining", "complete"].includes(s.phase);
    scene.pressure.alpha = ["journalist", "journalistAnswered", "reportReady", "reportCarrying"].includes(s.phase) ? .85 : .6;
  };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

import { canvas, narration } from "@drincs/pixi-vn";
import { type Ticker } from "pixi.js";
import { createCompanyCommission } from "../../story/heart-of-darkness/createCompanyCommission";
import { companyRoom, companyPoints, companyAudio, registerCompanyAudio } from "../../story/heart-of-darkness/companyCommission";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { commissionState, commissionPosition } from "../state/companyCommissionState";
import { commissionMap, commissionAppointment, commissionAdmission, commissionContract, commissionExamination,
  commissionFarewell, commissionContinue } from "../labels/companyCommission.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showCompanyCommission() {
  const scene = createCompanyCommission(), { presentation, layers, player, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Encargo de la Compañía · WASD o flechas · E explorar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: companyRoom.walkableArea,
    position: companyPoints.entry }, commissionPosition);
  attachMarlowArt(player, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: companyRoom.size, viewport: companyRoom.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  registerCompanyAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-commission", listener: () => player.position, layers: companyAudio });
  const action = (id: keyof typeof companyPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `commission-${id}-${prompt}`, prompt,
    target: () => companyPoints[id], range: 65, enabled, execute: () => narration.call(label, {}) });
  const phase = () => commissionState().phase;
  attachStationInteractions(presentation, player, ticker, surface, [
    action("recommendation", "E · Leer la recomendación de tu tía", () => phase() === "recommended", commissionAppointment),
    action("map", "E · Examinar el mapa de colores", () => ["recommended", "waiting", "admitted", "contracted"].includes(phase()) && !commissionState().mapObserved, commissionMap),
    action("threshold", "E · Pasar junto a las mujeres que tejen", () => phase() === "waiting", commissionAdmission),
    action("contract", "E · Firmar el contrato", () => phase() === "admitted", commissionContract),
    action("doctor", "E · Presentarte ante el médico", () => phase() === "contracted", commissionExamination),
    action("threshold", "E · Recordar la despedida de tu tía", () => phase() === "cleared", commissionFarewell),
    action("threshold", "E · Continuar hacia el vapor", () => phase() === "ready", commissionContinue),
  ], "I / EL ENCARGO", () => {
    switch (phase()) {
      case "recommended": return "La recomendación está a la derecha de la mesa · El mapa también puede explorarse · E";
      case "waiting": return "Acércate al umbral y a la lana negra, a la derecha · E";
      case "admitted": return "El contrato está a la izquierda de la mesa central · E";
      case "contracted": return "Falta el examen médico · Mesa pequeña, extremo izquierdo · E";
      case "examining": return "El médico espera tu pregunta · 1/2 responder · E continuar";
      case "cleared": return "Regresa al umbral para recordar la despedida · E";
      default: return "El encargo está dispuesto · Continúa desde el umbral derecho · E";
    }
  });
  const update = (_frame: Ticker) => {
    const s = commissionState();
    scene.map.alpha = s.mapObserved ? 1 : .8;
    scene.letters.alpha = s.phase === "recommended" ? 1 : .6;
    scene.pressure.visible = s.phase !== "recommended";
    scene.pressureVeil.alpha = ["examining", "cleared", "ready"].includes(s.phase) ? .13 : .03;
  };
  ticker.add(update, undefined, -2); update({} as Ticker);
  presentation.once("destroyed", () => ticker.remove(update));
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio };
}

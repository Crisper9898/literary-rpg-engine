import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzBreakdown } from "../../story/heart-of-darkness/createKurtzBreakdown";
import { breakdownAudio, breakdownPoints } from "../../story/heart-of-darkness/kurtzBreakdown";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { deckhandRoutine } from "../../story/heart-of-darkness/deckhand";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { journeyRiverLayers } from "../../story/heart-of-darkness/riverParallax";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { registerApproachAudio } from "../../story/heart-of-darkness/approachAudio";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { breakdownState, breakdownPosition, updateBreakdown, canResumeDownstream } from "../state/kurtzBreakdownState";
import { breakdownFailure, breakdownEngine, breakdownForge, breakdownFit, breakdownPapers,
  breakdownPatientAfter, breakdownResume, breakdownAfter } from "../labels/kurtzBreakdown.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { canBeginFinalNight } from "../state/kurtzFinalNightState";
import { finalNightEntry } from "../labels/kurtzFinalNight.label";

export function showKurtzBreakdown() {
  const scene = createKurtzBreakdown(), { presentation, layers, player, marlowVisual, deckhand } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Avería río abajo · WASD o flechas · E interactuar · 1/2 decidir");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: journeyDeck.walkableArea,
    position: { x: 850, y: 800 } }, breakdownPosition);
  attachMarlowArt(player, ticker, marlowVisual.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  // Zero-speed scenery reads a projection of the canonical episode distance from
  // creation, including its initial tile pool/layout after restore. The water
  // keeps its independent motion while the vessel is tied to the island.
  const river = journeyRiverLayers.filter(l => l.id !== "foreground-reeds").map(layer => ({ id: layer.id,
    ...attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.id === "river-current" ? 15 : 0,
      reference: { x: 960, y: 540 } }, layer.id === "river-current" ? undefined : {
        read: () => breakdownState().distance * layer.speed / 30,
        // This projection is display-only; the episode ticker owns its distance.
        write: () => {},
      }) }));
  const texture = createFogTexture();
  const fog = attachParallaxLayer(layers.environment, ticker, camera, { id: "breakdown-mist", period: 1920, speed: 5,
    depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 }, createTile: () => {
      const tile = new Container(), mist = new Sprite({ texture, y: 275, tint: 0x81968c });
      mist.width = 1920; mist.height = 220; tile.addChild(mist); return tile;
    } }); fog.layer.alpha = .2;
  const npc = attachNpcRoutine(deckhand.actor, ticker, deckhandRoutine, state => deckhand.pose(state, ticker.deltaMS));
  registerApproachAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-breakdown", listener: () => player.position, layers: breakdownAudio });
  const action = (id: keyof typeof breakdownPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0], range = 65): SpatialAction => ({ id: `breakdown-${id}`, prompt,
    target: () => breakdownPoints[id], range, enabled, execute: () => narration.call(label, {}) });
  const stopped = () => breakdownState().phase === "stopped" && breakdownState().breakdownSeen;
  const conversation = attachStationInteractions(presentation, player, ticker, surface, [
    { ...action("helm", "E · Continuar hasta la última noche", canBeginFinalNight, finalNightEntry), priority: 2 },
    action("engine", "E · Examinar la pérdida y la biela", () => stopped() && !breakdownState().engineExamined, breakdownEngine),
    action("forge", "E · Avivar la fragua y trabajar la biela", () => stopped() && breakdownState().engineExamined && !breakdownState().repairStarted, breakdownForge),
    action("engine", "E · Volver a montar la biela", () => stopped() && breakdownState().repairProgress === 1 && !breakdownState().rodFitted, breakdownFit),
    action("patient", "E · Escuchar lo que Kurtz quiere confiarte", () => stopped() && !breakdownState().papersResponse, breakdownPapers, 95),
    action("patient", "E · Comprobar cómo sigue Kurtz", () => !!breakdownState().papersResponse && breakdownState().papersSeen, breakdownPatientAfter, 95),
    action("helm", "E · Probar la máquina y retomar el rumbo", canResumeDownstream, breakdownResume),
    action("helm", "E · Sostener el rumbo río abajo", () => breakdownState().phase === "underway" && breakdownState().finalSeen, breakdownAfter),
  ], "III / LA MÁQUINA Y LOS PAPELES", () => {
    const s = breakdownState();
    if (s.phase === "downstream") return "La corriente lleva el vapor · Puedes caminar mientras avanzamos río abajo";
    if (s.phase === "underway") return "La máquina vuelve a golpear · Kurtz sigue vivo y sus papeles están contigo";
    if (!s.engineExamined) return "Estamos amarrados a una isla · Examina el registro en el centro; Kurtz está a la izquierda";
    if (!s.repairStarted) return "La biela necesita calor · Acércate a la pequeña fragua, a la derecha";
    if (s.repairProgress < 1) return `Fragua ${Math.round(s.repairProgress * 100)}% · Cerca avanzas; al apartarte, espera · Kurtz está a la izquierda`;
    if (!s.rodFitted) return "La pieza está lista · Vuelve al registro, en el centro, para montarla";
    return !s.papersSeen ? "Antes de dar vapor, escucha a Kurtz junto a la caseta · E" : "Máquina lista y paquete guardado · Vuelve al puesto junto a la caseta";
  });
  attachActorDepth(layers.actors, ticker, [player, deckhand.actor, scene.patient, scene.papers, scene.engine, scene.forge]);
  const update = (frame: Ticker) => {
    if (!document.hidden) updateBreakdown(frame.elapsedMS ?? frame.deltaMS, player.position);
    const s = breakdownState(), stopped = s.phase === "stopped";
    audio.setLayerVolume("engine", stopped ? 0 : .14); audio.setLayerVolume("bank", stopped ? .038 : .018);
    scene.engine.visible = stopped || s.phase === "underway"; scene.rod.visible = !s.rodFitted;
    scene.forge.visible = s.engineExamined; scene.glow.alpha = s.repairStarted && s.repairProgress < 1 ? 1 : .25;
    scene.papers.visible = stopped && !s.papersResponse;
    scene.patientArt.setState(stopped ? "coughing" : "weak"); marlowVisual.container.tint = 0xabb9a8;
    deckhand.setMood(stopped ? "concern" : "neutral");
    if (stopped) { npc.pause(); deckhand.actor.position.set(1050, 770); npc.face(breakdownPoints.engine); }
    else if (conversation.active()) { npc.pause(); npc.face(player.position); } else npc.resume();
    if (stopped && !s.breakdownSeen && !conversation.active()) void conversation.call(breakdownFailure);
  };
  ticker.add(update, undefined, 0); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio, river, npc, conversation };
}

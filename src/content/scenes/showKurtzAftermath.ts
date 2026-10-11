import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzAftermath } from "../../story/heart-of-darkness/createKurtzAftermath";
import { aftermathPoints, aftermathAudio } from "../../story/heart-of-darkness/kurtzAftermath";
import { journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { journeyArtStage } from "../../story/heart-of-darkness/journeyArtStages";
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
import { aftermathState, aftermathPosition, updateAftermath } from "../state/kurtzAftermathState";
import { aftermathBurial, aftermathPapers, aftermathCare, aftermathWater,
  aftermathRest, aftermathRecovery, aftermathRiver } from "../labels/kurtzAftermath.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";
import { canBeginEurope } from "../state/europeReturnState";
import { europeEntry } from "../labels/europeReturn.label";

export function showKurtzAftermath() {
  const scene = createKurtzAftermath(), { presentation, layers, player, marlowVisual, deckhand } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Después de Kurtz · WASD o flechas · E interactuar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: journeyDeck.walkableArea,
    position: aftermathPoints.entry }, aftermathPosition);
  attachMarlowArt(player, ticker, marlowVisual.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const river = journeyRiverLayers.filter(l => l.id !== "foreground-reeds").map(layer => ({ id: layer.id,
    ...attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.id === "river-current" ? 15 : 0,
      reference: { x: 960, y: 540 } }, layer.id === "river-current" ? undefined : {
        read: () => aftermathState().distance * layer.speed / 30, write: () => {},
      }) }));
  const texture = createFogTexture();
  const fog = [{ parent: layers.environment, y: 275, height: 220, speed: 5 },
    { parent: layers.foreground, y: 480, height: 390, speed: 3 }].map((plane, index) =>
    attachParallaxLayer(plane.parent, ticker, camera, { id: `aftermath-mist-${index}`, period: 1920, speed: plane.speed,
      depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 }, createTile: () => {
        const tile = new Container(), mist = new Sprite({ texture, y: plane.y, tint: 0x92a3a7 });
        mist.width = 1920; mist.height = plane.height; tile.addChild(mist); return tile;
      } }));
  const npc = attachNpcRoutine(deckhand.actor, ticker, deckhandRoutine, s => deckhand.pose(s, ticker.deltaMS));
  registerApproachAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-aftermath",
    listener: () => player.position, layers: aftermathAudio });
  const action = (id: keyof typeof aftermathPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0], range = 65): SpatialAction => ({ id: `aftermath-${id}`, prompt,
    target: () => aftermathPoints[id], range, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    { ...action("shelter", "E · Regresar a Europa con los papeles", canBeginEurope, europeEntry), id: "europe-entry", priority: 2 },
    action("burial", "E · Escuchar la noticia del entierro", () => aftermathState().phase === "morning", aftermathBurial),
    action("papers", "E · Resguardar los papeles", () => aftermathState().phase === "bereaved", aftermathPapers),
    action("care", "E · Buscar apoyo en la barandilla", () => aftermathState().phase === "fever" && !aftermathState().response, aftermathCare),
    action("water", "E · Buscar agua junto a la caseta", () => aftermathState().phase === "fever" && aftermathState().response === "alone" &&
      aftermathState().careSeen && !aftermathState().waterReceived, aftermathWater),
    action("shelter", "E · Resguardarte junto a la caseta", () => aftermathState().phase === "fever" && aftermathState().careSeen &&
      aftermathState().waterReceived, aftermathRest),
    action("recovery", "E · Volver a mirar la corriente", () => aftermathState().phase === "recovering", aftermathRecovery),
    { ...action("recovery", "E · Escuchar la corriente", () => aftermathState().phase === "survived", aftermathRiver), id: "aftermath-river" },
  ], "III / DESPUÉS DE LA VOZ", () => {
    const s = aftermathState();
    if (s.phase === "morning") return "Escucha a los hombres desde la barandilla, a la derecha · E";
    if (s.phase === "bereaved") return "Los papeles esperan junto a la caseta, a la izquierda · Resguárdalos · E";
    if (s.phase === "recovering") return "La corriente sigue · Acércate de nuevo a la barandilla, a la derecha";
    if (s.phase === "survived") return "Has sobrevivido · Los papeles y las últimas palabras siguen contigo";
    if (!s.response) return "Busca apoyo junto al marinero, a la derecha · E";
    if (!s.waterReceived) return "El agua está junto a la caseta, a la izquierda · E";
    return "Busca resguardo junto a la caseta, a la izquierda · E";
  });
  attachActorDepth(layers.actors, ticker, [player, deckhand.actor, scene.papers]);
  let haze = ["fever", "resting"].includes(aftermathState().phase) ? .23 : .08;
  const update = (frame: Ticker) => {
    if (!document.hidden) updateAftermath(frame.elapsedMS ?? frame.deltaMS);
    const s = aftermathState(), ill = ["fever", "resting"].includes(s.phase);
    scene.visual.setProgress(journeyArtStage(s.progress)); scene.papers.visible = !s.papersSecured;
    fog[0].layer.alpha = .22;
    const dt = Math.max(0, Math.min(50, frame.deltaMS || 0));
    haze += ((ill ? .23 : .08) - haze) * (1 - Math.exp(-dt / 1100)); fog[1].layer.alpha = haze;
    marlowVisual.container.tint = ill ? 0xabb1ad : 0xd4d0b6;
    deckhand.setMood("concern");
  };
  ticker.add(update, undefined, 0); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, river, audio, npc };
}

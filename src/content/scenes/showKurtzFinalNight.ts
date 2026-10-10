import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzFinalNight } from "../../story/heart-of-darkness/createKurtzFinalNight";
import { finalNightPoints, finalNightAudio } from "../../story/heart-of-darkness/kurtzFinalNight";
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
import { finalNightState, finalNightPosition, updateFinalNight } from "../state/kurtzFinalNightState";
import { finalNightCandle, finalNightVigil, finalNightWords, finalNightLeave,
  finalNightAnnouncement, finalNightRiver, finalNightAfter } from "../labels/kurtzFinalNight.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showKurtzFinalNight() {
  const scene = createKurtzFinalNight(), { presentation, layers, player, marlowVisual, deckhand } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Última noche · WASD o flechas · E interactuar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(player, ticker, surface, { ...marlowMovement, bounds: journeyDeck.walkableArea,
    position: { x: 850, y: 800 } }, finalNightPosition);
  attachMarlowArt(player, ticker, marlowVisual.setState, () => finalNightState().wordsHeard ? "alarm" : "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: journeyDeck.size, viewport: journeyDeck.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const river = journeyRiverLayers.filter(l => l.id !== "foreground-reeds").map(layer => ({ id: layer.id,
    ...attachParallaxLayer(layers.environment, ticker, camera, { ...layer, speed: layer.id === "river-current" ? 15 : 0,
      reference: { x: 960, y: 540 } }, layer.id === "river-current" ? undefined : {
        read: () => finalNightState().distance * layer.speed / 30, write: () => {},
      }) }));
  const texture = createFogTexture();
  const fog = attachParallaxLayer(layers.environment, ticker, camera, { id: "final-night-mist", period: 1920, speed: 5,
    depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 }, createTile: () => {
      const tile = new Container(), mist = new Sprite({ texture, y: 275, tint: 0x72838d });
      mist.width = 1920; mist.height = 220; tile.addChild(mist); return tile;
    } });
  const npc = attachNpcRoutine(deckhand.actor, ticker, deckhandRoutine, s => deckhand.pose(s, ticker.deltaMS));
  registerApproachAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-final-night",
    listener: () => player.position, layers: finalNightAudio });
  const action = (id: keyof typeof finalNightPoints, prompt: string, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0], range = 65): SpatialAction => ({ id: `final-night-${id}`, prompt,
    target: () => finalNightPoints[id], range, enabled, execute: () => narration.call(label, {}) });
  attachStationInteractions(presentation, player, ticker, surface, [
    action("candle", "E · Tomar una vela", () => finalNightState().phase === "evening" && finalNightState().candle === "rack", finalNightCandle),
    action("patient", "E · Acercar la vela a Kurtz", () => finalNightState().candle === "held", finalNightVigil, 95),
    action("patient", "E · Quedarte a escuchar", () => finalNightState().phase === "vigil" && finalNightState().vigilSeen, finalNightWords, 95),
    action("patient", "E · Apagar la vela y salir a cubierta", () => finalNightState().phase === "words" && finalNightState().wordsSeen, finalNightLeave, 95),
    action("crew", "E · Acercarte a la tripulación", () => finalNightState().phase === "left", finalNightAnnouncement),
    action("crew", "E · Permanecer en cubierta", () => finalNightState().phase === "confirmed" && finalNightState().finalSeen, finalNightAfter),
    action("river", "E · Mirar las orillas que se alejan", () => true, finalNightRiver),
  ], "III / UNA VELA EN LA OSCURIDAD", () => {
    const s = finalNightState();
    if (s.candle === "rack") return "Una vela espera junto a la caseta · Llévala hasta Kurtz, a la izquierda";
    if (s.candle === "held") return "Protege la llama y acércate a Kurtz · El viaje continúa";
    if (s.phase === "left") return "La vela está apagada · Acércate a los hombres de cubierta, a la derecha";
    if (s.phase === "confirmed") return "La voz se ha ido · La corriente sigue y los papeles permanecen contigo";
    return s.wordsSeen ? "Apaga la vela junto a Kurtz antes de retirarte · E" : "La luz está a su lado · Puedes quedarte a escuchar · E";
  });
  attachActorDepth(layers.actors, ticker, [player, deckhand.actor, scene.patient, scene.candleStand]);
  const update = (frame: Ticker) => {
    if (!document.hidden) updateFinalNight(frame.elapsedMS ?? frame.deltaMS);
    const s = finalNightState(), lit = s.candle === "held" || s.candle === "bedside";
    scene.visual.setProgress(journeyArtStage(s.progress)); fog.layer.alpha = .2 + (s.progress - .48) * .25;
    scene.candle.visible = s.candle !== "out"; scene.light.visible = lit; scene.flame.visible = lit;
    scene.candle.position.set(s.candle === "held" ? player.x + 45 : s.candle === "bedside" ? 705 : finalNightPoints.candle.x,
      s.candle === "held" ? player.y - 88 : s.candle === "bedside" ? 660 : finalNightPoints.candle.y);
    // Carried light belongs in front of its bearer; a bedside light belongs to the stand's ground depth.
    scene.candle.zIndex = s.candle === "held" ? player.y + .1 : s.candle === "bedside" ? 730.1 : finalNightPoints.candle.y;
    scene.candleStand.visible = s.candle === "bedside";
    scene.patient.visible = s.phase !== "left" && s.phase !== "confirmed";
    const lastWordsOpen = narration.labels.opened.some(x => x.label === "journey-station-final-night-words");
    scene.patientArt.setState(lastWordsOpen ? "intense" : s.phase === "vigil" ? "coughing" : "weak");
    scene.patientArt.container.tint = s.candle === "bedside" ? 0xe5c497 : 0x9daeb7;
    deckhand.setMood("concern");
  };
  ticker.add(update, undefined, 0); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, river, audio, npc };
}

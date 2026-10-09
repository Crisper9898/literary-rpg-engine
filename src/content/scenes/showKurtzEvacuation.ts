import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzEvacuation } from "../../story/heart-of-darkness/createKurtzEvacuation";
import { evacuationAudio, evacuationPoints } from "../../story/heart-of-darkness/kurtzEvacuation";
import { revelationsWalkable } from "../../story/heart-of-darkness/stationRevelations";
import { registerStationAudio } from "../../story/heart-of-darkness/stationAudio";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { stationPosition } from "../state/innerStationState";
import { evacuationState, morningBlend, updateEvacuationMorning, canTransferCot, cotAtLanding,
  updateCotTransfer, finishEvacuation } from "../state/kurtzEvacuationState";
import { evacuationPatient, evacuationDecision, evacuationBindings, evacuationLanding, evacuationCargo,
  evacuationLift, evacuationReady, evacuationAfter } from "../labels/kurtzEvacuation.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showKurtzEvacuation() {
  const scene = createKurtzEvacuation(), { presentation, layers, actor, art, cot } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Preparar la evacuación · WASD o flechas · E interactuar · 1/2 decidir");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(actor, ticker, surface, { ...marlowMovement, bounds: revelationsWalkable,
    position: evacuationPoints.start }, stationPosition);
  attachMarlowArt(actor, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: { width: 1920, height: 1080 }, viewport: { width: 1920, height: 1080 },
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const morning = attachAtmosphere(presentation, ticker, { checkpoint: morningBlend,
    progress: () => evacuationState().morningMS / 3000,
    keyframes: [{ progress: 0, values: { blend: 0 } }, { progress: 1, values: { blend: 1 } }],
    apply: s => { scene.night.container.alpha = 1 - s.blend; } });
  const texture = createFogTexture();
  const fog = [0, 1].map(i => attachParallaxLayer(i ? layers.foreground : layers.environment, ticker, camera, {
    id: `evacuation-mist-${i}`, period: 1920, speed: i ? 8 : 4, depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 },
    createTile: () => { const tile = new Container(); const mist = new Sprite({ texture, y: i ? 735 : 455, tint: 0x819592 });
      mist.width = 1920; mist.height = i ? 145 : 215; tile.addChild(mist); return tile; },
  }).layer);
  registerStationAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-evacuation", listener: () => actor.position,
    layers: evacuationAudio.map(layer => layer.id === "wood" ? { ...layer, enabled: () =>
      narration.labels.opened.some(({ label }) => String(label) === "journey-station-evacuation-landing") } : layer) });
  const preparing = () => evacuationState().phase === "preparing";
  const action = (id: keyof typeof evacuationPoints, prompt: string, range: number, enabled: () => boolean,
    label: Parameters<typeof narration.call>[0]): SpatialAction => ({ id: `evacuation-${id}`, prompt,
    target: () => evacuationPoints[id], range, enabled, execute: () => narration.call(label, {}) });
  const actions: SpatialAction[] = [
    action("patient", "E · Comprobar cómo está Kurtz", 120, () => preparing() && !evacuationState().patientSeen, evacuationPatient),
    action("priority", "E · Decidir qué debe pasar primero", 95, () => preparing() && evacuationState().patientSeen && !evacuationState().priority, evacuationDecision),
    action("bindings", "E · Asegurar las ligaduras de la camilla", 75, () => preparing() && !!evacuationState().priority && !evacuationState().cotSecured, evacuationBindings),
    action("landing", "E · Despejar y comprobar los tablones", 85, () => preparing() && !!evacuationState().priority && !evacuationState().landingClear, evacuationLanding),
    action("cargo", "E · Hacer pasar el primer atado de marfil", 80, () => preparing() && evacuationState().priority === "cargo" && !evacuationState().cargoFirst, evacuationCargo),
    { id: "evacuation-lift", prompt: "E · Dar la señal para alzar la camilla", range: 130, target: () => evacuationState().cot,
      enabled: canTransferCot, execute: () => narration.call(evacuationLift, {}) },
    { id: "evacuation-receive", prompt: "E · Recibir la camilla en el desembarcadero", range: 110,
      target: () => evacuationPoints.landing, enabled: () => evacuationState().phase === "transfer" && cotAtLanding(),
      execute: () => { if (finishEvacuation(actor.position)) return narration.call(evacuationReady, {}); } },
    { id: "evacuation-after", prompt: "E · Permanecer junto a Kurtz", range: 130, target: () => evacuationState().cot,
      enabled: () => evacuationState().phase === "ready", execute: () => narration.call(evacuationAfter, {}) },
  ];
  const conversation = attachStationInteractions(presentation, actor, ticker, surface, actions, "III / LO QUE PESA", () => {
    const s = evacuationState();
    if (s.phase === "morning") return "Amanece en la estación · El cuerpo de Kurtz apenas ha descansado";
    if (s.phase === "ready") return "Kurtz está listo para embarcar · La corriente espera";
    if (s.phase === "transfer") return Math.hypot(actor.x - s.cot.x, actor.y - s.cot.y) > 200 ?
      "Los porteadores se han detenido · Vuelve a la camilla" : "Guía la camilla hacia los tablones de la izquierda · Mantente cerca y delante";
    if (!s.patientSeen) return "La tos llega desde la camilla · Comprueba cómo está Kurtz";
    if (!s.priority) return "Desde abajo exigen la carga · Decide el orden junto al marfil";
    return !s.cotSecured ? "Las ligaduras necesitan sostener su peso · Revisa la camilla" : !s.landingClear ?
      "El paso hacia el vapor aún tiene una cuerda suelta" : s.priority === "cargo" && !s.cargoFirst ?
      "Has elegido la carga primero · El atado sigue junto a la cerca" : "La camilla y los tablones están preparados · Vuelve a Kurtz";
  });
  attachActorDepth(layers.actors, ticker, [actor, cot.group, ...scene.evidence.map(item => item.group)]);
  let clock = 0, previousX = evacuationState().cot.x;
  const update = (frame: Ticker) => {
    if (!document.hidden) { updateEvacuationMorning(frame.elapsedMS ?? frame.deltaMS); updateCotTransfer(actor.position, frame.deltaMS); }
    clock += Math.min(50, frame.deltaMS || 0);
    const s = evacuationState(), moving = Math.abs(s.cot.x - previousX) > .001;
    cot.group.position.copyFrom(s.cot); cot.art.setState(s.pose);
    cot.art.container.y = -65 + (moving ? Math.sin(clock / 440) * 1.4 : s.pose === "coughing" ? Math.sin(clock / 120) * 1.5 : 0);
    cot.bearers.forEach((body, i) => { body.y = (i ? 4 : -10) + (moving ? Math.sin(clock / 440 + i * Math.PI) * 2 : 0); });
    previousX = s.cot.x; scene.rope.visible = !s.landingClear;
    // A smaller opaque remainder retains its contact point; removed cargo must not look spectral.
    scene.evidence.find(item => item.id === "ivory")!.group.scale.set(s.cargoFirst ? .65 : 1);
    fog[0].alpha = .16; fog[1].alpha = .045;
    art.container.tint = 0xb4c5bf;
    const closePatient = conversation.active() && narration.labels.opened.some(({ label }) => String(label) === "journey-station-evacuation-patient");
    camera.setZoom(closePatient ? 1.1 : 1); camera.focus(closePatient ? { x: 1060, y: 560 } : { x: 960, y: 540 });
  };
  ticker.add(update, undefined, -4); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio, morning, conversation };
}

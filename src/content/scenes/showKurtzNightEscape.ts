import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createKurtzNightEscape } from "../../story/heart-of-darkness/createKurtzNightEscape";
import { nightAudioLayers, nightClearingExit, nightRest, nightTracePoints } from "../../story/heart-of-darkness/kurtzNightEscape";
import { revelationsWalkable } from "../../story/heart-of-darkness/stationRevelations";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { registerStationAudio } from "../../story/heart-of-darkness/stationAudio";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { stationPosition, russianMood } from "../state/innerStationState";
import { nightState, nightAtmosphere, nightForestBlend, updateNight, updateNightEscort } from "../state/kurtzNightEscapeState";
import { nightAbsence, nightTraceLabels, nightEnterClearing, nightConfrontation, nightReturn, nightAfterReturn } from "../labels/kurtzNightEscape.label";
import { canBeginEvacuation } from "../state/kurtzEvacuationState";
import { evacuationMorning } from "../labels/kurtzEvacuation.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showKurtzNightEscape() {
  const scene = createKurtzNightEscape(); const { presentation, layers, actor, art } = scene;
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Fuga nocturna · WASD o flechas · E observar y conversar · 1/2 responder");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(actor, ticker, surface, { ...marlowMovement, bounds: revelationsWalkable, position: nightRest }, stationPosition);
  attachMarlowArt(actor, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: { width: 1920, height: 1080 }, viewport: { width: 1920, height: 1080 },
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const night = attachAtmosphere(presentation, ticker, { checkpoint: nightAtmosphere,
    progress: () => nightState().duskMS / 8000,
    keyframes: [{ progress: 0, values: { blend: 0 } }, { progress: 1, values: { blend: 1 } }],
    apply: s => { scene.night.container.alpha = s.blend; } });
  const forest = attachAtmosphere(presentation, ticker, { checkpoint: nightForestBlend,
    progress: () => ["clearing", "return"].includes(nightState().phase) ? 1 : 0,
    keyframes: [{ progress: 0, values: { blend: 0 } }, { progress: 1, values: { blend: 1 } }],
    apply: s => { scene.forest.container.alpha = s.blend; } });
  const texture = createFogTexture();
  const mist = [0, 1].map(i => attachParallaxLayer(i ? layers.foreground : layers.environment, ticker, camera, {
    id: `night-mist-${i}`, period: 1920, speed: i ? 9 : 4, depth: { x: .4, y: 1 }, reference: { x: 960, y: 540 },
    createTile: () => { const tile = new Container(); const image = new Sprite({ texture, y: i ? 740 : 470, tint: 0x687e90 });
      image.width = 1920; image.height = i ? 145 : 220; tile.addChild(image); return tile; },
  }).layer);
  registerStationAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-kurtz-night", listener: () => actor.position,
    layers: nightAudioLayers(() => narration.labels.opened.some(({ label }) => String(label) === "journey-station-night-confrontation")) });
  const actions: SpatialAction[] = [
    { id: "evacuation-start", prompt: "E · Preparar la salida al amanecer", target: () => ({ x: 420, y: 745 }), range: 85,
      enabled: canBeginEvacuation, execute: () => narration.call(evacuationMorning, {}) },
    { id: "night-absence", prompt: "E · Examinar el descanso vacío", target: () => nightRest, range: 110,
      enabled: () => nightState().phase === "search", execute: () => narration.call(nightAbsence, {}) },
    ...Object.entries(nightTracePoints).map(([id, item]) => ({ id: `night-trace-${id}`, prompt: item.prompt,
      target: () => item.position, range: 62, enabled: () => nightState().phase === "trail" &&
        Object.keys(nightTracePoints)[nightState().traces.length] === id,
      execute: () => narration.call(nightTraceLabels[id as keyof typeof nightTraceLabels], {}) })),
    { id: "night-clearing", prompt: "E · Cruzar entre los árboles", target: () => nightClearingExit, range: 65,
      enabled: () => nightState().phase === "trail" && nightState().traces.length === 3,
      execute: () => narration.call(nightEnterClearing, {}) },
    { id: "night-kurtz", prompt: "E · Acercarse a Kurtz sin alzar la voz", target: () => nightState().escort, range: 140,
      enabled: () => nightState().phase === "clearing" && forest.progress > .95,
      execute: () => narration.call(nightConfrontation, {}) },
    { id: "night-return", prompt: "E · Volver con Kurtz a la estación", target: () => nightClearingExit, range: 65,
      enabled: () => nightState().phase === "return" && Math.hypot(nightState().escort.x - 1640, nightState().escort.y - 800) <= 100,
      execute: () => narration.call(nightReturn, {}) },
    { id: "night-after", prompt: "E · Escuchar a Kurtz tras el regreso", target: () => nightRest, range: 130,
      enabled: () => nightState().phase === "returned" && forest.progress < .05,
      execute: () => narration.call(nightAfterReturn, {}) },
  ];
  const conversation = attachStationInteractions(presentation, actor, ticker, surface, actions, "III / LA NOCHE DE KURTZ", () => {
    const s = nightState(); return s.phase === "dusk" ? "La estación se apaga · Puedes caminar mientras cae la noche" :
      s.phase === "search" ? "Una manta vacía bajo la luz fría" : s.phase === "trail" ? "El rastro continúa hacia los árboles · Sin despertar a nadie" :
      s.phase === "clearing" ? "Hay alguien entre las luces · Acércate despacio" : s.phase === "return" ?
      Math.hypot(actor.x - s.escort.x, actor.y - s.escort.y) > 180 ? "Kurtz se ha detenido · Vuelve a su lado" :
      "Sostén el paso de Kurtz · Camina junto a él hacia la salida de la derecha" : "La estación vuelve a callarse · Kurtz ha regresado";
  });
  attachActorDepth(layers.actors, ticker, [actor, scene.russian, scene.bed.group, scene.resting.group, scene.kurtz.group,
    ...scene.evidence.map(item => item.group), ...Object.values(scene.traces).map(item => item.group)]);
  let clock = 0;
  const update = (frame: Ticker) => {
    if (!document.hidden) { updateNight(frame.elapsedMS ?? frame.deltaMS); updateNightEscort(actor.position, frame.deltaMS); }
    clock += Math.min(50, frame.deltaMS || 0);
    const s = nightState(), n = night.state.blend, f = forest.state.blend, returned = s.phase === "returned";
    const here = 1 - f;
    scene.russian.position.set(1020, 745); scene.russianVisual.setState(russianMood()); scene.russian.alpha = (1 - n) * here;
    scene.russian.visible = scene.russian.alpha > .01;
    scene.resting.group.alpha = returned ? here : Math.max(0, 1 - n * 1.4);
    scene.resting.group.visible = scene.resting.group.alpha > .01;
    scene.resting.art.setState(returned && s.choice === "challenge" && conversation.active() ? "intense" : "weak");
    scene.bed.group.alpha = (1 - scene.resting.group.alpha) * here;
    for (const item of scene.evidence) { item.group.alpha = here * (1 - n * .28); item.group.visible = here > .01; }
    for (const [id, item] of Object.entries(scene.traces)) {
      item.group.alpha = n * here; item.group.visible = s.absence && here > .01;
      item.art.container.tint = id === Object.keys(nightTracePoints)[s.traces.length] ? 0xb5c7c4 : 0x667f84;
    }
    scene.kurtz.group.visible = f > .02;
    scene.kurtz.group.alpha = f; scene.kurtz.group.position.copyFrom(s.escort); scene.kurtz.art.setState(s.pose);
    scene.kurtz.art.container.scale.x = s.phase === "return" ? -1 : 1;
    scene.kurtz.art.container.rotation = s.phase === "return" ? Math.sin(clock / 520) * .009 : 0;
    scene.followers.container.alpha = f * (s.pose === "dominant" ? .8 : .48);
    scene.followers.container.x = 1410 + Math.sin(clock / 1800) * 3;
    scene.distantLight.alpha = f * (.6 + Math.sin(clock / 1200) * .12);
    mist[0].alpha = .13 + n * .08; mist[1].alpha = .055 + f * .025;
    art.container.tint = 0xa9bac2;
    camera.setZoom(conversation.active() && s.phase === "clearing" ? 1.12 : 1);
    camera.focus(conversation.active() && s.phase === "clearing" ? { x: 1060, y: 570 } : { x: 960, y: 540 });
    audio.setLayerVolume("water", s.phase === "clearing" || s.phase === "return" ? .003 : returned ? .009 : .014 * (1 - n * .5));
    audio.setLayerVolume("canopy", returned ? .012 : .023 * (1 - n * .35));
  };
  ticker.add(update, undefined, -4); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { ...scene, camera, audio, atmosphere: night, forest, conversation };
}

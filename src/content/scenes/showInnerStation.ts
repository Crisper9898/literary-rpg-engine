import { canvas, narration } from "@drincs/pixi-vn";
import { Container, Sprite, type Ticker } from "pixi.js";
import { createInnerStation } from "../../story/heart-of-darkness/createInnerStation";
import { innerStation } from "../../story/heart-of-darkness/innerStation";
import { registerStationAudio } from "../../story/heart-of-darkness/stationAudio";
import { createKurtzStationAudio } from "../../story/heart-of-darkness/kurtzAudio";
import { kurtzNearby } from "../../story/heart-of-darkness/kurtzIntroduction";
import { kurtzIntroduction, kurtzStage, kurtzPosition, kurtzFirstResponse } from "../state/kurtzIntroductionState";
import { kurtzPreparation, kurtzFirstExchange, kurtzFollowup, kurtzRussianAfter, kurtzInspectLabels } from "../labels/kurtzIntroduction.label";
import { attachKurtzPresentation } from "./attachKurtzPresentation";
import { createFogTexture } from "../../story/heart-of-darkness/createFogTexture";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { marlowMovement } from "../../story/heart-of-darkness/deck";
import { stationPosition, stationAtmosphere, stationPressure, stationFlag, canMeetRussian,
  russianMood, stationEvent, startStationEvent, updateStationEvent, stationReady } from "../state/innerStationState";
import { setJourneySpace } from "../state/woodStopState";
import { showJourneySpace } from "./journeyDeck";
import { stationInspectLabels, russianConversation, russianFollowup, stationClosing, stationCreakLine } from "../labels/innerStation.label";
import { attachStationInteractions } from "./attachStationInteractions";
import type { SpatialAction } from "../../engine/interaction/SpatialInteractions";

export function showInnerStation() {
  const { presentation, layers, actor, art, russian, russianVisual, background } = createInnerStation();
  canvas.layers.add("journey-inner-station", presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement, ticker = canvas.app.ticker;
  surface.tabIndex = 0; surface.setAttribute("aria-label", "Estación Interior · WASD o flechas · E explorar · 1/2 conversar");
  attachDisplayResolution(presentation, canvas.app.renderer, surface);
  attachPlayerMovement(actor, ticker, surface, { ...marlowMovement, bounds: innerStation.walkableArea,
    position: innerStation.anchors.arrival }, stationPosition);
  attachMarlowArt(actor, ticker, art.setState, () => "concern");
  const camera = attachWorldCamera(layers.root, ticker, { world: innerStation.size, viewport: innerStation.size,
    position: { x: 960, y: 540 }, zoom: 1, smoothing: 6 });
  const npc = attachNpcRoutine(russian, ticker, { bounds: innerStation.walkableArea, position: innerStation.anchors.russian,
    footprintRadius: 20, speed: 35, stops: [{ position: innerStation.anchors.russian, idleMS: 3000, activity: "watch-house" },
      { position: { x: 1165, y: 770 }, idleMS: 3500, activity: "welcome" }] }, state => {
    russianVisual.setState(stationEvent().remainingMS > 0 ? "nervous" : russianMood());
    russianVisual.container.scale.x = state.facing.x > .1 ? -1 : 1;
    russianVisual.container.rotation = state.isMoving ? Math.sin(state.elapsedMS / 160) * .015 : 0;
  });
  const texture = createFogTexture();
  const fog = [{ parent: layers.environment, y: 360, height: 220, speed: 5 },
    { parent: layers.foreground, y: 590, height: 230, speed: 12 }].map((plane, index) =>
    attachParallaxLayer(plane.parent, ticker, camera, { id: `station-mist-${index}`, period: 1920, speed: plane.speed,
      depth: { x: .3, y: 1 }, reference: { x: 960, y: 540 }, createTile: () => {
        const tile = new Container(), mist = new Sprite({ texture, y: plane.y, tint: 0x829d9a });
        mist.width = 1920; mist.height = plane.height; tile.addChild(mist); return tile;
      } }).layer);
  const atmosphere = attachAtmosphere(presentation, ticker, { progress: stationPressure, checkpoint: stationAtmosphere,
    keyframes: [{ progress: 0, values: { mist: .16, shade: .03 } }, { progress: .6, values: { mist: .38, shade: .1 } },
      { progress: 1, values: { mist: .52, shade: .17 } }],
    apply: state => { fog[0].alpha = state.mist; fog[1].alpha = state.mist * .3;
      const v = Math.round(255 * (1 - state.shade)); layers.environment.tint = (v << 16) | (v << 8) | v; } });
  registerStationAudio();
  const audio = attachSpatialAudio(presentation, ticker, surface, { namespace: "journey-inner-station", listener: () => actor.position,
    layers: createKurtzStationAudio(() => stationEvent().remainingMS > 0) });
  const kurtz = attachKurtzPresentation({ actors: layers.actors, environment: layers.environment,
    foreground: layers.foreground, texture, camera, audio, russian });
  attachActorDepth(layers.actors, ticker, [actor, russian, kurtz.group]);
  const actions: SpatialAction[] = (Object.keys(stationInspectLabels) as (keyof typeof innerStation.anchors)[]).map(id => ({
    id, prompt: `E · Observar ${id === "planks" ? "los tablones" : id === "fence" ? "la cerca caída" : id === "grass" ? "las huellas en la hierba" : "la casa de la colina"}`,
    target: () => innerStation.anchors[id], range: 105,
    execute: () => narration.call(stationInspectLabels[id], {}),
  }));
  actions.push({ id: "russian", prompt: "E · Hablar con el ruso", target: () => russian.position, range: 105, priority: 2,
    enabled: () => canMeetRussian(), execute: () => narration.call(kurtzFirstResponse() ? kurtzRussianAfter :
      stationFlag("russianComplete") ? russianFollowup : russianConversation, {}) },
    { id: "kurtz-path", prompt: "E · Prepararse para conocer a Kurtz", target: () => ({ x: 1520, y: 755 }), range: 85, priority: 3,
      enabled: () => stationReady() && !stationFlag("kurtzEncounterPrepared"), execute: () => narration.call(stationClosing, {}) },
    { id: "vapor", prompt: "E · Volver al vapor amarrado", target: () => innerStation.anchors.arrival, range: 80,
      execute: async () => { setJourneySpace("station-arrival"); await showJourneySpace(); } });
  actions.push({ id: "kurtz-introduction", prompt: "E · Esperar la llegada de Kurtz", target: () => ({ x: 1520, y: 755 }),
    range: 85, priority: 4, enabled: () => stationReady() && stationFlag("kurtzEncounterPrepared") && !kurtzIntroduction().activated,
    execute: () => narration.call(kurtzPreparation, {}) },
    { id: "kurtz", prompt: "E · Hablar con Kurtz", target: kurtzPosition, range: 110, priority: 4,
      enabled: () => kurtzStage() === "present", execute: () => narration.call(kurtzFirstResponse() ? kurtzFollowup : kurtzFirstExchange, {}) });
  for (const [id, item] of Object.entries(kurtzNearby)) actions.push({ id: `kurtz-${id}`, prompt: item.prompt,
    target: () => item.position, range: 75, priority: 3, enabled: () => kurtzStage() === "present",
    execute: () => narration.call(kurtzInspectLabels[id], {}) });
  const conversation = attachStationInteractions(presentation, actor, ticker, surface, actions, "II / LA ESTACIÓN INTERIOR",
    () => kurtzStage() === "present" ? "Kurtz está aquí · E conversar / observar · WASD caminar" :
      kurtzIntroduction().activated ? "Espera mirando el sendero · Puedes caminar y observar" :
      stationFlag("kurtzEncounterPrepared") ? "Acércate al sendero · E esperar a Kurtz" :
      canMeetRussian() ? "Una figura remendada espera junto al sendero · E" : "Explora la orilla: tablones, cerca, huellas y colina · E");
  let wasTalking = false;
  const update = (frame: Ticker) => {
    if (canMeetRussian()) startStationEvent();
    updateStationEvent(frame.deltaMS);
    const visible = canMeetRussian() || stationFlag("russianMet");
    russian.visible = visible;
    if (!visible || conversation.active() || kurtzIntroduction().activated) { npc.pause();
      if (visible) npc.face(kurtzIntroduction().activated ? kurtzPosition() : actor.position); } else npc.resume();
    const talking = conversation.active() && stationFlag("russianMet");
    if (!kurtzIntroduction().activated && talking !== wasTalking) {
      camera.setZoom(talking ? 1.12 : 1); camera.focus({ x: 1020, y: 540 }); wasTalking = talking; }
    kurtz.update(frame.elapsedMS ?? frame.deltaMS, conversation.active());
    if (stationEvent().occurred && !stationFlag("stationCreakSeen") && !conversation.active()) void conversation.call(stationCreakLine);
    const pulse = stationEvent().remainingMS / 2400;
    fog[1].tint = pulse > 0 ? 0x607b79 : 0xffffff;
  };
  ticker.add(update, undefined, -2); update({ deltaMS: 0 } as Ticker);
  presentation.once("destroyed", () => { ticker.remove(update); texture.destroy(true); });
  surface.focus({ preventScroll: true }); return { actor, russian, camera, npc, atmosphere, audio, background, kurtz };
}

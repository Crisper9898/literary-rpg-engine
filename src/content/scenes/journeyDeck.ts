import { canvas } from "@drincs/pixi-vn";
import { Container } from "pixi.js";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";
import { journeyCamera, journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { deckhandRoutine } from "../../story/heart-of-darkness/deckhand";
import { attachJourneyConversation } from "./attachJourneyConversation";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { journeyRiverLayers } from "../../story/heart-of-darkness/riverParallax";
import { journeyWeather } from "../../story/heart-of-darkness/weather";
import { attachJourneyAtmosphere } from "./attachJourneyAtmosphere";
import { createJourneyCargoInspection } from "./createJourneyCargoInspection";
import { journeyAtmosphereProgress, journeyPlayerPosition, journeyVoyageDistance } from "../state/journeyState";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { journeyAudioLayers, registerJourneyAudioAssets } from "../../story/heart-of-darkness/journeyAudio";
import { attachJourneyAudioDiagnostics } from "./attachJourneyAudioDiagnostics";
import { attachMarlowArt } from "../../story/heart-of-darkness/attachMarlowArt";
import { attachActorDepth } from "../../ui/attachActorDepth";
import { createVisualAssetSlot } from "../../ui/visualAssetSlot";
import { journeyArtStage, journeyArtVariants, type JourneyActorMood } from "../../story/heart-of-darkness/journeyArtStages";
import { attachJourneyEmbers } from "../../story/heart-of-darkness/journeyEmbers";
import { attachDisplayResolution } from "../../ui/attachDisplayResolution";
import { currentJourneySpace, deckConversationCompleted, setJourneySpace, approachDecision, woodStopDeparted } from "../state/woodStopState";

const DECK_LAYER = "journey-deck";

/** Rebuild transient scenery on label entry; Pixi'VN remains the canvas owner. */
export function showJourneyDeck(options: { progress?: () => number; displayResolution?: boolean } = {}) {
  const previous = canvas.layers.get(DECK_LAYER);
  if (previous) {
    canvas.layers.remove(DECK_LAYER);
    previous.destroy({ children: true });
  }
  const { presentation, player, world, deckhand, layers, visual, marlowVisual } = createJourneyDeck();
  canvas.layers.add(DECK_LAYER, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  if (options.displayResolution !== false) attachDisplayResolution(presentation, canvas.app.renderer, surface);
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Heart of Darkness: mueve a Marlow con WASD o las flechas");
  attachPlayerMovement(player, canvas.app.ticker, surface, {
    position: journeyDeck.anchors.playerSpawn,
    bounds: journeyDeck.walkableArea,
    ...marlowMovement,
  }, journeyPlayerPosition);
  let actorMood: JourneyActorMood = "neutral";
  attachMarlowArt(player, canvas.app.ticker, marlowVisual.setState, () => actorMood);
  const npc = attachNpcRoutine(deckhand.actor, canvas.app.ticker, deckhandRoutine, deckhand.pose);
  attachActorDepth(layers.actors, canvas.app.ticker, [player, deckhand.actor]);
  const camera = attachWorldCamera(world, canvas.app.ticker, {
    world: journeyDeck.size,
    viewport: journeyDeck.size,
    position: { x: player.x + journeyCamera.offset.x, y: player.y + journeyCamera.offset.y },
    zoom: journeyCamera.zoom,
    smoothing: journeyCamera.smoothing,
  });
  camera.follow(() => player.position, journeyCamera.offset);
  const river = journeyRiverLayers.map((definition) => {
    return attachParallaxLayer(layers[definition.placement], canvas.app.ticker, camera, {
      ...definition, reference: { x: journeyDeck.size.width / 2, y: journeyDeck.size.height / 2 },
    }, definition.id === "near-bank" ? journeyVoyageDistance : undefined).controller;
  });
  const voyage = river[journeyRiverLayers.findIndex((layer) => layer.id === "near-bank")];
  const burningBank = attachParallaxLayer(layers.environment, canvas.app.ticker, camera, {
    id: "burning-bank", period: journeyDeck.size.width, speed: 30,
    depth: { x: .5, y: 1 },
    reference: { x: journeyDeck.size.width / 2, y: journeyDeck.size.height / 2 },
    createTile: () => createVisualAssetSlot({ label: "burning-bank-art",
      source: journeyArtVariants.burningBank, fallback: () => new Container() }).container,
  }).layer;
  burningBank.alpha = 0;
  // A scene/navigation director may supply progress; otherwise follow actual bank travel.
  const atmosphere = attachJourneyAtmosphere(layers, canvas.app.ticker, camera,
    options.progress ?? (() => voyage.distance / journeyWeather.routeDistance),
    options.progress ? undefined : journeyAtmosphereProgress);
  const embers = attachJourneyEmbers(layers.foreground, canvas.app.ticker);
  const updateArt = () => {
    const stage = journeyArtStage(atmosphere.progress);
    visual.setProgress(stage);
    burningBank.alpha = stage.fire;
    burningBank.visible = stage.fire > .001;
    actorMood = stage.mood;
    deckhand.setMood(stage.mood);
    embers.setIntensity(stage.fire);
    player.getChildByLabel("fire-cast-shadow")!.alpha = stage.fire * .45;
    deckhand.actor.getChildByLabel("fire-cast-shadow")!.alpha = stage.fire * .45;
    for (const id of ["distant-ridge", "far-vegetation", "near-bank"]) {
      const bank = layers.environment.getChildByLabel(`parallax-${id}`)!;
      bank.tint = stage.landTint;
      bank.alpha = 1 - stage.fire * .98;
      bank.visible = stage.fire < .995;
    }
    const current = layers.environment.getChildByLabel("parallax-river-current")!;
    current.alpha = 1 - stage.fire;
    current.visible = stage.fire < .999;
    current.tint = stage.landTint;
    // Surface fog gives way to the fire's reflected light; dense shore smoke
    // lives in the burning-bank illustration and the existing distant fog.
    layers.environment.getChildByLabel("parallax-weather-riverFog")!.alpha =
      atmosphere.state.riverFog * (1 - stage.fire * .7);
  };
  updateArt();
  canvas.app.ticker.add(updateArt, undefined, -4);
  presentation.once("destroyed", () => canvas.app.ticker.remove(updateArt));
  registerJourneyAudioAssets();
  const audio = attachSpatialAudio(presentation, canvas.app.ticker, surface, {
    namespace: DECK_LAYER, listener: () => ({ x: player.x, y: player.y }),
    layers: journeyAudioLayers,
  });
  attachJourneyAudioDiagnostics(presentation, player, audio, canvas.app.ticker, surface);
  attachJourneyConversation(presentation, player, npc, canvas.app.ticker, surface,
    createJourneyCargoInspection(), visual.setBeat, [{
      id: "wood-stop-landing", prompt: "E · Desembarcar junto a la cabaña",
      target: () => ({ x: 430, y: 850 }), range: 105, enabled: deckConversationCompleted,
      execute: async () => {
        setJourneySpace("wood-stop");
        await showJourneySpace();
      },
    }, {
      id: "approach-helm", prompt: "E · Reanudar el viaje desde el timón",
      target: () => ({ x: 900, y: 748 }), range: 85,
      enabled: () => woodStopDeparted() && !!approachDecision(),
      execute: async () => { setJourneySpace("approach"); await showJourneySpace(); },
    }]);
  surface.focus({ preventScroll: true });
  return { camera, npc, player, atmosphere, voyage, audio };
}

/** Content scene composition after entry or Pixi'VN restore; no parallel save format. */
export async function showJourneySpace() {
  for (const id of [DECK_LAYER, "journey-wood-stop", "journey-approach", "journey-station-arrival", "journey-inner-station"]) {
    const old = canvas.layers.get(id);
    if (old) { canvas.layers.remove(id); old.destroy({ children: true }); }
  }
  if (currentJourneySpace() === "wood-stop") {
    const { showWoodStop } = await import("./showWoodStop");
    return showWoodStop();
  }
  if (currentJourneySpace() === "approach") {
    const { showRiverApproach } = await import("./showRiverApproach");
    return showRiverApproach();
  }
  if (currentJourneySpace() === "station-arrival") {
    const { showStationArrival } = await import("./showStationArrival");
    return showStationArrival();
  }
  if (currentJourneySpace() === "inner-station") {
    const { showInnerStation } = await import("./showInnerStation");
    return showInnerStation();
  }
  return showJourneyDeck();
}

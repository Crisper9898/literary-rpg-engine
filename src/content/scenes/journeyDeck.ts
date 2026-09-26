import { canvas } from "@drincs/pixi-vn";
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

const DECK_LAYER = "journey-deck";

/** Rebuild transient scenery on label entry; Pixi'VN remains the canvas owner. */
export function showJourneyDeck(options: { progress?: () => number } = {}) {
  const previous = canvas.layers.get(DECK_LAYER);
  if (previous) {
    canvas.layers.remove(DECK_LAYER);
    previous.destroy({ children: true });
  }
  const { presentation, player, world, deckhand, layers } = createJourneyDeck();
  canvas.layers.add(DECK_LAYER, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Heart of Darkness: mueve a Marlow con WASD o las flechas");
  attachPlayerMovement(player, canvas.app.ticker, surface, {
    position: journeyDeck.anchors.playerSpawn,
    bounds: journeyDeck.walkableArea,
    ...marlowMovement,
  }, journeyPlayerPosition);
  const npc = attachNpcRoutine(deckhand.actor, canvas.app.ticker, deckhandRoutine, deckhand.pose);
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
  // A scene/navigation director may supply progress; otherwise follow actual bank travel.
  const atmosphere = attachJourneyAtmosphere(layers, canvas.app.ticker, camera,
    options.progress ?? (() => voyage.distance / journeyWeather.routeDistance),
    options.progress ? undefined : journeyAtmosphereProgress);
  attachJourneyConversation(presentation, player, npc, canvas.app.ticker, surface,
    createJourneyCargoInspection());
  surface.focus({ preventScroll: true });
  return { camera, npc, player, atmosphere, voyage };
}

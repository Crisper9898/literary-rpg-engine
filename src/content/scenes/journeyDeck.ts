import { canvas } from "@drincs/pixi-vn";
import { createJourneyDeck } from "../../story/heart-of-darkness/createJourneyDeck";
import { journeyCamera, journeyDeck, marlowMovement } from "../../story/heart-of-darkness/deck";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachNpcRoutine } from "../../engine/npc/attachNpcRoutine";
import { deckhandRoutine } from "../../story/heart-of-darkness/deckhand";

const DECK_LAYER = "journey-deck";

/** Rebuild transient scenery on label entry; Pixi'VN remains the canvas owner. */
export function showJourneyDeck() {
  const previous = canvas.layers.get(DECK_LAYER);
  if (previous) {
    canvas.layers.remove(DECK_LAYER);
    previous.destroy({ children: true });
  }
  const { presentation, player, world, deckhand } = createJourneyDeck();
  canvas.layers.add(DECK_LAYER, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Heart of Darkness: mueve a Marlow con WASD o las flechas");
  attachPlayerMovement(player, canvas.app.ticker, surface, {
    position: journeyDeck.anchors.playerSpawn,
    bounds: journeyDeck.walkableArea,
    ...marlowMovement,
  });
  const npc = attachNpcRoutine(deckhand.actor, canvas.app.ticker, deckhandRoutine, deckhand.pose);
  const camera = attachWorldCamera(world, canvas.app.ticker, {
    world: journeyDeck.size,
    viewport: journeyDeck.size,
    position: { x: player.x + journeyCamera.offset.x, y: player.y + journeyCamera.offset.y },
    zoom: journeyCamera.zoom,
    smoothing: journeyCamera.smoothing,
  });
  camera.follow(() => player.position, journeyCamera.offset);
  surface.focus({ preventScroll: true });
  // Future interaction code can pause/face the NPC and pass npc.cameraTarget to focus.
  return { camera, npc, player };
}

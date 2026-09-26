import { canvas } from "@drincs/pixi-vn";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { createMetamorphosisRoom } from "../../story/metamorphosis/createRoom";
import { gregorMovement, metamorphosisRoom as room, roomCamera } from "../../story/metamorphosis/room";
import { metamorphosisAudioLayers, registerMetamorphosisAudio } from "../../story/metamorphosis/audio";
import { gregorPosition } from "./state";
import { attachRoomInteractions } from "./attachRoomInteractions";

const ROOM_LAYER = "metamorphosis-room";

/** Rebuild only transient presentation after Pixi'VN restore or label entry. */
export function showMetamorphosisRoom() {
  const previous = canvas.layers.get(ROOM_LAYER);
  if (previous) { canvas.layers.remove(ROOM_LAYER); previous.destroy({ children: true }); }
  const { presentation, world, actor } = createMetamorphosisRoom();
  canvas.layers.add(ROOM_LAYER, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "La metamorfosis: mueve a Gregor con WASD o las flechas");
  attachPlayerMovement(actor, canvas.app.ticker, surface, {
    position: room.anchors.gregorSpawn, bounds: room.walkableArea, ...gregorMovement,
  }, gregorPosition);
  const camera = attachWorldCamera(world, canvas.app.ticker, {
    world: room.size, viewport: room.size, position: { x: actor.x, y: actor.y },
    zoom: roomCamera.zoom, smoothing: roomCamera.smoothing,
  });
  camera.follow(() => actor.position, { x: 0, y: -70 });
  registerMetamorphosisAudio();
  const audio = attachSpatialAudio(presentation, canvas.app.ticker, surface, {
    namespace: ROOM_LAYER, listener: () => actor.position, layers: metamorphosisAudioLayers,
  });
  attachRoomInteractions(presentation, actor, canvas.app.ticker, surface);
  surface.focus({ preventScroll: true });
  return { actor, camera, audio };
}

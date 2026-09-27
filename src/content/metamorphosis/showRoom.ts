import { canvas, narration } from "@drincs/pixi-vn";
import { attachPlayerMovement } from "../../engine/movement/attachPlayerMovement";
import { attachWorldCamera } from "../../engine/camera/attachWorldCamera";
import { attachSpatialAudio } from "../../engine/audio/attachSpatialAudio";
import { createMetamorphosisRoom } from "../../story/metamorphosis/createRoom";
import { createMetamorphosisHallway } from "../../story/metamorphosis/createHallway";
import { metamorphosisHallway as hallway } from "../../story/metamorphosis/hallway";
import { gregorMovement, metamorphosisRoom as room, roomCamera, roomReturnPosition } from "../../story/metamorphosis/room";
import { metamorphosisAudioLayers, metamorphosisHallwayAudioLayers, registerMetamorphosisAudio } from "../../story/metamorphosis/audio";
import { currentSpace, gregorPosition, setCurrentSpace, type MetamorphosisSpace } from "./state";
import { attachRoomInteractions } from "./attachRoomInteractions";
import { attachHallwayInteractions } from "./attachHallwayInteractions";

const ROOM_LAYER = "metamorphosis-room";
const HALLWAY_LAYER = "metamorphosis-hallway";

/** Rebuild transient presentation from Pixi'VN's current-space and position state. */
function showSpace(space: MetamorphosisSpace) {
  for (const id of [ROOM_LAYER, HALLWAY_LAYER]) {
    const previous = canvas.layers.get(id);
    if (previous) { canvas.layers.remove(id); previous.destroy({ children: true }); }
  }
  const { presentation, world, actor } = space === "room" ? createMetamorphosisRoom() : createMetamorphosisHallway();
  const layerId = space === "room" ? ROOM_LAYER : HALLWAY_LAYER;
  const layout = space === "room" ? room : hallway;
  canvas.layers.add(layerId, presentation);
  const surface = canvas.app.canvas as HTMLCanvasElement;
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", `La metamorfosis: mueve a Gregor con WASD o las flechas · ${space}`);
  attachPlayerMovement(actor, canvas.app.ticker, surface, {
    position: space === "room" ? room.anchors.gregorSpawn : hallway.anchors.arrival,
    bounds: layout.walkableArea, ...gregorMovement,
  }, gregorPosition);
  const camera = attachWorldCamera(world, canvas.app.ticker, {
    world: layout.size, viewport: layout.size, position: { x: actor.x, y: actor.y },
    zoom: roomCamera.zoom, smoothing: roomCamera.smoothing,
  });
  camera.follow(() => actor.position, { x: 0, y: -70 });
  registerMetamorphosisAudio();
  const audio = attachSpatialAudio(presentation, canvas.app.ticker, surface, {
    namespace: layerId, listener: () => actor.position,
    layers: space === "room" ? metamorphosisAudioLayers : metamorphosisHallwayAudioLayers,
  });
  if (space === "room") {
    attachRoomInteractions(presentation, actor, canvas.app.ticker, surface, () => transitionTo("hallway"));
  } else {
    attachHallwayInteractions(presentation, actor, canvas.app.ticker, surface, () => transitionTo("room"));
  }
  surface.focus({ preventScroll: true });
  return { actor, camera, audio };
}

function transitionTo(destination: MetamorphosisSpace) {
  narration.dialogue = undefined;
  narration.choices = undefined;
  setCurrentSpace(destination);
  gregorPosition.write(destination === "room" ? roomReturnPosition : hallway.anchors.arrival);
  showSpace(destination);
}

export const showMetamorphosisRoom = () => showSpace("room");
export const showMetamorphosisSpace = () => showSpace(currentSpace());

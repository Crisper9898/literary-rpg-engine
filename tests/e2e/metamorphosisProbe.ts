import { Game, sound } from "@drincs/pixi-vn";
import { getContext } from "tone";
import { showMetamorphosisRoom } from "../../src/content/metamorphosis/showRoom";
import { gregorPosition, greteResponse, hasHeardDoor, hasSeenWindow } from "../../src/content/metamorphosis/state";

let scene: ReturnType<typeof showMetamorphosisRoom> | undefined;
const ids = ["room", "outside", "voices"] as const;

export function mountRoom() { scene = showMetamorphosisRoom(); }
export function placeGregor(x: number, y = 700) {
  if (!scene) throw new Error("Room is not mounted");
  gregorPosition.write({ x, y });
  scene.actor.position.set(x, y);
  scene.audio.update(1200);
}
export function inspectRoom() {
  if (!scene) throw new Error("Room is not mounted");
  return { position: { x: scene.actor.x, y: scene.actor.y },
    camera: { x: scene.camera.state.position.x, y: scene.camera.state.position.y },
    audioContextState: getContext().state,
    windowSeen: hasSeenWindow(), doorHeard: hasHeardDoor(), greteResponse: greteResponse(),
    layers: Object.fromEntries(ids.map((id) => [id, {
      ...scene!.audio.getLayerState(id),
      active: !!sound.find(`metamorphosis-room:${id}`),
      mediaCount: sound.channels.values.find(channel =>
        channel.alias === `metamorphosis-room:${id}:channel`)?.mediaInstances.length ?? 0,
    }])) };
}
export async function saveRoom() { return JSON.stringify(await Game.exportGameState()); }
export async function restoreRoom(serialized: string) {
  await Game.restoreGameState(JSON.parse(serialized));
  scene = showMetamorphosisRoom();
  scene.audio.update(1200);
  return inspectRoom();
}

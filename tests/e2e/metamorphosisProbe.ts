import { canvas, Game, sound, storage } from "@drincs/pixi-vn";
import { getContext } from "tone";
import { showMetamorphosisRoom, showMetamorphosisSpace } from "../../src/content/metamorphosis/showRoom";
import { clerkResponse, familyResponse, gregorPosition, greteResponse,
  currentSpace, hasHeardClerkArrival, hasHeardDoor, hasHeardFamilyActivity, hasSeenWindow,
  setClerkResponse, setFamilyResponse, type ClerkResponse,
  type FamilyResponse } from "../../src/content/metamorphosis/state";

let scene: ReturnType<typeof showMetamorphosisRoom> | undefined;
const ids = ["room", "outside", "voices"] as const;

export function mountRoom() { scene = showMetamorphosisRoom(); }
export function placeGregor(x: number, y = 700) {
  const layer = canvas.layers.get(`metamorphosis-${currentSpace()}`);
  const actor = layer?.getChildByLabel("gregor", true);
  if (!actor) throw new Error("Metamorphosis scene is not mounted");
  gregorPosition.write({ x, y });
  actor.position.set(x, y);
  if (currentSpace() === "room") scene?.audio.update(1200);
}
export function changeFamilyResponse(response: FamilyResponse) { setFamilyResponse(response); }
export function changeClerkResponse(response: ClerkResponse) { setClerkResponse(response); }
export function currentSpaceLayer() {
  return canvas.layers.get("metamorphosis-hallway") ? "hallway" : "room";
}
export function inspectSpace() {
  const space = currentSpace();
  const layer = canvas.layers.get(`metamorphosis-${space}`);
  const actor = layer?.getChildByLabel("gregor", true);
  const world = layer?.getChildByLabel("world", true);
  if (!actor || !world) throw new Error(`Missing ${space} presentation`);
  return {
    space, position: { x: actor.x, y: actor.y },
    world: { x: world.x, y: world.y },
    familyActivityHeard: hasHeardFamilyActivity(), familyResponse: familyResponse(),
    clerkArrivalHeard: hasHeardClerkArrival(), clerkResponse: clerkResponse(),
    windowSeen: hasSeenWindow(), greteResponse: greteResponse(),
    audio: { room: sound.channels.values.filter(channel =>
      channel.alias?.startsWith("metamorphosis-room:") && channel.mediaInstances.length > 0).length,
      hallway: sound.channels.values.filter(channel =>
        channel.alias?.startsWith("metamorphosis-hallway:") && channel.mediaInstances.length > 0).length },
  };
}
export function inspectHallwayNpcs() {
  const layer = canvas.layers.get("metamorphosis-hallway");
  const grete = layer?.getChildByLabel("hallway-grete", true);
  const clerk = layer?.getChildByLabel("hallway-clerk", true);
  const father = layer?.getChildByLabel("hallway-father", true);
  const actor = (npc: typeof grete) => npc ?
    { x: npc.x, y: npc.y, facing: npc.scale.x } : null;
  return {
    grete: actor(grete), clerk: actor(clerk),
    father: father?.visible ? { ...actor(father), facing: father.getChildAt(0).scale.x } : null,
    fatherArrived: storage.get<boolean>("metamorphosis.fatherArrived") === true,
    fatherSpoken: storage.get<boolean>("metamorphosis.fatherSpoken") === true,
    greteSawGregor: storage.get<boolean>("metamorphosis.greteSawGregor") === true,
    greteReacted: storage.get<boolean>("metamorphosis.greteReacted") === true,
    greteLeft: storage.get<boolean>("metamorphosis.greteLeft") === true,
    clerkSawGregor: storage.get<boolean>("metamorphosis.clerkSawGregor") === true,
    clerkLeaving: storage.get<boolean>("metamorphosis.clerkLeaving") === true,
    clerkLeft: storage.get<boolean>("metamorphosis.clerkLeft") === true,
  };
}
export function inspectRoom() {
  if (!scene) throw new Error("Room is not mounted");
  return { position: { x: scene.actor.x, y: scene.actor.y },
    camera: { x: scene.camera.state.position.x, y: scene.camera.state.position.y },
    audioContextState: getContext().state,
    windowSeen: hasSeenWindow(), doorHeard: hasHeardDoor(), greteResponse: greteResponse(),
    familyActivityHeard: hasHeardFamilyActivity(), familyResponse: familyResponse(),
    clerkArrivalHeard: hasHeardClerkArrival(), clerkResponse: clerkResponse(),
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
  scene = showMetamorphosisSpace();
  if (currentSpace() === "room") scene.audio.update(1200);
  return inspectRoom();
}
export async function restoreSpace(serialized: string) {
  await Game.restoreGameState(JSON.parse(serialized));
  scene = showMetamorphosisSpace();
  scene.audio.update(1200);
  return inspectSpace();
}

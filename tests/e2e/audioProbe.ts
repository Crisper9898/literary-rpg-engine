import { Game, sound } from "@drincs/pixi-vn";
import { getContext } from "tone";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";
import { journeyPlayerPosition } from "../../src/content/state/journeyState";

let scene: ReturnType<typeof showJourneyDeck> | undefined;
const ids = ["river", "shore", "engine"] as const;

export function mountAudio() { scene = showJourneyDeck(); }

export function placeAudioListener(x: number, y = 760) {
  if (!scene) throw new Error("Audio scene is not mounted");
  journeyPlayerPosition.write({ x, y });
  scene.player.position.set(x, y);
  scene.audio.update(1200);
}

export function inspectAudio() {
  if (!scene) throw new Error("Audio scene is not mounted");
  return {
    audioContextState: getContext().state,
    player: { x: scene.player.x, y: scene.player.y },
    layers: Object.fromEntries(ids.map((id) => [id, {
      ...scene!.audio.getLayerState(id),
      active: !!sound.find(`journey-deck:${id}`),
      channelVolume: sound.channels.values.find(channel =>
        channel.alias === `journey-deck:${id}:channel`)?.volume ?? null,
      background: sound.channels.values.find(channel =>
        channel.alias === `journey-deck:${id}:channel`)?.background ?? null,
      mediaCount: sound.channels.values.find(channel =>
        channel.alias === `journey-deck:${id}:channel`)?.mediaInstances.length ?? 0,
    }])),
  };
}

export async function saveAudioPosition() { return JSON.stringify(await Game.exportGameState()); }
export async function restoreAudioPosition(serialized: string) {
  await Game.restoreGameState(JSON.parse(serialized));
  scene = showJourneyDeck();
  scene.audio.update(1200);
  return inspectAudio();
}

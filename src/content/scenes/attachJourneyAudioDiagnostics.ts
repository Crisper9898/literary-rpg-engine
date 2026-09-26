import { sound } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import type { SpatialAudioController } from "../../engine/audio/SpatialAudioController";
import { createJourneyAudioDiagnosticsView } from "../../ui/journeyAudioDiagnosticsView";

const cues = [
  { id: "river", name: "Río" },
  { id: "shore", name: "Orilla" },
  { id: "engine", name: "Motor" },
] as const;

/** Scene-specific listening display; reads canonical mixer and Pixi'VN state. */
export function attachJourneyAudioDiagnostics(presentation: Container, player: Container,
  audio: SpatialAudioController, ticker: Ticker, surface: HTMLCanvasElement) {
  const view = createJourneyAudioDiagnosticsView(surface.parentElement!);
  const render = () => {
    if (!view.visible) return;
    const x = player.x;
    view.render({
      location: x < 600 ? "Orilla" : x >= 1050 ? "Motor" : "Río",
      x, y: player.y,
      layers: cues.map(({ id, name }) => {
        const state = audio.getLayerState(id);
        const alias = `journey-deck:${id}`;
        const channel = sound.channels.values.find(item => item.alias === `${alias}:channel`);
        return { id, name, ...state, channelVolume: channel?.volume ?? 0,
          playing: !!sound.find(alias) };
      }),
    });
  };
  ticker.add(render, undefined, UPDATE_PRIORITY.NORMAL - 5);
  presentation.once("destroyed", () => {
    ticker.remove(render);
    view.dispose();
  });
  return view;
}

import { canvas } from "@drincs/pixi-vn";
import { type Container, type Sprite, type Ticker } from "pixi.js";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";

let scene: ReturnType<typeof showJourneyDeck>;
let progress = 0;
const channels = ["distantFog", "riverFog", "deckFog"];
function nodes() {
  const presentation = canvas.layers.get("journey-deck");
  if (!presentation) return null;
  const world = presentation.getChildByLabel("world") as Container;
  const fog = channels.map((channel) => {
    const parent = world.getChildByLabel(channel === "deckFog" ? "foreground" : "environment") as Container;
    return parent.getChildByLabel(`parallax-weather-${channel}`) as Container;
  });
  return { presentation, world, fog };
}

export function mountWeather(controlled = false) {
  progress = 0;
  scene = showJourneyDeck(controlled ? { progress: () => progress } : {});
}
export function setWeatherProgress(value: number) { progress = value; }
export function inspectWeather() {
  const current = nodes();
  if (!current || current.fog.some((layer) => !layer)) return null;
  const { presentation, world, fog } = current;
  const player = (world.getChildByLabel("actors") as Container).getChildByLabel("playerSpawn")!;
  const textures = fog.flatMap((layer) => layer.children.map((tile) => (tile.children[0] as Sprite).texture));
  const title = presentation.getChildByLabel("deck-title")!;
  return {
    progress: scene && !scene.player.destroyed ? scene.atmosphere.progress : null,
    distance: scene && !scene.player.destroyed ? scene.voyage.distance : null,
    player: { x: player.x, y: player.y },
    cameraX: world.pivot.x,
    fog: fog.map((layer) => ({ alpha: layer.alpha, x: layer.x, count: layer.children.length })),
    sharedTextures: new Set(textures).size,
    textureId: textures[0].uid,
    textureWidth: textures[0].width,
    titleLayered: title.parent === presentation && presentation.children.indexOf(world) < presentation.children.indexOf(title),
    titleAlpha: title.alpha,
  };
}

/** Observe real ticker frames; no synthetic controller/ticker updates. */
export function sampleWeather(frames = 12) {
  const before = inspectWeather()!;
  const ticker = canvas.app.ticker;
  const started = performance.now();
  return new Promise<{ before: typeof before; after: typeof before; seconds: number; fps: number }>((resolve, reject) => {
    let seconds = 0;
    let count = 0;
    const cleanup = () => { ticker.remove(sample); clearTimeout(timeout); };
    const sample = (frame: Ticker) => {
      seconds += Math.min(50, frame.deltaMS) / 1000;
      if (++count === frames) {
        cleanup();
        resolve({ before, after: inspectWeather()!, seconds, fps: frames * 1000 / (performance.now() - started) });
      }
    };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Weather sampling timed out")); }, 15_000);
    ticker.add(sample, undefined, -25);
  });
}

let retained: ReturnType<typeof retainWeather>;
export function retainWeather() {
  const fog = nodes()!.fog;
  const saved = { fog, texture: (fog[0].children[0].children[0] as Sprite).texture,
    controller: scene.atmosphere, progress: scene.atmosphere.progress };
  retained = saved;
  return saved;
}
export function weatherDisposed() {
  return retained.fog.every((layer) => layer.destroyed) && retained.texture.destroyed &&
    retained.controller.progress === retained.progress;
}
export function weatherVisible(visible: boolean) {
  const { fog } = nodes()!;
  fog.forEach((layer) => { layer.visible = visible; });
}

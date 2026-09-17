import { canvas } from "@drincs/pixi-vn";
import { type Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import { journeyRiverLayers } from "../../src/story/heart-of-darkness/riverParallax";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";

function nodes() {
  const presentation = canvas.layers.get("journey-deck");
  if (!presentation) return null;
  const world = presentation.getChildByLabel("world") as Container;
  const layers = journeyRiverLayers.map((definition) => {
    const parent = world.getChildByLabel(definition.placement) as Container;
    return parent.getChildByLabel(`parallax-${definition.id}`) as Container;
  });
  if (layers.some((layer) => !layer)) return null;
  return { presentation, world, layers };
}

export function inspectParallax() {
  const scene = nodes();
  if (!scene) return null;
  const { presentation, world, layers } = scene;
  const player = (world.getChildByLabel("actors") as Container).getChildByLabel("playerSpawn")!;
  return {
    player: { x: player.x, y: player.y },
    cameraX: world.pivot.x,
    layers: layers.map((layer, index) => {
      const { id, speed, period, depth } = journeyRiverLayers[index];
      const intervals = layer.children.filter((tile) => tile.visible).map((tile) => ({
        start: presentation.toLocal(layer.toGlobal({ x: tile.x, y: 0 })).x,
        end: presentation.toLocal(layer.toGlobal({ x: tile.x + period, y: 0 })).x,
      }));
      return { id, speed, period, depth, offset: layer.x, count: layer.children.length, intervals };
    }),
  };
}

/** Observe actual layer transforms after updates, without driving their controllers. */
export function measureParallaxFrames(frameCount = 20) {
  const ticker = canvas.app.ticker;
  return new Promise<{ seconds: number; distances: number[] }>((resolve, reject) => {
    let previous = inspectParallax()!;
    const distances = previous.layers.map(() => 0);
    let seconds = 0;
    let frames = 0;
    const cleanup = () => { ticker.remove(sample); clearTimeout(timeout); };
    const sample = (frame: Ticker) => {
      const current = inspectParallax()!;
      seconds += Math.min(frame.deltaMS, 50) / 1000;
      current.layers.forEach((layer, index) => {
        const delta = previous.layers[index].offset - layer.offset +
          (1 - layer.depth.x) * (current.cameraX - previous.cameraX);
        distances[index] += ((delta % layer.period) + layer.period) % layer.period;
      });
      previous = current;
      if (++frames === frameCount) { cleanup(); resolve({ seconds, distances }); }
    };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("Parallax sampling timed out")); }, 7000);
    ticker.add(sample, undefined, UPDATE_PRIORITY.LOW);
  });
}

let scene: ReturnType<typeof showJourneyDeck>;
let retained: Container[] = [];
export function frameRiver(x: number, y: number, zoom: number) {
  if (!scene || scene.player.destroyed) scene = showJourneyDeck();
  scene.camera.focus({ x, y });
  scene.camera.setZoom(zoom);
}
export function retainLayers() { retained = nodes()!.layers; }
export function oldLayersDestroyed() { return retained.length === 5 && retained.every((layer) => layer.destroyed); }

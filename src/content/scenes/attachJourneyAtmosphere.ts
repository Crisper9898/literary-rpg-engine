import { Container, Sprite, type Ticker } from "pixi.js";
import type { CameraDirector } from "../../engine/camera/CameraDirector";
import type { createWorldLayers } from "../../engine/world/createWorldLayers";
import { attachParallaxLayer } from "../../engine/parallax/attachParallaxLayer";
import { attachAtmosphere } from "../../engine/weather/attachAtmosphere";
import { createFogTexture } from "../../engine/weather/createFogTexture";
import { journeyWeather } from "../../story/heart-of-darkness/weather";
import { journeyDeck } from "../../story/heart-of-darkness/deck";
import type { CheckpointChannel } from "../../engine/world/CheckpointChannel";

export function attachJourneyAtmosphere(layers: ReturnType<typeof createWorldLayers>,
  ticker: Ticker, camera: CameraDirector, progress: () => number,
  checkpoint?: CheckpointChannel<number>) {
  const texture = createFogTexture();
  const targets = {} as Record<typeof journeyWeather.fog[number]["channel"], Container>;
  for (const definition of journeyWeather.fog) {
    const parent = definition.channel === "deckFog" ? layers.foreground : layers.environment;
    const { layer } = attachParallaxLayer(parent, ticker, camera, {
      id: `weather-${definition.channel}`, period: journeyDeck.size.width,
      speed: definition.speed, depth: { x: definition.depth, y: 1 },
      reference: { x: journeyDeck.size.width / 2, y: journeyDeck.size.height / 2 },
      createTile: () => {
        const tile = new Container();
        const sprite = new Sprite({ texture, tint: definition.tint, y: definition.y });
        sprite.width = journeyDeck.size.width;
        sprite.height = definition.height;
        tile.addChild(sprite);
        return tile;
      },
    });
    if (definition.channel === "distantFog") {
      const bank = parent.getChildByLabel("parallax-near-bank")!;
      parent.setChildIndex(layer, parent.getChildIndex(bank));
    }
    targets[definition.channel] = layer;
  }
  const controller = attachAtmosphere(layers.root, ticker, {
    keyframes: journeyWeather.keyframes, progress, checkpoint,
    apply: (state) => {
      targets.distantFog.alpha = state.distantFog;
      targets.riverFog.alpha = state.riverFog;
      targets.deckFog.alpha = state.deckFog;
      // Inherited tint darkens the world without another fullscreen blend pass.
      const red = Math.round(255 - 210 * state.shade);
      const green = Math.round(255 - 175 * state.shade);
      const blue = Math.round(255 - 165 * state.shade);
      layers.root.tint = (red << 16) | (green << 8) | blue;
    },
  });
  // Pixi destroys the sprites with the world; this scene owns their shared source.
  layers.root.once("destroyed", () => texture.destroy(true));
  return controller;
}

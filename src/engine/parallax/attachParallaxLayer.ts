import { Container, type Ticker, UPDATE_PRIORITY } from "pixi.js";
import type { CameraDirector } from "../camera/CameraDirector";
import { ParallaxLayerController, type ParallaxLayerOptions } from "./ParallaxLayerController";

export interface RepeatingLayerOptions extends ParallaxLayerOptions {
  readonly id: string;
  /** A seamless tile covering local X 0..period. Geometry/textures remain caller-owned. */
  readonly createTile: () => Container;
}

/** Reuses Pixi'VN's world and ticker. Pooled tiles cover camera pans and zooms. */
export function attachParallaxLayer(parent: Container, ticker: Ticker,
  camera: Pick<CameraDirector, "state" | "viewport">, options: RepeatingLayerOptions) {
  const controller = new ParallaxLayerController(options);
  const layer = new Container({ label: `parallax-${options.id}`, eventMode: "none" });
  const tiles: Container[] = [];
  parent.addChild(layer);
  const apply = () => {
    const { x, y, firstTileX, tileCount } = controller.layout(camera.state, camera.viewport);
    layer.position.set(x, y);
    while (tiles.length < tileCount) {
      const tile = options.createTile();
      tile.label = "parallax-tile";
      tiles.push(tile);
      layer.addChild(tile);
    }
    tiles.forEach((tile, index) => {
      tile.visible = index < tileCount;
      tile.x = firstTileX + index * options.period;
    });
  };
  const update = (frame: Ticker) => { controller.update(frame.deltaMS); apply(); };
  apply();
  // Camera updates at -1; rendering is -25. Always sample this frame's camera.
  ticker.add(update, undefined, UPDATE_PRIORITY.NORMAL - 2);
  layer.once("destroyed", () => ticker.remove(update));
  return { layer, controller };
}

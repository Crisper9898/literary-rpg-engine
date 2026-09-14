import { UPDATE_PRIORITY, type Container, type Ticker } from "pixi.js";
import { CameraDirector, type CameraOptions } from "./CameraDirector";

/** Transform a world inside Pixi'VN's logical canvas; UI siblings stay fixed. */
export function attachWorldCamera(world: Container, ticker: Ticker, options: CameraOptions): CameraDirector {
  const camera = new CameraDirector(options);
  const apply = () => {
    const { position, zoom } = camera.state;
    world.pivot.set(position.x, position.y);
    world.position.set(camera.viewport.width / 2, camera.viewport.height / 2);
    world.scale.set(zoom);
  };
  const update = (frame: Ticker) => { camera.update(frame.deltaMS); apply(); };
  apply();
  // Movement uses NORMAL (0), application rendering uses LOW (-25).
  ticker.add(update, undefined, UPDATE_PRIORITY.NORMAL - 1);
  world.once("destroyed", () => ticker.remove(update));
  return camera;
}

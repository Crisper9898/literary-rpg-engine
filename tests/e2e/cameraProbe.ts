import { canvas } from "@drincs/pixi-vn";
import { type Container } from "pixi.js";
import { showJourneyDeck } from "../../src/content/scenes/journeyDeck";

let directedCamera: ReturnType<typeof showJourneyDeck>;

export function cameraCommand(command: "create" | "focus" | "zoom" | "lock" | "resume") {
  if (command === "create") directedCamera = showJourneyDeck();
  if (command === "focus") directedCamera.focus({ x: 1200, y: 600 });
  if (command === "zoom") directedCamera.setZoom(1.8);
  if (command === "lock") directedCamera.lock();
  if (command === "resume") directedCamera.resumeFollow();
}

export function directedState() { return directedCamera.state; }

// Browser-only inspection of the actual scene, outside the application bundle.
export function inspectCamera() {
  const layer = canvas.layers.get("journey-deck");
  if (!layer) return null;
  const world = layer.getChildByLabel("world") as Container;
  const actors = world.getChildByLabel("actors") as Container;
  const player = actors.getChildByLabel("playerSpawn")!;
  const logical = (point: { x: number; y: number }) => {
    const result = layer.toLocal(world.toGlobal(point));
    return { x: result.x, y: result.y };
  };
  const title = layer.getChildByLabel("deck-title")!;
  const titlePosition = layer.toLocal(title.getGlobalPosition());
  return {
    center: { x: world.pivot.x, y: world.pivot.y }, zoom: world.scale.x,
    player: { x: player.x, y: player.y }, playerView: logical(player.position),
    worldStart: logical({ x: 0, y: 0 }), worldEnd: logical({ x: 1920, y: 1080 }),
    title: { x: titlePosition.x, y: titlePosition.y },
  };
}

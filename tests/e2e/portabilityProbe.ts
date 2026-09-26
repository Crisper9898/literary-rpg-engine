import { Game } from "@drincs/pixi-vn";
import { MovementController, type Point } from "../../src/engine/movement/MovementController";
import { SpatialInteractions } from "../../src/engine/interaction/SpatialInteractions";
import { createPixiStorageCheckpoint } from "../../src/engine/world/createPixiStorageCheckpoint";

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const isPoint = (value: unknown): value is Point => value !== null && typeof value === "object" &&
  "x" in value && "y" in value && isNumber(value.x) && isNumber(value.y);
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

/** An unrendered, story-neutral scenario using the production engine and Pixi'VN save API. */
export async function exercisePortableScene() {
  const position = createPixiStorageCheckpoint("portability.test-scene.test-player", isPoint);
  const observed = createPixiStorageCheckpoint("portability.test-scene.observed", isBoolean);
  const player = new MovementController({
    position: { x: 10, y: 10 }, bounds: { x: 0, y: 0, width: 200, height: 100 },
    speed: 100, footprintRadius: 2,
  });
  player.update({ x: 1, y: 0 }, 50);
  position.write(player.state.position);
  const actions = new SpatialInteractions(() => player.state.position, [{
    id: "test-interactable", prompt: "Inspect", target: () => ({ x: 18, y: 10 }), range: 5,
    execute: () => observed.write(true),
  }]);
  const available = actions.available()?.id;
  actions.available()?.execute();
  const savedPosition = { ...player.state.position };
  const serialized = JSON.stringify(await Game.exportGameState());
  player.update({ x: 1, y: 0 }, 50);
  const laterPosition = { ...player.state.position };
  position.write(player.state.position);
  observed.write(false);
  await Game.restoreGameState(JSON.parse(serialized));
  player.restore(position.read()!);
  return { available, savedPosition, laterPosition,
    restoredPosition: player.state.position, restoredNarrativeState: observed.read(),
    keys: JSON.parse(serialized).storageData.main.map((item: { key: string }) => item.key) as string[] };
}

import { expect, test } from "@playwright/test";

test("a neutral scene moves, interacts and restores its PixiVN state without Journey content", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const url = "/tests/e2e/portabilityProbe.ts";
    return (await import(url)).exercisePortableScene();
  });
  expect(result.available).toBe("test-interactable");
  expect(result.savedPosition).toEqual({ x: 15, y: 10 });
  expect(result.laterPosition).toEqual({ x: 20, y: 10 });
  expect(result.restoredPosition).toEqual(result.savedPosition);
  expect(result.restoredNarrativeState).toBe(true);
  expect(result.keys).toContain("storage:portability.test-scene.test-player");
  expect(result.keys).toContain("storage:portability.test-scene.observed");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("a new game can choose movement keys without changing the movement controller", async ({ page }) => {
  await page.goto("/");
  const direction = await page.evaluate(async () => {
    const url = "/src/engine/movement/keyboardMovement.ts";
    const { keyboardMovement } = await import(url);
    const surface = document.createElement("button");
    document.body.append(surface);
    surface.focus();
    const input = keyboardMovement(surface, {
      up: ["KeyI"], down: ["KeyK"], left: ["KeyJ"], right: ["KeyL"],
    });
    surface.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyL", bubbles: true }));
    const result = input.read();
    input.dispose();
    surface.remove();
    return result;
  });
  expect(direction).toEqual({ x: 1, y: 0 });
});

test("a neutral interactable can use the shared focused input binding", async ({ page }) => {
  await page.goto("/");
  const count = await page.evaluate(async () => {
    const actionUrl = "/src/engine/interaction/SpatialInteractions.ts";
    const inputUrl = "/src/engine/interaction/bindInteractionKey.ts";
    const { SpatialInteractions } = await import(actionUrl);
    const { bindInteractionKey } = await import(inputUrl);
    const surface = document.createElement("button");
    document.body.append(surface);
    let calls = 0;
    const actions = new SpatialInteractions(() => ({ x: 0, y: 0 }), [{
      id: "test-door", prompt: "Open", target: () => ({ x: 1, y: 0 }), range: 2,
      execute: () => { calls++; },
    }]);
    const dispose = bindInteractionKey(surface, () => actions.available()?.execute());
    surface.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", bubbles: true }));
    surface.focus();
    surface.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", bubbles: true }));
    surface.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE", repeat: true, bubbles: true }));
    dispose();
    surface.remove();
    return calls;
  });
  expect(count).toBe(1);
});

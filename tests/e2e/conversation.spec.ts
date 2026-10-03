import { expect, test, type Page } from "@playwright/test";

const actors = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/deckProbe.ts";
  return (await import(url)).inspectDeck()?.actors as { id: string; x: number; y: number }[];
});
const playerX = async (page: Page) => (await actors(page)).find((actor) => actor.id === "playerSpawn")!.x;
async function approach(page: Page) {
  await page.locator("#root canvas").focus();
  const positions = await actors(page);
  const key = positions.find((a) => a.id === "playerSpawn")!.x <
    positions.find((a) => a.id === "journey-deckhand")!.x ? "d" : "a";
  await page.keyboard.down(key);
  // The shared E prompt can offer the optional cargo inspection nearby.
  try { await expect(page.getByTestId("talk-prompt")).toHaveText("E · Hablar con el marinero", { timeout: 20_000 }); }
  finally { await page.keyboard.up(key); }
}
async function begin(page: Page) {
  // Canvas creation precedes the lazy scene; wait for its actual input UI.
  await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await approach(page);
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
}
async function choices(page: Page) {
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-speaker")).toHaveText("Marlow");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}

test("proximity, walking, hearing range and a complete PixiVN conversation coexist", async ({ page }, info) => {
  test.setTimeout(65_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByTestId("talk-prompt")).toBeDisabled();
  await page.locator("#root canvas").press("e");
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await begin(page);
  await expect(page.locator(".journey-conversation")).toHaveAttribute("data-beat", "listening");
  const before = await actors(page);
  await expect.poll(async () => (await actors(page)).find((a) => a.id === "journey-deckhand")!.x,
    { timeout: 10_000 }).not.toBe(before.find((a) => a.id === "journey-deckhand")!.x);
  await page.keyboard.down("d");
  const sample = await page.evaluate(async () => {
    const url = "/tests/e2e/deckProbe.ts";
    return (await import(url)).measureMovementFrames(12);
  });
  await page.keyboard.up("d");
  expect(sample.simultaneousFrames).toBeGreaterThan(0);
  expect(sample.distance / sample.seconds).toBeCloseTo(240, 4);
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  // Held E repeats must not skip the first line or the choice step.
  await page.locator("canvas").dispatchEvent("keydown", { code: "KeyE", repeat: true });
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await choices(page);
  await page.keyboard.press("1");
  await expect(page.getByTestId("dialogue-text")).toContainText("¿Qué esconde el río");
  await expect(page.locator(".journey-conversation")).toHaveAttribute("data-beat", "river");
  expect(await page.evaluate(async () => {
    const url = "/tests/e2e/deckProbe.ts";
    return (await import(url)).inspectJourneyBeat();
  }))
    .toMatchObject({ river: 0.72, cargo: 0, title: 0.3 });
  await page.keyboard.down("a");
  await expect(page.getByTestId("dialogue-continue")).toBeDisabled({ timeout: 12_000 });
  await page.keyboard.up("a");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("¿Qué esconde el río");
  await expect(page.getByText("Acércate al marinero para continuar.")).toBeVisible();
  await page.keyboard.down("d");
  await expect(page.getByTestId("dialogue-continue")).toBeEnabled({ timeout: 12_000 });
  // Approach further before reading, leaving space for the NPC's continuing route.
  await expect.poll(() => playerX(page)).toBeGreaterThan(1150);
  await page.keyboard.up("d");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Una corriente");
  await page.screenshot({ path: info.outputPath("conversation-river.png") });
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("barandilla");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  expect(await page.evaluate(() => window.pixiVN.getState().dialogue)).toBeUndefined();
  expect(await page.evaluate(() => window.pixiVN.getState().labelsOpened)).toEqual([{ label: "start", currentStepIndex: 0 }]);
  await begin(page);
  await expect(page.getByTestId("dialogue-panel")).toHaveCount(1);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  expect(errors).toEqual([]);
});

test("mouse choices preserve movement and dialogue fits both supported viewports", async ({ page }, info) => {
  test.setTimeout(70_000);
  await page.goto("/");
  await begin(page);
  // Stay near the middle of the working route while reading and resizing.
  await page.keyboard.down("d");
  await expect.poll(() => playerX(page), { timeout: 15_000 }).toBeGreaterThan(1200);
  await page.keyboard.up("d");
  await choices(page);
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    const box = (await page.getByTestId("dialogue-panel").boundingBox())!;
    const canvas = (await page.locator("canvas").boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(canvas.x);
    expect(box.x + box.width).toBeLessThanOrEqual(canvas.x + canvas.width);
    expect(box.y + box.height).toBeLessThan(canvas.y + canvas.height * .72);
    await page.screenshot({ path: info.outputPath(`conversation-choices-${viewport.width}.png`) });
  }
  const before = await playerX(page);
  await page.keyboard.down("a");
  await page.getByTestId("dialogue-choice").nth(1).click();
  await expect(page.locator(".journey-conversation")).toHaveAttribute("data-beat", "cargo");
  expect(await page.evaluate(async () => {
    const url = "/tests/e2e/deckProbe.ts";
    return (await import(url)).inspectJourneyBeat();
  }))
    .toMatchObject({ river: 0.12, cargo: 0.8, title: 0.3 });
  await expect(page.locator("canvas")).toBeFocused();
  await expect.poll(() => playerX(page)).toBeLessThan(before - 30);
  await page.keyboard.up("a");
  await expect(page.getByTestId("dialogue-text")).toContainText("carga");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Las cajas");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("barandilla");
  await page.getByTestId("dialogue-continue").click();
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("scene restart disposes conversation controls and supports starting again", async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto("/");
  await begin(page);
  await choices(page);
  await page.evaluate(() => window.pixiVN.start("start", {}));
  await expect(page.getByTestId("dialogue-panel")).toHaveCount(1);
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(0);
  await begin(page);
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Desde aquí");
  await page.evaluate(() => window.pixiVN.start("start", {}));
  await expect(page.getByTestId("talk-prompt")).toHaveCount(1);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

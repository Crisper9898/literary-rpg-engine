import { expect, test, type Page } from "@playwright/test";

const observed = (page: Page) => page.evaluate(async () => {
  const url = "/src/content/state/journeyState.ts";
  return (await import(url)).hasInspectedCargoMark() as boolean;
});
const actors = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/deckProbe.ts";
  return (await import(url)).inspectDeck()!.actors as { id: string; x: number; y: number }[];
});

async function approachSailor(page: Page) {
  const positions = await actors(page);
  const player = positions.find((actor) => actor.id === "playerSpawn")!;
  const sailor = positions.find((actor) => actor.id === "journey-deckhand")!;
  await page.locator("canvas").focus();
  await page.keyboard.down(player.x < sailor.x ? "d" : "a");
  try { await expect(page.getByTestId("talk-prompt")).toBeEnabled({ timeout: 20_000 }); }
  finally { await page.keyboard.up(player.x < sailor.x ? "d" : "a"); }
}

async function askAboutCargo(page: Page) {
  await approachSailor(page);
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await page.keyboard.press("e");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("¿Para quién es la carga");
  await page.keyboard.press("e");
}

test("examining the optional cargo mark changes the sailor's later answer", async ({ page }, info) => {
  test.setTimeout(90_000);
  await page.goto("/");
  expect(await observed(page)).toBe(false);
  await page.locator("canvas").focus();
  await page.keyboard.down("a");
  try {
    await expect(page.getByTestId("talk-prompt")).toHaveText("E · Examinar tablilla de carga", { timeout: 25_000 });
  } finally { await page.keyboard.up("a"); }
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    await expect(page.getByTestId("talk-prompt")).toBeVisible();
    await page.screenshot({ path: info.outputPath(`cargo-before-${viewport.width}.png`) });
  }
  await page.keyboard.press("e");
  expect(await observed(page)).toBe(true);
  await expect(page.getByTestId("talk-prompt")).not.toHaveText("E · Examinar tablilla de carga");
  await askAboutCargo(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("marca raspada");
  await page.screenshot({ path: info.outputPath("cargo-answer-after-inspection.png") });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("ignoring the cargo mark keeps the ordinary answer", async ({ page }, info) => {
  test.setTimeout(60_000);
  await page.goto("/");
  expect(await observed(page)).toBe(false);
  await askAboutCargo(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("Las cajas tienen destino escrito");
  expect(await observed(page)).toBe(false);
  await page.screenshot({ path: info.outputPath("cargo-answer-ignored.png") });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

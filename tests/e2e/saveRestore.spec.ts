import { expect, test, type Page } from "@playwright/test";

const probe = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).inspectRestoredJourney() as { inspected: boolean; scene: boolean };
});
const save = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).saveJourney() as Promise<string>;
});
const restore = (page: Page, serialized: string) => page.evaluate(async (saved) => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  await (await import(url)).restoreJourney(saved);
}, serialized);
const actors = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/deckProbe.ts";
  return (await import(url)).inspectDeck()!.actors as { id: string; x: number; y: number }[];
});
const scenery = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).sampleRestoredScenery() as Promise<{ bank: number; fog: number }>;
});

async function inspectCargoTally(page: Page) {
  await page.locator("canvas").focus();
  await page.keyboard.down("a");
  try {
    await expect(page.getByTestId("talk-prompt")).toHaveText("E · Examinar tablilla de carga", { timeout: 25_000 });
  } finally { await page.keyboard.up("a"); }
  await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page)).inspected).toBe(true);
}

async function askSailorAboutCargo(page: Page) {
  const positions = await actors(page);
  const player = positions.find((actor) => actor.id === "playerSpawn")!;
  const sailor = positions.find((actor) => actor.id === "journey-deckhand")!;
  const key = player.x < sailor.x ? "d" : "a";
  await page.locator("canvas").focus();
  await page.keyboard.down(key);
  try { await expect(page.getByTestId("talk-prompt")).toHaveText("E · Hablar con el marinero", { timeout: 25_000 }); }
  finally { await page.keyboard.up(key); }
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await page.keyboard.press("e");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("¿Para quién es la carga");
  await page.keyboard.press("e");
}

test("inspected tally survives PixiVN export/restore and changes later dialogue", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await inspectCargoTally(page);
  const serialized = await save(page);
  expect(JSON.parse(serialized).storageData).toBeDefined();
  // Keep the serialized save outside the page to prove it survives a fresh load.
  await page.reload();
  expect((await probe(page)).inspected).toBe(false);
  await restore(page, serialized);
  expect(await probe(page)).toEqual({ inspected: true, scene: true });
  const motion = await scenery(page);
  expect(motion.bank).not.toBe(0);
  expect(motion.fog).not.toBe(0);
  await askSailorAboutCargo(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("marca raspada");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("ignored tally restores the original answer even after inspection in the current run", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  expect((await probe(page)).inspected).toBe(false);
  const serialized = await save(page);
  await inspectCargoTally(page);
  expect((await probe(page)).inspected).toBe(true);
  await restore(page, serialized);
  expect((await probe(page)).inspected).toBe(false);
  await askSailorAboutCargo(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("Las cajas tienen destino escrito");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

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
  return (await import(url)).restoreJourney(saved);
}, serialized);
const actors = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/deckProbe.ts";
  return (await import(url)).inspectDeck()!.actors as { id: string; x: number; y: number }[];
});
const scenery = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).sampleRestoredScenery() as Promise<{ bank: number; fog: number }>;
});
const playerPosition = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).playerPosition() as { x: number; y: number };
});
const mountSpatial = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  (await import(url)).mountSpatialJourney();
});
const advanceVoyage = (page: Page, ticks: number) => page.evaluate(async (count) => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  (await import(url)).advanceVoyage(count);
}, ticks);
const phase = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/saveRestoreProbe.ts";
  return (await import(url)).journeyPhase() as { distance: number; progress: number; fogAlpha: number; worldTint: number };
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

test("Marlow returns to the saved world coordinates after moving elsewhere", async ({ page }) => {
  test.setTimeout(55_000);
  await page.goto("/");
  await page.locator("canvas").focus();
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await playerPosition(page)).x).toBeGreaterThan(850); }
  finally { await page.keyboard.up("d"); }
  const saved = await playerPosition(page);
  expect(saved.x).toBeGreaterThan(850);
  const serialized = await save(page);
  const savedPosition = JSON.parse(serialized).storageData.main
    .find((entry: { key: string }) => entry.key === "storage:journey.playerPosition")?.value;
  expect(savedPosition).toEqual(saved);
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await playerPosition(page)).x).toBeGreaterThan(saved.x + 100); }
  finally { await page.keyboard.up("d"); }
  expect((await playerPosition(page)).x).toBeGreaterThan(saved.x + 100);
  expect((await restore(page, serialized)).position).toEqual(saved);
  await expect.poll(() => playerPosition(page)).toEqual(saved);
  await page.waitForTimeout(250);
  expect(await playerPosition(page)).toEqual(saved);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("restoring an earlier voyage phase restores its river progress and fog", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await mountSpatial(page);
  await advanceVoyage(page, 1000);
  await expect.poll(async () => (await phase(page)).fogAlpha, { timeout: 20_000 }).toBeGreaterThan(.15);
  const saved = await phase(page);
  const serialized = await save(page);
  const checkpoint = Object.fromEntries(JSON.parse(serialized).storageData.main
    .filter((entry: { key: string }) => ["storage:journey.voyageDistance", "storage:journey.atmosphereProgress"].includes(entry.key))
    .map((entry: { key: string; value: number }) => [entry.key, entry.value])) as Record<string, number>;
  expect(checkpoint["storage:journey.voyageDistance"]).toBeGreaterThan(1400);
  expect(checkpoint["storage:journey.atmosphereProgress"]).toBeGreaterThan(0);
  await advanceVoyage(page, 1200);
  await expect.poll(async () => (await phase(page)).fogAlpha, { timeout: 20_000 })
    .toBeGreaterThan(saved.fogAlpha + .2);
  const later = await phase(page);
  expect(later.distance).toBeGreaterThan(saved.distance + 1700);
  const restored = await restore(page, serialized);
  expect(restored.distance).toBe(checkpoint["storage:journey.voyageDistance"]);
  expect(restored.atmosphereProgress).toBe(checkpoint["storage:journey.atmosphereProgress"]);
  await expect.poll(async () => (await phase(page)).distance, { timeout: 5000 })
    .toBeLessThan(later.distance - 1000);
  await expect.poll(async () => (await phase(page)).fogAlpha, { timeout: 20_000 })
    .toBeLessThan(later.fogAlpha - .1);
  expect((await phase(page)).worldTint).toBeGreaterThan(later.worldTint);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

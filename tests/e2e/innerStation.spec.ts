import { expect, test, type Page } from "@playwright/test";
const probe = (page: Page, method: string, value?: string | number) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/stationProbe.ts"; return (await import(url))[method](value);
}, { method, value });
async function boot(page: Page) { await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible(); }
async function arrive(page: Page) {
  await boot(page); await probe(page, "prepare"); await page.locator("canvas").focus(); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("La estación. Aminoro");
  await page.keyboard.press("e"); await probe(page, "dockTo", 1); await probe(page, "go", "bow");
  await expect(page.getByTestId("talk-prompt")).toContainText("Desembarcar"); await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).space).toBe("inner-station");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
}
async function observe(page: Page, id: string, text: string) {
  await probe(page, "go", id); await expect(page.getByTestId("talk-prompt")).toContainText("Observar");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(text);
  await page.keyboard.press("e");
}
async function toChoice(page: Page) {
  for (let i = 0; i < 16; i++) {
    if (await page.getByTestId("dialogue-choice").count()) break;
    await page.keyboard.press("e"); await page.waitForTimeout(120);
  }
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}
test("the station unlocks after the attack, and saved mooring reconstructs its exact progress", async ({ page }) => {
  test.setTimeout(90000); await boot(page); await probe(page, "prepare", .85);
  await page.locator("canvas").focus(); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).space).toBe("approach");
  await probe(page, "prepare"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Aminoro"); await page.keyboard.press("e");
  await probe(page, "dockTo", .4); const during = await probe(page, "save");
  await probe(page, "dockTo", 1); const restored = await probe(page, "restore", during.data);
  expect(restored.dock).toBe(during.dock); expect(restored.space).toBe("station-arrival");
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await probe(page, "dockTo", 1); await probe(page, "go", "bow");
  await expect(page.getByTestId("talk-prompt")).toContainText("Desembarcar");
  expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
});
for (const choice of [1, 2]) test(`Russian investigation ${choice}: previous evidence, topic order, stance and canonical restores`, async ({ page }) => {
  test.setTimeout(120000); await arrive(page);
  const firstPosition = (await probe(page, "inspect")).position;
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await probe(page, "inspect")).position.x).toBeGreaterThan(firstPosition.x + 25); }
  finally { await page.keyboard.up("d"); }
  expect((await probe(page, "inspect")).russianVisible).toBe(false);
  await observe(page, "planks", "tablones"); expect((await probe(page, "inspect")).russianVisible).toBe(false);
  const before = await probe(page, "save"); await observe(page, "fence", "postes");
  await expect(page.getByTestId("dialogue-text")).toContainText("travesaño cruje");
  const creak = await probe(page, "save"); await page.keyboard.press("e");
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).event.occurred).toBe(false);
  await probe(page, "restore", creak.data); await expect(page.getByTestId("dialogue-text")).toContainText("travesaño cruje");
  expect((await probe(page, "inspect")).labels).toHaveLength(1); await page.keyboard.press("e");
  await observe(page, "grass", "todavía se camina"); await observe(page, "house", "Kurtz");
  await probe(page, "go", "russian"); await expect(page.getByTestId("talk-prompt")).toContainText("ruso");
  await page.keyboard.press("e"); await toChoice(page);
  const atChoice = await probe(page, "save"); await page.keyboard.press(String(choice));
  await expect.poll(async () => (await probe(page, "inspect")).topics[0]).toBe(choice === 1 ? "kurtz" : "station");
  await probe(page, "restore", atChoice.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press(String(choice)); await toChoice(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("tranquilidad prestada");
  await page.keyboard.press(String(choice)); await toChoice(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("admiración ocupa"); await page.keyboard.press(String(choice));
  for (let i = 0; i < 5 && await page.getByTestId("dialogue-panel").isVisible(); i++) { await page.keyboard.press("e"); await page.waitForTimeout(120); }
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  const state = await probe(page, "save"); expect(state.stance).toBe(choice === 1 ? "listen" : "question"); expect(state.topics).toHaveLength(4);
  await probe(page, "go", "planks"); const restored = await probe(page, "restore", state.data);
  expect(restored.stance).toBe(state.stance); expect(restored.topics).toEqual(state.topics); expect(restored.position).toEqual(state.position);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "Usted me dejó hablar" : "no confiara");
  await page.keyboard.press("e"); await probe(page, "go", "closing");
  await expect(page.getByTestId("talk-prompt")).toContainText("Prepararse"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("falta conocer al hombre");
  await page.keyboard.press("e"); await page.keyboard.press("e");
  const closed = await probe(page, "save"); await probe(page, "restore", closed.data);
  expect((await probe(page, "inspect")).prepared).toBe(true); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
  await expect(page.locator(".journey-conversation")).toHaveCount(1);
  await probe(page, "restart"); expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

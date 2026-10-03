import { expect, test, type Page } from "@playwright/test";
const probe = (page: Page, method: string, value?: string | number) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/approachProbe.ts"; return (await import(url))[method](value);
}, { method, value });
test("navigation atmosphere, attack, helmsman and recovery remain readable at both sizes", async ({ page }, info) => {
  test.setTimeout(120_000);
  await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await probe(page, "prepareHut", "proceed"); await page.locator("canvas").focus(); await page.keyboard.press("e");
  await probe(page, "nearHelm"); await expect(page.getByTestId("talk-prompt")).toContainText("Reanudar");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("sonda preparada");
  await expect.poll(async () => (await probe(page, "inspect")).loadedArt).toBe(true);
  await page.keyboard.press("e");
  for (const [phase, progress] of [["fog", .4], ["attack", .57], ["helmsman", .67], ["recovery", 1]] as const) {
    if (phase === "recovery") {
      await expect.poll(async () => (await probe(page, "inspect")).navigation.interruptionMS).toBe(0);
      await page.keyboard.press("e"); await expect.poll(async () => (await probe(page, "inspect")).atHelm).toBe(true);
      await page.keyboard.press("Space");
    }
    await probe(page, "travelTo", progress);
    // Drain earlier queued lines, but preserve the current key scene beat for QA.
    const final = phase === "fog" ? "estribor" : phase === "attack" ? "Flechas" :
      phase === "helmsman" ? "cae junto a la rueda" : "Estación Interior";
    for (let i = 0; i < 6; i++) {
      await expect(page.getByTestId("dialogue-panel")).toBeVisible();
      if ((await page.getByTestId("dialogue-text").textContent())?.includes(final)) break;
      await page.keyboard.press("e");
    }
    await expect(page.getByTestId("dialogue-text")).toContainText(final);
    await expect.poll(async () => Math.abs((await probe(page, "inspect")).atmosphere -
      (await probe(page, "inspect")).navigation.progress), { timeout: 15000 }).toBeLessThan(.025);
    if (phase === "helmsman") await expect.poll(async () => (await probe(page, "inspect")).navigation.interruptionMS,
      { timeout: 15000 }).toBe(0);
    const startFog = (await probe(page, "inspect")).fogX;
    await expect.poll(async () => (await probe(page, "inspect")).fogX).not.toBe(startFog);
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport);
      for (const element of [page.getByTestId("dialogue-panel"), page.getByTestId("dialogue-continue"), page.getByTestId("navigation-status")]) {
        const box = await element.boundingBox(); expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
      }
      await page.screenshot({ path: info.outputPath(`approach-${phase}-${viewport.width}x${viewport.height}.png`) });
    }
    await page.locator("canvas").focus(); await page.keyboard.press("e");
    if (phase === "helmsman") { await expect(page.getByTestId("dialogue-text")).toContainText("juntos"); await page.keyboard.press("e"); }
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  }
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

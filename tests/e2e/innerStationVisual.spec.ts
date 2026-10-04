import { expect, test, type Page } from "@playwright/test";
const probe = (page: Page, method: string, value?: string | number) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/stationProbe.ts"; return (await import(url))[method](value);
}, { method, value });
test("station arrival, exploration, Russian expressions, choices and closing fit both sizes", async ({ page }, info) => {
  test.setTimeout(180000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport);
      await expect.poll(async () => {
        const size = await probe(page, "settleFrame");
        return size.pixels.every((value: number, i: number) => Math.abs(value - size.display[i] * size.ratio) < 2);
      }).toBe(true);
      for (const element of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"), page.getByTestId("journey-controls-hint"),
        ...await page.getByTestId("dialogue-choice").all()]) {
        if (!await element.isVisible()) continue;
        const box = await element.boundingBox(); expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.y).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
        expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
      }
      const screenshot = await page.screenshot({ path: info.outputPath(`station-${id}-${viewport.width}x${viewport.height}.png`) });
      // The right-hand house/path sample excludes DOM UI. A cleared WebGL frame
      // must fail visual QA instead of silently passing dialogue-bounds checks.
      const artVisible = await page.evaluate(async data => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        const sample = document.createElement("canvas"); sample.width = sample.height = 100;
        const context = sample.getContext("2d")!; context.drawImage(image, 0, 0, 100, 100);
        const pixels = context.getImageData(55, 35, 35, 35).data;
        let visible = 0; for (let i = 0; i < pixels.length; i += 4) if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 30) visible++;
        return visible / (pixels.length / 4);
      }, screenshot.toString("base64"));
      expect(artVisible, `${id} ${viewport.width}: scene must be rendered, not just the DOM`).toBeGreaterThan(.2);
    }
    await page.locator("canvas").focus();
  };
  const nextChoice = async () => {
    for (let i = 0; i < 16 && !await page.getByTestId("dialogue-choice").count(); i++) {
      await page.keyboard.press("e"); await page.waitForTimeout(120);
    }
    await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  };
  await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await probe(page, "prepare"); await page.locator("canvas").focus(); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Aminoro");
  await expect.poll(async () => (await probe(page, "inspect")).arrivalArtReady).toBe(true);
  await probe(page, "dockTo", .45); await capture("arrival");
  await page.keyboard.press("e"); await probe(page, "dockTo", 1); await probe(page, "go", "bow");
  await expect(page.getByTestId("talk-prompt")).toContainText("Desembarcar"); await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).plateReady).toBe(true);
  await probe(page, "go", "planks"); await capture("exploration");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("tablones");
  await page.keyboard.press("e"); await probe(page, "go", "fence");
  await expect(page.getByTestId("talk-prompt")).toContainText("cerca"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("postes"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("travesaño cruje"); await capture("atmosphere");
  await page.keyboard.press("e"); await probe(page, "go", "russian");
  await expect(page.getByTestId("talk-prompt")).toContainText("ruso"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Ruso, marinero"); await capture("meeting");
  await nextChoice(); await capture("conversation"); await page.keyboard.press("1");
  await expect(page.getByTestId("dialogue-text")).toContainText("Está arriba"); await capture("fervent");
  await nextChoice(); await page.keyboard.press("2"); await nextChoice(); await page.keyboard.press("2");
  for (let i = 0; i < 5 && await page.getByTestId("dialogue-panel").isVisible(); i++) { await page.keyboard.press("e"); await page.waitForTimeout(120); }
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await probe(page, "go", "closing"); await expect(page.getByTestId("talk-prompt")).toContainText("Prepararse");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("falta conocer al hombre");
  await expect.poll(async () => { const s = await probe(page, "inspect"); return Math.abs(s.atmosphere - s.pressure); }).toBeLessThan(.025);
  await capture("closing");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

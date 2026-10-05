import { expect, test } from "@playwright/test";
import { probe, boot, closeDialogue } from "./kurtzTestDriver";
test("Kurtz visual direction: ten moments, full art and accessible choices at both resolutions", async ({ page }, info) => {
  test.setTimeout(240000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const size = await probe(page, "settleFrame");
        return size.pixels.every((value: number, i: number) => Math.abs(value - size.display[i] * size.ratio) < 2); }).toBe(true);
      for (const element of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"),
        page.getByTestId("journey-controls-hint"), ...await page.getByTestId("dialogue-choice").all()]) {
        if (!await element.isVisible()) continue;
        const b = await element.boundingBox(); expect(b).not.toBeNull(); expect(b!.x).toBeGreaterThanOrEqual(0);
        expect(b!.y).toBeGreaterThanOrEqual(0); expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width);
        expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
      }
      const screenshot = await page.screenshot({ path: info.outputPath(`kurtz-${id}-${viewport.width}x${viewport.height}.png`) });
      const visibility = await page.evaluate(async data => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        const sample = document.createElement("canvas"); sample.width = sample.height = 100;
        const context = sample.getContext("2d")!; context.drawImage(image, 0, 0, 100, 100);
        const pixels = context.getImageData(55, 35, 35, 35).data;
        let visible = 0; for (let i = 0; i < pixels.length; i += 4) if (pixels[i] + pixels[i + 1] + pixels[i + 2] > 30) visible++;
        return visible / (pixels.length / 4);
      }, screenshot.toString("base64")); expect(visibility).toBeGreaterThan(.2);
    }
    await page.locator("canvas").focus();
  };
  await boot(page); await probe(page, "seed"); await page.locator("canvas").focus();
  await expect.poll(async () => (await probe(page, "inspect")).ready).toBe(true);
  await capture("before"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Kurtz está aquí"); await closeDialogue(page);
  await probe(page, "advanceTo", 16000); await capture("anticipation");
  await probe(page, "advanceTo", 33000); await capture("silhouette");
  await probe(page, "advanceTo", 45000); await capture("full");
  await probe(page, "go", "russian"); await capture("russian");
  await probe(page, "advanceTo", 48500); await capture("coughing");
  await probe(page, "advanceTo", 52000); await probe(page, "go", "kurtz"); await capture("marlow");
  await expect(page.getByTestId("talk-prompt")).toContainText("Hablar con Kurtz"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Marlow"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choices");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("sabe escuchar"); await capture("intense");
  await closeDialogue(page); await capture("weak");
  const before = (await probe(page, "inspect")).player.x; await page.keyboard.down("a");
  try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(before - 20); }
  finally { await page.keyboard.up("a"); }
  await capture("control-returned"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

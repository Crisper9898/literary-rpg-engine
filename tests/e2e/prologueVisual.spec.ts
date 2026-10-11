import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./prologueTestDriver";

test("prologue visual QA: exploration, opening, observation and ellipsis at both sizes", async ({ page }, info) => {
  test.setTimeout(180000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const s = await probe(page, "settleFrame");
        return s.pixels.every((v: number, i: number) => Math.abs(v - s.display[i] * s.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"), page.getByTestId("journey-controls-hint")]) {
        if (!await node.isVisible()) continue; const b = await node.boundingBox(); expect(b).not.toBeNull();
        expect(b!.x).toBeGreaterThanOrEqual(0); expect(b!.y).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width); expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
      await page.screenshot({ path: info.outputPath(`prologue-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await boot(page); await capture("arrival"); await close(page); await capture("exploration");
  await interact(page, "mooring", "agua del fondeadero"); await capture("anchorage"); await close(page);
  await interact(page, "horizon", "Comenzar el relato"); await capture("opening"); await page.keyboard.press("e"); await capture("roman-comparison");
  await page.keyboard.press("e"); await capture("memory"); await close(page); await capture("ready");
  await interact(page, "director", "Continuar el viaje"); const saved = await probe(page, "save"); await capture("ellipsis");
  await close(page); await probe(page, "restore", saved.data); await capture("restored-ellipsis");
  expect((await probe(page, "inspect")).state.phase).toBe("ready"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, interact, close, probe } from "./thamesTestDriver";

test("Thames visual QA: Nellie, ebb, horizon, final line and restoration", async ({ page }, info) => {
  test.setTimeout(240000);
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
      await page.screenshot({ path: info.outputPath(`thames-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await interact(page, "entry", "Regresar al relato"); await capture("arrival"); await close(page); await capture("quiet");
  await interact(page, "mooring", "agua junto a la amarra"); await capture("mooring"); await close(page);
  await interact(page, "director", "Escuchar al Director"); await capture("silence"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("comienzo del reflujo"); await capture("director"); await close(page); await capture("ebb");
  await interact(page, "horizon", "Levantar la mirada"); await capture("horizon"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("inmensa oscuridad"); const saved = await probe(page, "save");
  await capture("ending"); await close(page); await capture("complete");
  await probe(page, "restore", saved.data); await capture("restored-ending");
  expect((await probe(page, "inspect")).state.phase).toBe("ebb"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

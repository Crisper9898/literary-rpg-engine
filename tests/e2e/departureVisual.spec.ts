import { expect, test } from "@playwright/test";
import { prepare, board, release, decision, interact, close, probe } from "./departureTestDriver";
test("departure visual QA: boarding, bank, two responses, manoeuvre and restore at both sizes", async ({ page }, info) => {
  test.setTimeout(240000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const s = await probe(page, "settleFrame");
        return s.pixels.every((v: number, i: number) => Math.abs(v - s.display[i] * s.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"),
        page.getByTestId("journey-controls-hint"), ...await page.getByTestId("dialogue-choice").all()]) {
        if (!await node.isVisible()) continue; const b = await node.boundingBox(); expect(b).not.toBeNull();
        expect(b!.x).toBeGreaterThanOrEqual(0); expect(b!.y).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width); expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      expect((await probe(page, "inspect")).artReady).toBe(true);
      await page.screenshot({ path: info.outputPath(`departure-${id}-${viewport.width}x${viewport.height}.png`) });
    }
    await page.locator("canvas").focus();
  };
  await prepare(page); await board(page); await capture("aboard");
  await interact(page, "patient", "Kurtz"); await capture("patient"); await close(page);
  await release(page); await capture("bank"); await interact(page, "bank", "orilla"); await capture("woman"); await close(page);
  await decision(page); await capture("choice"); const saved = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("Tiro"); await capture("whistle"); await close(page);
  await interact(page, "helm", "Dar la señal"); await capture("manoeuvre"); await close(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("El silbato apartó", { timeout: 50000 }); await capture("departed"); await close(page);
  await probe(page, "restore", saved.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("iré hasta"); await capture("intervene"); await close(page);
  await interact(page, "crew", "bajen"); await capture("crew"); await close(page);
  await interact(page, "whistle", "Tirar"); await close(page);
  const restored = await probe(page, "save"); await probe(page, "restore", restored.data); await capture("restored");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

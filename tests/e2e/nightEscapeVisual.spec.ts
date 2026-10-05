import { expect, test } from "@playwright/test";
import { reveal, start, darken, examine, close, escort, probe } from "./nightEscapeTestDriver";
test("night station and clearing visual QA: twelve beats, both decisions and restored dialogue at both sizes", async ({ page }, info) => {
  test.setTimeout(300000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const s = await probe(page, "settleFrame");
        return s.pixels.every((v: number, i: number) => Math.abs(v - s.display[i] * s.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"),
        page.getByTestId("journey-controls-hint"), ...await page.getByTestId("dialogue-choice").all()]) {
        if (!await node.isVisible()) continue;
        const b = await node.boundingBox(); expect(b).not.toBeNull();
        expect(b!.x).toBeGreaterThanOrEqual(0); expect(b!.y).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width); expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      expect((await probe(page, "inspect")).artReady).toBe(true);
      await page.screenshot({ path: info.outputPath(`night-${id}-${viewport.width}x${viewport.height}.png`) });
    }
    await page.locator("canvas").focus();
  };
  await reveal(page); await start(page); await darken(page); await capture("station");
  await probe(page, "go", "bed"); await expect(page.getByTestId("talk-prompt")).toContainText("vacío");
  await capture("empty"); await page.keyboard.press("e"); await close(page);
  await examine(page, "grass", "hierba"); await capture("first-clue"); await close(page);
  await examine(page, "prints", "barro"); await capture("tracking"); await close(page);
  await examine(page, "branches", "ramas"); await close(page);
  await examine(page, "exit", "Cruzar"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).forest, { timeout: 20000 }).toBeGreaterThan(.99);
  await capture("forest-entry"); await examine(page, "kurtz", "sin alzar"); await capture("encounter");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("planes inmensos");
  await capture("dominant"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choice");
  const chosen = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("mañana podrá"); await capture("reason");
  await probe(page, "restore", chosen.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("Esta noche vuelve"); await capture("challenge");
  const active = await probe(page, "save"); await close(page); await escort(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("Bajamos juntos"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).forest, { timeout: 20000 }).toBeLessThan(.01);
  await probe(page, "go", "bed"); await capture("return");
  await probe(page, "restore", active.data); await expect(page.getByTestId("dialogue-text")).toContainText("Esta noche vuelve");
  await capture("restore"); expect((await probe(page, "inspect")).state.choice).toBe("challenge");
  expect((await probe(page, "inspect")).entities.every((entity: { count: number }) => entity.count === 1)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

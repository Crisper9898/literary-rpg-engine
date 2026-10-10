import { expect, test } from "@playwright/test";
import { prepare, start, interact, words, depart, announce, close, probe } from "./finalNightTestDriver";

test("final night visual QA: candle, both responses, final words, death and restore at both sizes", async ({ page }, info) => {
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
      const s = await probe(page, "inspect"); expect(s.artReady).toBe(true);
      expect(s.patientFrame.width).toBe(768); expect(s.patientFrame.height).toBe(512);
      expect(s.patientSize).toEqual({ width: 315, height: 210 });
      await page.screenshot({ path: info.outputPath(`final-night-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await start(page); await capture("evening");
  await interact(page, "candle", "Tomar una vela"); await capture("held"); await close(page);
  const held = await probe(page, "save");
  await interact(page, "patient", "Acercar la vela"); await capture("bedside"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choice"); const choice = await probe(page, "save");
  await page.keyboard.press("1"); await capture("reassure"); await close(page);
  await words(page); await capture("last-words"); const last = await probe(page, "save"); await close(page);
  await depart(page); await capture("out"); await announce(page); await capture("announcement");
  await page.keyboard.press("e"); await capture("papers"); await close(page);
  await probe(page, "restore", held.data); await capture("restored-held");
  await probe(page, "restore", choice.data); await page.keyboard.press("2"); await capture("listen"); await close(page);
  await probe(page, "restore", last.data); await capture("restored-words");
  expect((await probe(page, "inspect")).patientFrame).toEqual({ x: 0, y: 512, width: 768, height: 512 });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

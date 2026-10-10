import { expect, test } from "@playwright/test";
import { prepare, start, halt, papers, repair, interact, close, probe } from "./breakdownTestDriver";
test("breakdown visual QA: island, repair, both papers responses and restore at both sizes", async ({ page }, info) => {
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
      const actor = await probe(page, "inspect");
      expect(actor.patientFrame).toEqual({ x: actor.state.phase === "stopped" ? 768 : 0,
        y: actor.state.phase === "stopped" ? 512 : 0, width: 768, height: 512 });
      expect(actor.patientSize).toEqual({ width: 315, height: 210 });
      await page.screenshot({ path: info.outputPath(`breakdown-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await start(page); await capture("downstream"); await halt(page); await capture("island");
  await papers(page); await capture("choice"); const choice = await probe(page, "save");
  await page.keyboard.press("1"); await capture("sealed"); await close(page); await repair(page); await capture("repaired");
  await interact(page, "helm", "Probar la máquina"); await page.keyboard.press("e"); await capture("resumed"); await close(page);
  await probe(page, "restore", choice.data); await page.keyboard.press("2"); await capture("ask");
  await page.keyboard.press("e"); await capture("photograph"); await close(page);
  await interact(page, "engine", "Examinar"); await capture("engine"); await close(page);
  await interact(page, "forge", "Avivar"); await capture("forge"); await close(page);
  await probe(page, "go", "far"); const work = await probe(page, "save"); await probe(page, "restore", work.data); await capture("restored");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

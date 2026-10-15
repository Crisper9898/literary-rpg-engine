import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./centralTestDriver";

test("Central Station visual QA: march, both decisions, landing, wreck and restored dialogue at both sizes", async ({ page }, info) => {
  test.setTimeout(240000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const frame = await probe(page, "settleFrame");
        return frame.pixels.every((value: number, index: number) => Math.abs(value - frame.display[index] * frame.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"), page.getByTestId("journey-controls-hint"), page.getByTestId("dialogue-choice").nth(0), page.getByTestId("dialogue-choice").nth(1)]) {
        if (!await node.isVisible()) continue; const bounds = await node.boundingBox(); expect(bounds).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.y).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width); expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
      }
      await expect.poll(async () => { const state = await probe(page, "inspect"); return state.artReady && state.forestReady; }).toBe(true);
      const state = await probe(page, "inspect");
      expect(state.bounds.minX).toBeGreaterThanOrEqual(0); expect(state.bounds.minY).toBeGreaterThanOrEqual(0);
      expect(state.bounds.maxX).toBeLessThanOrEqual(1920); expect(state.bounds.maxY).toBeLessThanOrEqual(1080);
      if (!state.caravan) expect(state.gateAboveSoil && state.wreck).toBe(true);
      await page.screenshot({ path: info.outputPath(`central-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await boot(page); await capture("trail-intro"); await close(page); await capture("trail-exploration");
  await interact(page, "village", "aldea abandonada"); await capture("village"); await close(page);
  await interact(page, "ravine", "atravesar el barranco"); await capture("ravine"); await close(page);
  await interact(page, "camp", "campamento"); await capture("camp"); await close(page);
  await interact(page, "companion", "compañero enfermo"); await page.keyboard.press("e");
  const pending = await probe(page, "save"); await capture("companion-choice");
  for (const response of ["shade", "load"]) {
    if (response === "load") await probe(page, "restore", pending.data);
    await page.keyboard.press(response === "shade" ? "1" : "2"); await capture(`companion-${response}`); await close(page);
    await interact(page, "arrival", "Estación Central");
    if (response === "shade") await capture("central-arrival"); await close(page);
    await interact(page, "agent", "noticia del vapor");
    if (response === "shade") await capture("wreck-news"); await close(page);
    await interact(page, "wreck", "vapor hundido"); await page.keyboard.press("e");
    await capture(`wreck-memory-${response}`); await close(page);
  }
  await interact(page, "exit", "una elipsis"); const saved = await probe(page, "save"); await capture("ellipsis");
  await close(page); await probe(page, "restore", saved.data); await capture("restored-ellipsis");
  expect((await probe(page, "inspect")).state.phase).toBe("ready"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

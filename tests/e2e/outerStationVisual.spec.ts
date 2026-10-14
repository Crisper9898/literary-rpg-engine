import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./outerTestDriver";

test("Outer Station visual QA: coast, landing, grove choices, accountant and restored memory at both sizes", async ({ page }, info) => {
  test.setTimeout(240000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const s = await probe(page, "settleFrame");
        return s.pixels.every((v: number, i: number) => Math.abs(v - s.display[i] * s.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"), page.getByTestId("journey-controls-hint"), page.getByTestId("dialogue-choice").nth(0), page.getByTestId("dialogue-choice").nth(1)]) {
        if (!await node.isVisible()) continue; const b = await node.boundingBox(); expect(b).not.toBeNull();
        expect(b!.x).toBeGreaterThanOrEqual(0); expect(b!.y).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width); expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      await expect.poll(async () => { const s = await probe(page, "inspect"); return s.artReady && s.forestReady; }).toBe(true);
      await page.screenshot({ path: info.outputPath(`outer-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await boot(page); await capture("coast-intro"); await close(page); await capture("coast-exploration");
  await interact(page, "surf", "Escuchar la rompiente"); await capture("surf"); await close(page);
  await interact(page, "warship", "buque de guerra"); await capture("warship"); await close(page);
  await interact(page, "landing", "Desembarcar"); await page.keyboard.press("e"); await capture("landing");
  expect((await probe(page, "inspect")).officeAboveSlope).toBe(true);
  await close(page); await capture("shore-exploration");
  await interact(page, "works", "maquinaria y el camino"); await page.keyboard.press("e"); await capture("chain-gang"); await close(page);
  await interact(page, "grove", "trabajadores en la sombra"); await page.keyboard.press("e");
  const pending = await probe(page, "save"); await capture("grove-choice");
  for (const response of ["give", "stay"]) {
    if (response === "stay") await probe(page, "restore", pending.data);
    await page.keyboard.press(response === "give" ? "1" : "2"); await capture(`grove-${response}`); await close(page);
    await interact(page, "accountant", "Escuchar al contable"); await page.keyboard.press("e"); await capture(`accountant-${response}`);
    await page.keyboard.press("e"); await capture(`memory-${response}`); await close(page);
  }
  await interact(page, "exit", "una elipsis"); const saved = await probe(page, "save"); await capture("ellipsis");
  await close(page); await probe(page, "restore", saved.data); await capture("restored-ellipsis");
  expect((await probe(page, "inspect")).state.phase).toBe("ready"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

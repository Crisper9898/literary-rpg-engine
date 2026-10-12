import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./commissionTestDriver";

test("commission visual QA: exploration, institutional pressure, both medical choices and farewell at both sizes", async ({ page }, info) => {
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
      await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
      await page.screenshot({ path: info.outputPath(`commission-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await boot(page); await capture("arrival"); await close(page); await capture("exploration");
  await interact(page, "map", "mapa de colores"); await capture("map"); await close(page);
  await interact(page, "recommendation", "recomendación de tu tía"); await page.keyboard.press("e"); await capture("fresleven"); await close(page);
  await interact(page, "threshold", "mujeres que tejen"); await capture("knitters"); await close(page);
  await interact(page, "contract", "Firmar el contrato"); await capture("contract"); await close(page);
  await interact(page, "doctor", "Presentarte ante el médico"); await page.keyboard.press("e");
  const pending = await probe(page, "save"); await capture("medical-choice");
  for (const response of ["return", "question"]) {
    if (response === "question") await probe(page, "restore", pending.data);
    await page.keyboard.press(response === "return" ? "1" : "2"); await page.keyboard.press("e"); await capture(`doctor-${response}`); await close(page);
    await interact(page, "threshold", "despedida de tu tía"); await page.keyboard.press("e"); await capture(`farewell-${response}`); await close(page);
  }
  await interact(page, "threshold", "Continuar hacia el vapor"); const saved = await probe(page, "save"); await capture("ellipsis");
  await close(page); await probe(page, "restore", saved.data); await capture("restored-ellipsis");
  expect((await probe(page, "inspect")).state.phase).toBe("ready"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, start, interact, close, probe } from "./aftermathTestDriver";

test("aftermath visual QA: absence, care choices, grey rest and recovery at both sizes", async ({ page }, info) => {
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
      expect((await probe(page, "inspect")).patientCount).toBe(0);
      await page.screenshot({ path: info.outputPath(`aftermath-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await start(page); await capture("morning");
  await interact(page, "burial", "noticia del entierro"); await capture("burial"); await close(page);
  await interact(page, "papers", "Resguardar los papeles"); await capture("papers"); await close(page);
  await interact(page, "care", "Buscar apoyo"); await capture("fever"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choice"); const choice = await probe(page, "save");
  await page.keyboard.press("1"); await capture("help"); await page.keyboard.press("e"); await capture("water-help"); await close(page);
  await interact(page, "shelter", "Resguardarte junto a la caseta"); await capture("rest"); const rest = await probe(page, "save"); await close(page);
  await interact(page, "recovery", "Volver a mirar la corriente"); await capture("recovery"); await close(page);
  await probe(page, "restore", choice.data); await page.keyboard.press("2"); await capture("alone"); await close(page);
  await interact(page, "water", "Buscar agua"); await capture("water-alone"); await close(page);
  await probe(page, "restore", rest.data); await capture("restored-rest");
  expect((await probe(page, "inspect")).state.phase).toBe("resting");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

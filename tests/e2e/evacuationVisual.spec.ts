import { expect, test } from "@playwright/test";
import { prepare, examine, decision, secure, transfer, guide, interact, close, probe } from "./evacuationTestDriver";
test("evacuation visual QA and restored morning: patient, choices, preparation, carrying and landing at both sizes", async ({ page }, info) => {
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
      await page.screenshot({ path: info.outputPath(`evacuation-${id}-${viewport.width}x${viewport.height}.png`) });
    }
    await page.locator("canvas").focus();
  };
  await prepare(page); await interact(page, "start", "amanecer");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
  const dawn = await probe(page, "save"); expect(dawn.state.phase).toBe("morning"); await capture("morning");
  await close(page); await probe(page, "finishMorning");
  await expect.poll(async () => (await probe(page, "inspect")).state.phase, { timeout: 25000 }).toBe("preparing");
  const dawnRestored = await probe(page, "restore", dawn.data); expect(dawnRestored.morning).toBe(dawn.morning);
  await expect(page.getByTestId("dialogue-text")).toContainText("mañana no trae alivio"); await close(page); await probe(page, "finishMorning");
  await expect.poll(async () => (await probe(page, "inspect")).state.phase, { timeout: 25000 }).toBe("preparing");
  await capture("station"); await interact(page, "patient", "cómo está"); await capture("cough");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Me habló de mañana"); await capture("voice"); await close(page);
  await decision(page); await capture("choice"); const choice = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("El hombre irá primero"); await capture("patient-first"); await close(page);
  await secure(page); await interact(page, "patient", "alzar"); await capture("lift"); await close(page);
  await probe(page, "go", "ahead"); await expect.poll(async () => (await probe(page, "inspect")).state.cot.x).toBeLessThan(1270);
  await capture("carrying"); await guide(page); await expect(page.getByTestId("dialogue-text")).toContainText("antes que la carga"); await capture("patient-landing"); await close(page);
  await probe(page, "restore", choice.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("Apartaré primero la carga"); await capture("cargo-first"); await close(page);
  await interact(page, "cargo", "atado"); await capture("cargo-cleared"); await close(page);
  await secure(page); await transfer(page); await guide(page);
  await expect(page.getByTestId("dialogue-text")).toContainText("detrás del primer atado"); await capture("cargo-landing"); await close(page);
  const ready = await probe(page, "save"); await probe(page, "restore", ready.data); await interact(page, "landing", "Permanecer"); await capture("restored");
  expect((await probe(page, "inspect")).entities.every((e: { count: number }) => e.count === 1)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, start, interact, choice, close, probe } from "./europeTestDriver";

test("European visual QA: convalescence, dossier, both responses and restored pressure at both sizes", async ({ page }, info) => {
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
      await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
      await page.screenshot({ path: info.outputPath(`europe-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await start(page); await capture("return");
  await interact(page, "window", "Mirar la ciudad"); await capture("window"); await close(page);
  await interact(page, "packet", "Abrir el paquete"); await capture("packet"); await close(page);
  await interact(page, "report", "Examinar el informe"); await capture("report"); await close(page);
  await interact(page, "letters", "Separar las cartas"); await capture("letters"); await close(page);
  await interact(page, "report", "Preparar el informe"); await capture("prepared"); await close(page);
  await interact(page, "door", "Responder al funcionario"); await capture("claim"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choice"); const choices = await probe(page, "save");
  await page.keyboard.press("1"); await capture("private"); await close(page);
  await interact(page, "report", "Recoger sólo"); await capture("carrying"); const carrying = await probe(page, "save"); await close(page);
  await interact(page, "door", "Ofrecer el informe"); await page.keyboard.press("e"); await capture("refusal"); await close(page); await capture("resolved");
  await probe(page, "restore", choices.data); await page.keyboard.press("2"); await capture("commerce"); await close(page);
  await probe(page, "restore", carrying.data); await capture("restored-carrying");
  expect((await probe(page, "inspect")).state.phase).toBe("carrying");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

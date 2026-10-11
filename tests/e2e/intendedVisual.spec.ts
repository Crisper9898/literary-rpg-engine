import { expect, test } from "@playwright/test";
import { prepare, interact, choices, close, probe } from "./intendedTestDriver";

test("Intended visual QA: drawing room, both replies, last words and restored question", async ({ page }, info) => {
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
      await page.screenshot({ path: info.outputPath(`intended-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await interact(page, "door", "Visitar a la Prometida"); await capture("arrival"); await close(page);
  await interact(page, "piano", "Observar el piano"); await capture("piano"); await close(page);
  await interact(page, "window", "Mirar las tres ventanas"); await capture("windows"); await close(page);
  await interact(page, "table", "Entregar las cartas"); await capture("delivery"); await close(page);
  await choices(page); await capture("choices"); const choiceSave = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("hasta el final"); await capture("witness"); await close(page);
  const heard = await probe(page, "save");
  await probe(page, "restore", choiceSave.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("cómo lo recuerda"); await capture("listen"); await close(page);
  await probe(page, "restore", heard.data); await interact(page, "intended", "Afrontar la pregunta"); await capture("question");
  const question = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("El horror"); await capture("memory"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("su nombre"); await capture("lie"); await close(page);
  await interact(page, "door", "Despedirse"); await capture("departure"); await close(page);
  await capture("complete"); await probe(page, "restore", question.data); await capture("restored-question");
  expect((await probe(page, "inspect")).state.phase).toBe("lastWords");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, interact, cousinChoice, journalistChoice, close, probe } from "./legacyTestDriver";

test("Kurtz legacy visual QA: both visitors, four replies, document handoffs and restoration", async ({ page }, info) => {
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
      await page.screenshot({ path: info.outputPath(`legacy-${id}-${viewport.width}x${viewport.height}.png`) });
    } await page.locator("canvas").focus();
  };
  await prepare(page); await interact(page, "door", "Recibir al primo"); await capture("entry"); await close(page);
  await cousinChoice(page); await capture("cousin-choice"); const cousinSave = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("muchos talentos"); await capture("music"); await close(page);
  const familyReady = await probe(page, "save");
  await probe(page, "restore", cousinSave.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("Estuve con él"); await capture("witness"); await close(page);
  await probe(page, "restore", familyReady.data);
  await interact(page, "family", "Recoger las cartas familiares"); await capture("family-carry"); await close(page);
  await interact(page, "door", "Entregar las cartas al primo"); await capture("family-give"); await close(page);
  await journalistChoice(page); await capture("journalist-choice"); const journalistSave = await probe(page, "save");
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("qué partido"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("De cualquiera"); await capture("party"); await close(page);
  const reportReady = await probe(page, "save");
  await probe(page, "restore", journalistSave.data); await page.keyboard.press("2");
  await expect(page.getByTestId("dialogue-text")).toContainText("poseer más"); await capture("motive"); await close(page);
  await probe(page, "restore", reportReady.data);
  await interact(page, "report", "Recoger el informe para publicación"); await capture("report-carry"); const held = await probe(page, "save"); await close(page);
  await interact(page, "door", "Entregar el informe al periodista"); await capture("report-give"); await close(page); await capture("remaining");
  await interact(page, "letters", "Examinar el último paquete"); await capture("complete"); await close(page);
  await probe(page, "restore", held.data); await capture("restored-report");
  expect((await probe(page, "inspect")).reportVisible).toBe(false); expect((await probe(page, "inspect")).lettersVisible).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

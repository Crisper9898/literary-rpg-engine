import { expect, test } from "@playwright/test";
import { enter, probe, closeDialogue, investigate } from "./revelationsTestDriver";
test("station evidence visual QA at both sizes: props, recognition, report, two interpretations and Kurtz", async ({ page }, info) => {
  test.setTimeout(240000);
  const capture = async (id: string) => {
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport); await probe(page, "settleFrame");
      await expect.poll(async () => { const size = await probe(page, "settleFrame");
        return size.pixels.every((v: number, i: number) => Math.abs(v - size.display[i] * size.ratio) < 2); }).toBe(true);
      for (const node of [page.getByTestId("dialogue-panel"), page.getByTestId("talk-prompt"),
        page.getByTestId("journey-controls-hint"), ...await page.getByTestId("dialogue-choice").all()]) {
        if (!await node.isVisible()) continue;
        const b = await node.boundingBox(); expect(b).not.toBeNull();
        expect(b!.x).toBeGreaterThanOrEqual(0); expect(b!.y).toBeGreaterThanOrEqual(0);
        expect(b!.x + b!.width).toBeLessThanOrEqual(viewport.width); expect(b!.y + b!.height).toBeLessThanOrEqual(viewport.height);
        expect(await node.evaluate(el => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
      }
      await page.screenshot({ path: info.outputPath(`revelations-${id}-${viewport.width}x${viewport.height}.png`) });
    }
    await page.locator("canvas").focus();
  };
  await enter(page); await capture("general");
  await probe(page, "go", "ivory"); await expect(page.getByTestId("talk-prompt")).toContainText("marfil"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Colmillos"); await capture("ivory"); await closeDialogue(page);
  await probe(page, "go", "palisade"); await expect(page.getByTestId("talk-prompt")).toContainText("empalizada"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("De lejos"); await capture("palisade-before");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("cabezas humanas");
  await capture("palisade-after"); await closeDialogue(page);
  await probe(page, "go", "influence"); await expect(page.getByTestId("talk-prompt")).toContainText("reunión"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("esteras"); await capture("influence"); await closeDialogue(page);
  await probe(page, "go", "report"); await expect(page.getByTestId("talk-prompt")).toContainText("informe"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("hacer el bien"); await capture("report-ideal");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("pausa");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Exterminad");
  await capture("report-annotation"); await closeDialogue(page);
  await probe(page, "go", "russian"); await expect(page.getByTestId("talk-prompt")).toContainText("ruso"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("rebeldes"); await capture("russian");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("lo dejó hablar");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await capture("choices");
  const atChoice = await probe(page, "save");
  for (const [choice, id] of [[1, "understand"], [2, "brutality"]] as const) {
    if (choice === 2) await probe(page, "restore", atChoice.data);
    await page.keyboard.press(String(choice)); await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "Comprenderlo" : "brutalidad");
    await capture(id); await closeDialogue(page);
    await probe(page, "go", "kurtz"); await expect(page.getByTestId("talk-prompt")).toContainText("Kurtz"); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "Quiere comprenderme" : "un nombre");
    await capture(`kurtz-${id}`); await closeDialogue(page);
  }
  await investigate(page, "ivory"); expect((await probe(page, "inspect")).discoveries).toHaveLength(4);
  await probe(page, "go", "away"); await capture("final");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

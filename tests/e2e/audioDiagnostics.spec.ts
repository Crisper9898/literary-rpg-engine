import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/audioProbe.ts";
  return (await import(url)).inspectAudio();
});

test("P shows live Journey audio values without interrupting movement or dialogue", async ({ page }, testInfo) => {
  test.setTimeout(70_000);
  await page.goto("/");
  await expect.poll(() => page.locator("#root canvas").count()).toBe(1);
  await page.evaluate(async () => {
    const url = "/tests/e2e/audioProbe.ts";
    (await import(url)).mountAudio();
  });
  const canvas = page.locator("#root canvas");
  const panel = page.getByTestId("journey-audio-diagnostics");
  await expect(panel).toHaveCount(1);
  await expect(panel).toBeHidden();
  await canvas.click({ position: { x: 80, y: 80 } });
  await page.keyboard.press("p");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Marlow");
  await expect(panel).toContainText("650");
  const initial = await inspect(page);
  await expect(page.getByTestId("audio-layer-river"))
    .toContainText(initial.layers.river.volume.toFixed(3));
  await expect(page.getByTestId("audio-layer-river"))
    .toContainText(`canal ${initial.layers.river.channelVolume.toFixed(3)}`);
  expect(await panel.evaluate(element => getComputedStyle(element).pointerEvents)).toBe("none");

  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page)).player.x, { timeout: 15_000 }).toBeGreaterThan(760);
  await page.keyboard.press("p");
  await expect(panel).toBeHidden();
  await expect.poll(async () => (await inspect(page)).player.x).toBeGreaterThan(790);
  await page.keyboard.up("d");
  await page.keyboard.press("p");
  await expect(panel).toBeVisible();
  await expect(panel).toContainText("Río");
  await expect.poll(async () => Number(await page.getByTestId("audio-layer-shore").getAttribute("data-volume")))
    .toBeLessThan(initial.layers.shore.volume);

  await page.keyboard.down("d");
  await expect(page.getByTestId("talk-prompt")).toBeEnabled({ timeout: 15_000 });
  await page.keyboard.up("d");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await page.keyboard.press("p");
  await expect(panel).toBeHidden();
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-speaker")).toHaveText("Marlow");
  await page.keyboard.press("p");
  await expect(panel).toBeVisible();
  await expect(page.getByTestId("dialogue-panel")).toBeVisible();

  await page.evaluate(() => window.pixiVN.start("start", {}));
  await expect(panel).toHaveCount(1);
  await expect(panel).toBeHidden();
  await canvas.focus();
  await page.keyboard.press("p");
  await expect(panel).toBeVisible();
  await page.setViewportSize({ width: 800, height: 600 });
  await expect(panel).toContainText("x 650, y 760");
  await expect(page.getByTestId("audio-layer-shore"))
    .toContainText(`destino ${initial.layers.shore.target.toFixed(3)}`);
  const bounds = await panel.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(800);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(600);
  await page.screenshot({ path: testInfo.outputPath("journey-audio-panel-800x600.png") });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

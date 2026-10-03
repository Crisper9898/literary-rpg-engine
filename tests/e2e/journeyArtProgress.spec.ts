import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/deckProbe.ts";
  return (await import(url)).inspectJourneyArtProgress();
});

test("illustrated Journey deck progresses through dusk, jungle, darkness and fire at both viewports", async ({ page }, info) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  const measurements: { stage: string; viewport: string; fps: number }[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  await page.evaluate(async () => {
    const url = "/tests/e2e/weatherProbe.ts";
    (await import(url)).mountWeather(true);
    (await import(url)).frameJourneyArt();
  });
  await expect.poll(async () => Object.values(
    (await page.evaluate(async () => {
      const url = "/tests/e2e/deckProbe.ts";
      return (await import(url)).inspectJourneyArtSlots();
    })) ?? {},
  ).every(Boolean), { timeout: 45_000 }).toBe(true);
  await expect.poll(async () => {
    const art = await inspect(page);
    return art?.nightLoaded && art.fireLoaded && art.bankLoaded && art.deckFireLoaded;
  }, { timeout: 45_000 }).toBe(true);

  for (const [name, target] of [["dusk", 0], ["jungle", .5], ["darkness", .78], ["fire", 1]] as const) {
    await page.evaluate(async (value) => {
      const url = "/tests/e2e/weatherProbe.ts";
      (await import(url)).setWeatherProgress(value);
    }, target);
    await expect.poll(async () => (await page.evaluate(async () => {
      const url = "/tests/e2e/weatherProbe.ts";
      return (await import(url)).inspectWeather();
    }))?.progress,
    { timeout: 45_000 }).toBeGreaterThanOrEqual(target - .01);
    const art = (await inspect(page))!;
    expect(art.activeSkies).toBeLessThanOrEqual(2);
    if (name === "dusk") expect(art.activeSkies).toBe(1);
    expect(art.fire).toBeCloseTo(art.bank, 2);
    expect(art.fire).toBeCloseTo(art.deckFire, 2);
    if (name === "dusk" || name === "darkness") expect(art.fire).toBe(0);
    if (name === "fire") expect(art.fire).toBeGreaterThan(.95);
    await expect.poll(async () => (await inspect(page))!.marlowFrame)
      .toBe(name === "dusk" ? 0 : name === "fire" ? 640 : 480);
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport);
      await expect.poll(async () => page.evaluate(async () => {
        const url = "/tests/e2e/deckProbe.ts";
        const size = (await import(url)).inspectJourneySurface();
        return size.pixels.every((value: number, i: number) =>
          Math.abs(value - size.display[i] * size.ratio) < 2);
      })).toBe(true);
      const sample = await page.evaluate(async () => {
        const url = "/tests/e2e/weatherProbe.ts";
        return (await import(url)).sampleWeather(24);
      });
      measurements.push({ stage: name, viewport: `${viewport.width}x${viewport.height}`,
        fps: Math.round(sample.fps * 10) / 10 });
      await page.screenshot({ path: info.outputPath(`journey-${name}-${viewport.width}x${viewport.height}.png`) });
    }
  }
  await page.keyboard.down("d");
  try {
    await expect(page.getByTestId("talk-prompt")).toBeEnabled({ timeout: 20_000 });
  } finally { await page.keyboard.up("d"); }
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    await expect(page.getByTestId("dialogue-panel")).toBeVisible();
    await page.screenshot({ path: info.outputPath(`journey-fire-dialogue-${viewport.width}x${viewport.height}.png`) });
  }
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  console.log("Journey stage FPS", JSON.stringify(measurements));
  await info.attach("journey-stage-fps", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
});

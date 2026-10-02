import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/parallaxProbe.ts";
  return (await import(url)).inspectParallax();
});
const measure = (page: Page, frames = 20) => page.evaluate(async (frames) => {
  const url = "/tests/e2e/parallaxProbe.ts";
  return (await import(url)).measureParallaxFrames(frames);
}, frames);

async function checkTravel(page: Page) {
  const before = (await inspect(page))!;
  const sample = await measure(page);
  expect(sample.seconds).toBeGreaterThan(0);
  sample.distances.forEach((distance: number, index: number) => {
    expect(distance / sample.seconds).toBeCloseTo(before.layers[index].speed, 4);
  });
  expect((await inspect(page))!.player).toEqual(before.player);
}

test("the river keeps traveling at five depths while idle, reading and choosing", async ({ page }, info) => {
  // Three full live-frame samples, walking and captures on SwiftShader.
  // Keep every speed assertion/sample; allow the final choice-stage sample.
  test.setTimeout(90_000);
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  expect((await inspect(page))!.layers).toHaveLength(5);
  await page.screenshot({ path: info.outputPath("river-before.png") });
  await checkTravel(page);
  await page.screenshot({ path: info.outputPath("river-after.png") });
  await page.locator("canvas").focus();
  await page.keyboard.down("d");
  await expect(page.getByTestId("talk-prompt")).toBeEnabled({ timeout: 12_000 });
  await page.keyboard.up("d");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  // Stand near the center of the routine while reading so the sailor remains in earshot.
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.x).toBeGreaterThan(1200);
  await page.keyboard.up("d");
  await checkTravel(page);
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-speaker")).toHaveText("Marlow");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await checkTravel(page);
  await page.screenshot({ path: info.outputPath("river-dialogue.png") });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("tiles cover pans, zooms and both resolutions, and scene re-entry disposes every old layer", async ({ page }, info) => {
  // Both viewports, four pan/zoom captures and a final sample after rebuilding.
  // Preserve all live-frame samples and exact tile coverage assertions.
  test.setTimeout(120_000);
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    for (const frame of [{ x: 420, y: 520, zoom: 1 }, { x: 1500, y: 800, zoom: 1.8 }]) {
      await page.evaluate(async (frame) => {
        const url = "/tests/e2e/parallaxProbe.ts";
        (await import(url)).frameRiver(frame.x, frame.y, frame.zoom);
      }, frame);
      // Sample throughout the actual smooth pan/zoom, not only its endpoint.
      for (let sample = 0; sample < 3; sample++) {
        await measure(page, 6);
        const state = (await inspect(page))!;
        for (const layer of state.layers) {
          expect(layer.count).toBeLessThanOrEqual(3);
          expect(layer.intervals[0].start).toBeLessThanOrEqual(.01);
          expect(layer.intervals.at(-1)!.end).toBeGreaterThanOrEqual(1919.99);
          for (let i = 1; i < layer.intervals.length; i++) {
            expect(layer.intervals[i].start).toBeCloseTo(layer.intervals[i - 1].end, 5);
          }
        }
      }
      await page.screenshot({ path: info.outputPath(`river-${viewport.width}-zoom-${frame.zoom}.png`) });
    }
  }
  await page.evaluate(async () => {
    const url = "/tests/e2e/parallaxProbe.ts";
    (await import(url)).retainLayers();
    await window.pixiVN.start("start", {});
  });
  expect(await page.evaluate(async () => {
    const url = "/tests/e2e/parallaxProbe.ts";
    return (await import(url)).oldLayersDestroyed();
  })).toBe(true);
  expect((await inspect(page))!.layers).toHaveLength(5);
  await checkTravel(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

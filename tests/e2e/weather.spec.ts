import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/weatherProbe.ts";
  return (await import(url)).inspectWeather();
});
const mount = (page: Page, controlled = false) => page.evaluate(async (controlled) => {
  const url = "/tests/e2e/weatherProbe.ts";
  (await import(url)).mountWeather(controlled);
}, controlled);
const sample = (page: Page, frames = 12) => page.evaluate(async (frames) => {
  const url = "/tests/e2e/weatherProbe.ts";
  return (await import(url)).sampleWeather(frames);
}, frames);
const setProgress = (page: Page, progress: number) => page.evaluate(async (progress) => {
  const url = "/tests/e2e/weatherProbe.ts";
  (await import(url)).setWeatherProgress(progress);
}, progress);

test("atmosphere follows real voyage distance while idle and walking, then disposes on re-entry", async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  await mount(page);
  const idle = await sample(page);
  expect(idle.after.player).toEqual(idle.before.player);
  expect(idle.after.distance! - idle.before.distance!).toBeCloseTo(idle.seconds * 30, 4);
  expect(idle.after.progress!).toBeGreaterThan(idle.before.progress!);
  expect(idle.after.progress!).toBeLessThan(idle.after.distance! / 3600);
  await page.keyboard.down("d");
  const walking = await sample(page);
  await page.keyboard.up("d");
  expect((walking.after.player.x - walking.before.player.x) / walking.seconds).toBeCloseTo(240, 4);
  expect(walking.after.cameraX).toBeGreaterThan(walking.before.cameraX);
  expect(walking.after.distance).toBeGreaterThan(walking.before.distance!);
  expect(walking.after.sharedTextures).toBe(1);
  expect(walking.after.textureWidth).toBeLessThanOrEqual(512);
  expect(walking.after.fog.every((layer: { count: number }) => layer.count <= 2)).toBe(true);
  await page.evaluate(async () => {
    const url = "/tests/e2e/weatherProbe.ts";
    (await import(url)).retainWeather();
    await window.pixiVN.start("start", {});
  });
  await sample(page, 6);
  expect(await page.evaluate(async () => {
    const url = "/tests/e2e/weatherProbe.ts";
    return (await import(url)).weatherDisposed();
  })).toBe(true);
  expect((await inspect(page))!.sharedTextures).toBe(1);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("clear, humid and deep fog remain gradual and leave dialogue usable at both resolutions", async ({ page }, info) => {
  test.setTimeout(100_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  await mount(page, true);
  await page.keyboard.down("d");
  await expect(page.getByTestId("talk-prompt")).toBeEnabled({ timeout: 15_000 });
  await page.keyboard.up("d");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.x).toBeGreaterThan(1200);
  await page.keyboard.up("d");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-speaker")).toHaveText("Marlow");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  let previousAlpha = 0;
  for (const progress of [0, .5, 1]) {
    await setProgress(page, progress);
    if (progress > 0) {
      const transition = await sample(page, 6);
      expect(transition.after.progress!).toBeGreaterThan(transition.before.progress!);
      expect(transition.after.progress!).toBeLessThan(progress);
      await expect.poll(async () => (await inspect(page))!.progress!, { timeout: 20_000 }).toBeGreaterThan(progress - .01);
    }
    const state = (await inspect(page))!;
    expect(state.fog[0].alpha).toBeGreaterThan(previousAlpha);
    previousAlpha = state.fog[0].alpha;
    expect(state.titleUnaffected).toBe(true);
    for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
      await page.setViewportSize(viewport);
      const panel = (await page.getByTestId("dialogue-panel").boundingBox())!;
      const box = (await page.locator("canvas").boundingBox())!;
      expect(panel.x).toBeGreaterThanOrEqual(box.x);
      expect(panel.x + panel.width).toBeLessThanOrEqual(box.x + box.width);
      expect(panel.y + panel.height).toBeLessThan(box.y + box.height * .72);
      await page.screenshot({ path: info.outputPath(`weather-${progress}-${viewport.width}.png`) });
    }
  }
  const movingFog = await sample(page);
  expect(movingFog.after.fog[0].x).not.toBe(movingFog.before.fog[0].x);
  expect(movingFog.after.fog[2].x).not.toBe(movingFog.before.fog[2].x);
  await page.keyboard.down("a");
  await page.getByTestId("dialogue-choice").first().click();
  await expect(page.locator("canvas")).toBeFocused();
  const walking = await sample(page, 6);
  await page.keyboard.up("a");
  expect(walking.after.player.x).toBeLessThan(walking.before.player.x);
  await expect(page.getByTestId("dialogue-text")).toContainText("¿Qué esconde el río");
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("weather reuses its texture and tile pool over live frames", async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  await mount(page, true);
  await setProgress(page, 1);
  const measurements = [];
  for (const visible of [true, false, true]) {
    await page.evaluate(async (visible) => {
      const url = "/tests/e2e/weatherProbe.ts";
      (await import(url)).weatherVisible(visible);
    }, visible);
    const frames = await sample(page, 30);
    expect(frames.after.sharedTextures).toBe(1);
    expect(frames.after.textureId).toBe(frames.before.textureId);
    expect(frames.after.fog.map((layer: { count: number }) => layer.count)).toEqual(frames.before.fog.map((layer: { count: number }) => layer.count));
    measurements.push({ weather: visible, fps: Math.round(frames.fps * 10) / 10 });
  }
  console.log("Weather render diagnostic:", JSON.stringify(measurements));
});

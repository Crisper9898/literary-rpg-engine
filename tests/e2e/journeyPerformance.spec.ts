import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1366, height: 768 } });

test("Journey software renderer component profile", async ({ page }, info) => {
  test.setTimeout(240_000);
  await page.goto("/");
  await expect.poll(() => page.evaluate(async () => {
    const path = "/tests/e2e/deckProbe.ts";
    return (await import(path)).inspectDeck();
  })).not.toBeNull();
  await page.evaluate(async () => {
    const path = "/tests/e2e/weatherProbe.ts";
    const weather = await import(path);
    weather.mountWeather(true, true);
    weather.frameJourneyArt();
    weather.setWeatherProgress(.78);
  });
  await expect.poll(() => page.evaluate(async () => {
    const path = "/tests/e2e/weatherProbe.ts";
    return (await import(path)).inspectWeather()?.progress;
  }), { timeout: 45_000 }).toBeGreaterThan(.77);
  const report = await page.evaluate(async () => {
    const path = "/tests/e2e/journeyPerformanceProbe.ts";
    return (await import(path)).profileJourneyRendering();
  });
  console.log("Journey rendering profile:", JSON.stringify(report));
  await info.attach("render-profile", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
  expect(report.logical).toEqual({ width: 1920, height: 1080 });
  expect(report.results.every((result: { fps: number }) => result.fps > 0)).toBe(true);
});

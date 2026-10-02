import { expect, test, type Page } from "@playwright/test";

const position = (page: Page) => page.evaluate(async () => {
  const probeUrl = "/tests/e2e/deckProbe.ts";
  const { inspectDeck } = await import(probeUrl);
  return inspectDeck()?.actors.find((actor: { id: string }) => actor.id === "playerSpawn");
});

test("live WASD and arrow diagonals have the same speed as cardinal movement", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect.poll(() => position(page)).toMatchObject({ x: 650, y: 760 });
  for (const keys of [["s"], ["w", "d"], ["ArrowUp", "ArrowRight"]]) {
    await page.evaluate(() => window.pixiVN.start("start", {}));
    await page.locator("#root canvas").focus();
    // Hold the existing ticker while both keys and the sampler are installed;
    // otherwise browser automation latency can reach a boundary before measuring.
    await page.evaluate(async () => {
      const probeUrl = "/tests/e2e/deckProbe.ts";
      const { pauseMovementSampling } = await import(probeUrl);
      pauseMovementSampling();
    });
    for (const key of keys) await page.keyboard.down(key);
    const measured = await page.evaluate(async () => {
      const probeUrl = "/tests/e2e/deckProbe.ts";
      const { measureMovementFrames } = await import(probeUrl);
      return measureMovementFrames();
    });
    for (const key of keys) await page.keyboard.up(key);
    expect(measured.distance).toBeGreaterThan(0);
    expect(measured.distance / measured.seconds).toBeCloseTo(240, 4);
    const player = await position(page);
    expect(player.x).toBeGreaterThanOrEqual(420);
    expect(player.x).toBeLessThanOrEqual(1500);
    expect(player.y).toBeGreaterThanOrEqual(680);
    expect(player.y).toBeLessThanOrEqual(840);
  }
  await page.screenshot({ path: testInfo.outputPath("marlow-diagonal.png") });
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Marlow walks, stops, stays on deck and clears held keys on restart", async ({ page }, testInfo) => {
  // Includes four full deck crossings, focus changes and scene recreation.
  test.setTimeout(90_000);
  await page.goto("/");
  const surface = page.locator("#root canvas");
  await expect.poll(() => position(page)).toMatchObject({ x: 650, y: 760 });
  await surface.focus();
  await page.screenshot({ path: testInfo.outputPath("marlow-before.png") });
  await page.keyboard.down("d");
  await expect.poll(async () => (await position(page)).x).toBeGreaterThan(720);
  await page.keyboard.up("d");
  const stopped = await position(page);
  // Sample after multiple frames to prove release does not leave movement latched.
  await page.waitForTimeout(180);
  expect((await position(page)).x).toBeCloseTo(stopped.x, 4);
  await page.screenshot({ path: testInfo.outputPath("marlow-after.png") });

  for (const [key, axis, bound] of [
    ["ArrowUp", "y", 680], ["ArrowDown", "y", 840],
    ["ArrowLeft", "x", 420], ["ArrowRight", "x", 1500],
  ] as const) {
    await page.keyboard.down(key);
    // Software-rendered Chromium can fall below 20 fps. The controller deliberately
    // caps stalled frames, so allow enough real frames for the full deck crossing.
    await expect.poll(async () => (await position(page))[axis], { timeout: 20_000 }).toBe(bound);
    await page.keyboard.up(key);
  }

  await page.keyboard.down("a");
  await expect.poll(async () => (await position(page)).x).toBeLessThan(1450);
  await page.evaluate(() => window.pixiVN.start("start", {}));
  await page.waitForTimeout(180);
  expect(await position(page)).toMatchObject({ x: 650, y: 760 });
  await page.keyboard.up("a");
  await surface.focus();
  await page.keyboard.down("w");
  await expect.poll(async () => (await position(page)).y).toBeLessThan(740);
  await page.keyboard.up("w");
  await expect(page.locator("#root canvas")).toHaveCount(1);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("focus loss stops Marlow and text inputs retain their keyboard", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => position(page)).toMatchObject({ x: 650, y: 760 });
  const surface = page.locator("#root canvas");
  await surface.focus();
  await page.keyboard.down("d");
  await expect.poll(async () => (await position(page)).x).toBeGreaterThan(680);
  await page.evaluate(() => {
    const field = document.createElement("input");
    field.id = "test-input";
    document.body.append(field);
    field.focus();
  });
  await page.keyboard.up("d");
  const stopped = await position(page);
  await page.locator("#test-input").pressSequentially("wasd");
  await expect(page.locator("#test-input")).toHaveValue("wasd");
  await page.waitForTimeout(180);
  expect(await position(page)).toEqual(stopped);
  await surface.focus();
  await page.waitForTimeout(180);
  expect(await position(page)).toEqual(stopped);
});

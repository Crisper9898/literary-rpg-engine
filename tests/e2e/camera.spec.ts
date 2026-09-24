import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const probeUrl = "/tests/e2e/cameraProbe.ts";
  const { inspectCamera } = await import(probeUrl);
  return inspectCamera();
});

const command = (page: Page, action: "create" | "focus" | "zoom" | "lock" | "resume") => page.evaluate(async (action) => {
  const probeUrl = "/tests/e2e/cameraProbe.ts";
  const { cameraCommand } = await import(probeUrl);
  cameraCommand(action);
}, action);

test("camera follows all movement directions while keeping the world covered and UI fixed", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  const initial = (await inspect(page))!;
  expect(initial.zoom).toBeGreaterThan(1);
  await page.locator("#root canvas").focus();
  await page.screenshot({ path: testInfo.outputPath("camera-start.png") });

  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.x).toBeGreaterThan(850);
  await page.keyboard.up("d");
  const horizontal = (await inspect(page))!;
  expect(horizontal.center.x).toBeGreaterThan(initial.center.x);
  expect(horizontal.center.x).toBeLessThan(horizontal.player.x);
  await page.screenshot({ path: testInfo.outputPath("camera-horizontal.png") });

  await page.keyboard.down("w");
  await expect.poll(async () => (await inspect(page))!.player.y).toBeLessThan(710);
  await page.keyboard.up("w");
  expect((await inspect(page))!.center.y).toBeLessThan(horizontal.center.y);

  const beforeDiagonal = (await inspect(page))!;
  await page.keyboard.down("s");
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.y).toBeGreaterThan(800);
  await page.keyboard.up("s");
  await page.keyboard.up("d");
  const diagonal = (await inspect(page))!;
  expect(diagonal.center.x).toBeGreaterThan(beforeDiagonal.center.x);
  expect(diagonal.center.y).toBeGreaterThan(beforeDiagonal.center.y);
  await page.screenshot({ path: testInfo.outputPath("camera-diagonal.png") });

  for (const [key, axis, bound] of [
    ["ArrowRight", "x", 1500], ["ArrowDown", "y", 840],
    ["ArrowLeft", "x", 420], ["ArrowUp", "y", 680],
  ] as const) {
    await page.keyboard.down(key);
    // Software rendering can fall below 10fps. Movement deliberately caps each
    // tick at 50ms, so allow the full crossing without relaxing its exact bounds.
    // movement.spec checks velocity over actual rendered frames separately.
    await expect.poll(async () => (await inspect(page))!.player[axis], { timeout: 20_000 }).toBe(bound);
    await page.keyboard.up(key);
    const state = (await inspect(page))!;
    expect(state.worldStart.x).toBeLessThanOrEqual(0.01);
    expect(state.worldStart.y).toBeLessThanOrEqual(0.01);
    expect(state.worldEnd.x).toBeGreaterThanOrEqual(1919.99);
    expect(state.worldEnd.y).toBeGreaterThanOrEqual(1079.99);
    expect(state.playerView.x).toBeGreaterThan(0);
    expect(state.playerView.x).toBeLessThan(1920);
    expect(state.playerView.y).toBeGreaterThan(0);
    expect(state.playerView.y).toBeLessThan(1080);
    expect(state.title).toEqual(initial.title);
    await page.screenshot({ path: testInfo.outputPath(`camera-${key}.png`) });
  }

  await page.setViewportSize({ width: 800, height: 600 });
  const box = await page.locator("#root canvas").boundingBox();
  expect(box!.width).toBeLessThanOrEqual(800);
  expect(box!.height).toBeLessThanOrEqual(600);
  await page.screenshot({ path: testInfo.outputPath("camera-small.png") });
  await page.evaluate(() => window.pixiVN.start("start", {}));
  expect(await inspect(page)).toEqual(initial);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("scripted focus and zoom can lock independently of movement then return to Marlow", async ({ page }, testInfo) => {
  // Includes several eased camera moves and scene rebuilds on the software renderer.
  test.setTimeout(45_000);
  await page.goto("/");
  await expect.poll(() => inspect(page)).not.toBeNull();
  await command(page, "create");
  await command(page, "focus");
  await expect.poll(async () => (await inspect(page))!.center.x).toBeGreaterThan(1198);
  await command(page, "zoom");
  await expect.poll(async () => (await inspect(page))!.zoom).toBeGreaterThan(1.799);
  await page.screenshot({ path: testInfo.outputPath("camera-focus-zoom.png") });
  await command(page, "lock");
  const locked = (await inspect(page))!;
  await page.locator("#root canvas").focus();
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.x).toBeGreaterThan(850);
  await page.keyboard.up("d");
  expect((await inspect(page))!.center).toEqual(locked.center);
  expect((await inspect(page))!.zoom).toBe(locked.zoom);
  await command(page, "resume");
  await expect.poll(async () => {
    const state = (await inspect(page))!;
    return Math.abs(state.center.x - state.player.x);
  }).toBeLessThan(2);
  await page.screenshot({ path: testInfo.outputPath("camera-resume.png") });

  // Re-entry must dispose the old adapter even if its director is still referenced.
  await page.evaluate(() => window.pixiVN.start("start", {}));
  const oldState = await page.evaluate(async () => {
    const probeUrl = "/tests/e2e/cameraProbe.ts";
    return (await import(probeUrl)).directedState();
  });
  const newState = (await inspect(page))!;
  expect(newState.player).toEqual({ x: 650, y: 760 });
  expect(newState.zoom).toBe(1.5);
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page))!.player.x).toBeGreaterThan(720);
  await page.keyboard.up("d");
  const detached = await page.evaluate(async () => {
    const probeUrl = "/tests/e2e/cameraProbe.ts";
    return (await import(probeUrl)).directedState();
  });
  expect(detached).toEqual(oldState);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

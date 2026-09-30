import { expect, test, type Page } from "@playwright/test";

const inspect = (page: Page) => page.evaluate(async () => {
  const moduleUrl = "/tests/e2e/npcProbe.ts";
  return (await import(moduleUrl)).inspectNpc();
});
const command = (page: Page, action: "pause" | "resume" | "focus" | "follow") => page.evaluate(async (action) => {
  const moduleUrl = "/tests/e2e/npcProbe.ts";
  (await import(moduleUrl)).npcCommand(action);
}, action);

test("a registered deckhand is visible from the initial player framing", async ({ page }, testInfo) => {
  await page.goto("/");
  const initial = () => page.evaluate(async () => {
    const moduleUrl = "/tests/e2e/npcProbe.ts";
    return (await import(moduleUrl)).inspectInitialNpc();
  });
  await expect.poll(initial).not.toBeNull();
  const npc = (await initial())!;
  expect(npc.registered).toBe(true);
  expect(npc.x).toBeGreaterThan(30);
  expect(npc.x).toBeLessThan(1890);
  expect(npc.y).toBeGreaterThan(70);
  expect(npc.y).toBeLessThan(1040);
  await page.screenshot({ path: testInfo.outputPath("deckhand-initial.png") });
});

test("deckhand works for two full live cycles while Marlow and the camera remain independent", async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("#root canvas")).toBeVisible();
  await page.evaluate(async () => {
    const moduleUrl = "/tests/e2e/npcProbe.ts";
    const probe = await import(moduleUrl);
    probe.startNpcScene();
    probe.beginObservation();
  });
  await expect.poll(async () => (await inspect(page)).npc.mode, { timeout: 25_000 }).toBe("walking");
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page)).player.x).toBeGreaterThan(930);
  await page.keyboard.up("d");
  await expect.poll(async () => (await inspect(page)).camera.position.x).toBeGreaterThan(800);
  await page.screenshot({ path: testInfo.outputPath("deckhand-and-marlow.png") });

  await command(page, "focus");
  for (const activity of ["check-cargo", "lookout", "coil-rope"]) {
    await expect.poll(async () => (await inspect(page)).npc.activity, { timeout: 25_000 }).toBe(activity);
    await page.screenshot({ path: testInfo.outputPath(`deckhand-${activity}.png`) });
  }
  await expect.poll(() => page.evaluate(async () => {
    const moduleUrl = "/tests/e2e/npcProbe.ts";
    return (await import(moduleUrl)).observationReport().cycles;
  }), { timeout: 60_000 }).toBeGreaterThanOrEqual(2);
  const report = await page.evaluate(async () => {
    const moduleUrl = "/tests/e2e/npcProbe.ts";
    return (await import(moduleUrl)).finishObservation();
  });
  expect(report.simulatedMS).toBeGreaterThan(25_000);
  expect(report.simultaneousFrames).toBeGreaterThan(5);
  expect(report.activities.sort()).toEqual(["check-cargo", "coil-rope", "lookout"]);
  expect(report.facings).toEqual(expect.arrayContaining([-1, 1]));
  expect(report.violations).toEqual([]);
  await testInfo.attach("npc-observation", { body: JSON.stringify(report, null, 2), contentType: "application/json" });

  await command(page, "pause");
  const paused = await inspect(page);
  await page.keyboard.down("a");
  await expect.poll(async () => (await inspect(page)).player.x).toBeLessThan(850);
  await page.keyboard.up("a");
  const stopped = await inspect(page);
  expect(stopped.npc.position).toEqual(paused.npc.position);
  expect(stopped.npc.idleRemainingMS).toBe(paused.npc.idleRemainingMS);
  expect(stopped.npc.facing.x).toBeLessThan(0);
  await expect.poll(async () => {
    const state = await inspect(page);
    return Math.abs(state.camera.position.x - state.npc.position.x);
  }).toBeLessThan(2);
  await page.screenshot({ path: testInfo.outputPath("deckhand-facing-marlow.png") });
  await command(page, "resume");
  await command(page, "follow");
  await expect.poll(async () => (await inspect(page)).npc.mode, { timeout: 10_000 }).toBe("walking");
  await expect.poll(async () => {
    const state = await inspect(page);
    return Math.abs(state.camera.position.x - state.player.x);
  }).toBeLessThan(2);
  await page.evaluate(() => window.pixiVN.start("start", {}));
  const retained = () => page.evaluate(async () => {
    const moduleUrl = "/tests/e2e/npcProbe.ts";
    return (await import(moduleUrl)).retainedNpcState();
  });
  const detached = await retained();
  await page.waitForTimeout(200);
  expect(await retained()).toEqual(detached);
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

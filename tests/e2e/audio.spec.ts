import { expect, test, type Page } from "@playwright/test";

const mount = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/audioProbe.ts";
  (await import(url)).mountAudio();
});
const place = (page: Page, x: number) => page.evaluate(async (x) => {
  const url = "/tests/e2e/audioProbe.ts";
  (await import(url)).placeAudioListener(x);
}, x);
const inspect = (page: Page) => page.evaluate(async () => {
  const url = "/tests/e2e/audioProbe.ts";
  return (await import(url)).inspectAudio();
});

test("Journey layers blend by proximity, use Pixi'VN and survive restore without duplicate playback", async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  const warnings: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "warning") warnings.push(message.text());
  });
  await page.goto("/");
  await expect.poll(() => page.locator("canvas").count()).toBe(1);
  await mount(page);
  await page.locator("canvas").click({ position: { x: 80, y: 80 } });
  await expect.poll(async () => (await inspect(page)).audioContextState).toBe("running");
  await place(page, 1450);
  await expect.poll(async () => (await inspect(page)).layers.river.active).toBe(true);
  let state = await inspect(page);
  expect(state.layers.river.target).toBeCloseTo(0.22);
  expect(state.layers.shore.target).toBe(0);
  expect(state.layers.engine.target).toBeGreaterThan(0);
  expect(state.layers.engine.background).toBe(true);
  await place(page, 600);
  state = await inspect(page);
  expect(state.layers.shore.target).toBeGreaterThan(0);
  expect(state.layers.river.target).toBeLessThan(0.22);
  expect(state.layers.shore.active).toBe(true);
  expect(state.layers.shore.channelVolume).toBeCloseTo(state.layers.shore.volume, 2);
  const saved = await page.evaluate(async () => {
    const url = "/tests/e2e/audioProbe.ts";
    return (await import(url)).saveAudioPosition();
  });
  await place(page, 1450);
  expect((await inspect(page)).layers.shore.target).toBe(0);
  const restored = await page.evaluate(async (saved) => {
    const url = "/tests/e2e/audioProbe.ts";
    return (await import(url)).restoreAudioPosition(saved);
  }, saved);
  expect(restored.player.x).toBe(600);
  expect(restored.layers.shore.target).toBeGreaterThan(0);
  await expect.poll(async () => (await inspect(page)).layers.shore.active).toBe(true);
  await page.locator("canvas").focus();
  await page.keyboard.down("d");
  await expect.poll(async () => (await inspect(page)).player.x, { timeout: 15_000 }).toBeGreaterThan(710);
  await page.keyboard.up("d");
  expect((await inspect(page)).layers.shore.target).toBeLessThan(restored.layers.shore.target);
  expect(errors).toEqual([]);
  expect(warnings.filter(message => message.includes("Channel with alias"))).toEqual([]);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("a neutral room can mix window and door zones without any story-specific engine code", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const url = "/src/engine/audio/SpatialAudioController.ts";
    const { SpatialAudioController } = await import(url);
    const active = new Set<string>();
    const levels = new Map<string, number>();
    let listener = { x: 20, y: 0 };
    const output = {
      isPlaying: (id: string) => active.has(id),
      play: (id: string) => { active.add(id); },
      setVolume: (id: string, value: number) => { levels.set(id, value); },
      stop: (id: string) => { active.delete(id); },
      pause: () => {}, resume: () => {}, dispose: () => { active.clear(); },
    };
    const controller = new SpatialAudioController(() => listener, [
      { id: "room", source: "room.wav", volume: 0.5 },
      { id: "window", source: "outside.wav", volume: 0.8,
        zone: { center: () => ({ x: 0, y: 0 }), innerRadius: 0, outerRadius: 20 } },
      { id: "door", source: "voices.wav", volume: 0.6,
        zone: { center: () => ({ x: 40, y: 0 }), innerRadius: 0, outerRadius: 20 } },
    ], output);
    controller.update(100);
    const middle = [...levels];
    listener = { x: 0, y: 0 }; controller.update(100);
    const window = [...levels];
    listener = { x: 40, y: 0 }; controller.update(100);
    const door = [...levels];
    controller.dispose();
    return { middle, window, door, active: [...active] };
  });
  expect(result.middle).toContainEqual(["room", 0.5]);
  expect(result.window).toContainEqual(["window", 0.8]);
  expect(result.door).toContainEqual(["door", 0.6]);
  expect(result.active).toEqual([]);
});

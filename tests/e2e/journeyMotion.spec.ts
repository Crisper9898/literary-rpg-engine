import { expect, test } from "@playwright/test";

test("six walking cells follow displacement and canvas pixels follow the viewport", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await expect.poll(() => page.evaluate(async () => {
    const url = "/tests/e2e/deckProbe.ts";
    return (await import(url)).inspectDeck();
  })).not.toBeNull();
  await page.evaluate(async () => {
    const url = "/tests/e2e/npcProbe.ts";
    (await import(url)).startNpcScene();
  });
  await expect.poll(() => page.evaluate(async () => {
    const url = "/tests/e2e/npcProbe.ts";
    return (await import(url)).inspectNpc().npc.isMoving;
  }), { timeout: 20_000 }).toBe(true);
  await page.keyboard.down("d");
  let cells: { player: number[]; npc: number[] };
  try {
    cells = await page.evaluate(async () => {
      const url = "/tests/e2e/deckProbe.ts";
      return (await import(url)).sampleJourneyWalk();
    });
  } finally { await page.keyboard.up("d"); }
  expect(cells.player.filter((x) => x >= 800).sort((a, b) => a - b))
    .toEqual([800, 960, 1120, 1280, 1440, 1600]);
  expect(cells.npc.filter((x) => x >= 1440).sort((a, b) => a - b))
    .toEqual([1440, 1600, 1760, 1920, 2080, 2240]);
  await expect.poll(() => page.evaluate(async () => {
    const url = "/tests/e2e/deckProbe.ts";
    return (await import(url)).inspectJourneyArtProgress()?.marlowFrame;
  })).toBe(0);
  for (const viewport of [{ width: 800, height: 600 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    await expect.poll(() => page.evaluate(async () => {
      const url = "/tests/e2e/deckProbe.ts";
      const size = (await import(url)).inspectJourneySurface();
      // Screen dimensions reflect physical-pixel rounding in Pixi; the scene
      // coordinates remain fixed. Allow at most one output pixel of remainder.
      return { logical: size.logical.map((x: number, i: number) =>
        Math.abs(x - [1920, 1080][i]) <= 1920 / size.pixels[0]), error: size.pixels.map((x: number, i: number) =>
        Math.round(x - size.display[i] * size.ratio)) };
    })).toEqual({ logical: [true, true], error: [0, 0] });
  }
});

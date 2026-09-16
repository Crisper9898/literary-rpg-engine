import { expect, test } from "@playwright/test";
import type { Game, GameTestingAPI } from "@drincs/pixi-vn";

declare global {
  interface Window { pixiVN: GameTestingAPI<typeof Game> }
}

test("composes the deck through PixiVN and rebuilds it without duplicate layers", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const inspect = () => page.evaluate(async () => {
    const probeUrl = "/tests/e2e/deckProbe.ts";
    const { inspectDeck } = await import(probeUrl);
    return inspectDeck();
  });
  await expect.poll(inspect).not.toBeNull();
  const expected = {
    layers: ["environment", "ground", "actors", "foreground"],
    actors: [
      { id: "playerSpawn", x: 650, y: 760 },
      { id: "journey-deckhand", x: expect.any(Number), y: expect.any(Number) },
    ],
    title: "deck-title",
  };
  expect(await inspect()).toEqual(expected);
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.evaluate(() => window.pixiVN.start("start", {}));
    expect(await inspect()).toEqual(expected);
    await expect(page.locator("#root canvas")).toHaveCount(1);
  }

  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    const canvas = page.locator("#root canvas");
    await expect.poll(async () => {
      const box = await canvas.boundingBox();
      if (!box) return false;
      return box.width > 0 && Math.abs(box.width / box.height - 16 / 9) < 0.01 &&
        box.x >= -1 && box.y >= -1 && box.x + box.width <= viewport.width + 1 &&
        box.y + box.height <= viewport.height + 1;
    }).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`deck-${viewport.width}.png`) });
  }
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  expect(errors).toEqual([]);
});

import { expect, test, type Page } from "@playwright/test";

const probe = (page: Page, method: string, argument?: string) => page.evaluate(async ({ method, argument }) => {
  const url = "/tests/e2e/woodStopProbe.ts";
  return (await import(url))[method](argument);
}, { method, argument });
async function approach(page: Page, point: string, text: string) {
  await probe(page, "placeAt", point);
  await expect(page.getByTestId("talk-prompt")).toContainText(text);
  await page.locator("canvas").focus();
}
async function finishDeckConversation(page: Page) {
  await page.evaluate(async () => {
    const deck = "/tests/e2e/deckProbe.ts", state = "/src/content/state/journeyState.ts";
    const sailor = (await import(deck)).inspectDeck()!.actors.find((actor: { id: string }) => actor.id === "journey-deckhand")!;
    (await import(state)).journeyPlayerPosition.write({ x: sailor.x, y: sailor.y });
  });
  await expect(page.getByTestId("talk-prompt")).toHaveText("E · Hablar con el marinero");
  await page.locator("canvas").focus(); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("amarras");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("barco");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press("1"); await expect(page.getByTestId("dialogue-text")).toContainText("¿Qué esconde");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("corriente");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("barandilla");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
}
async function enter(page: Page) {
  await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await finishDeckConversation(page);
  await approach(page, "landing", "Desembarcar"); await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).loadedArt).toBe(true);
  await expect.poll(async () => (await probe(page, "inspect")).space).toBe("wood-stop");
}
async function examine(page: Page, point: string, prompt: string, line: string) {
  await approach(page, point, prompt); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(line);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
}

test("the next landing is a spatial action unlocked by the deck conversation", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await page.evaluate(async () => {
    const url = "/src/content/state/journeyState.ts";
    (await import(url)).journeyPlayerPosition.write({ x: 430, y: 850 });
  });
  await expect(page.getByTestId("talk-prompt")).not.toContainText("Desembarcar");
  await finishDeckConversation(page);
  const before = await probe(page, "save");
  await approach(page, "landing", "Desembarcar"); await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).loadedArt).toBe(true);
  await probe(page, "restore", before);
  await expect.poll(async () => (await probe(page, "inspect")).space).toBe("deck");
  await expect(page.getByTestId("talk-prompt")).not.toContainText("Desembarcar");
  await approach(page, "landing", "Desembarcar");
});

for (const [choice, decision, observed] of [["1", "wait", true], ["2", "proceed", false]] as const) {
  test(`wood stop ${decision}: exploration, consequences, scene and active dialogue survive PixiVN restore`, async ({ page }) => {
    test.setTimeout(120_000); await enter(page);
    const arrival = await probe(page, "save");
    // Fuel is a real prerequisite. Neither an unreachable E nor the sailor can skip it.
    await approach(page, "sailor", "Busca la leña"); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    if (observed) {
      await examine(page, "book", "libro", "Towson");
      await examine(page, "warning", "advertencia", "Apresúrense");
    }
    await examine(page, "wood", "leña", "Cargo lo necesario");
    const explored = await probe(page, "inspect");
    expect(explored.loaded).toBe(true); expect(explored.warning).toBe(observed); expect(explored.book).toBe(observed);
    await approach(page, "sailor", "Decidir"); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "tabla" : "combustible");
    await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
    const atChoice = await probe(page, "save");
    const beforeMove = (await probe(page, "inspect")).position.x;
    await page.keyboard.down("a");
    try { await expect.poll(async () => (await probe(page, "inspect")).position.x).toBeLessThan(beforeMove - 25); }
    finally { await page.keyboard.up("a"); }
    await page.keyboard.press(choice);
    await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "luz diurna" : "Seguiremos despacio");
    const chosen = await probe(page, "save");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "ancla" : "sonda");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "oficio" : "cabaña vacía");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    const after = await probe(page, "save"), spatial = await probe(page, "inspect");
    await probe(page, "restore", atChoice);
    expect((await probe(page, "inspect")).decision).toBeUndefined();
    await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
    await probe(page, "restore", chosen);
    expect((await probe(page, "inspect")).decision).toBe(decision);
    await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "luz diurna" : "Seguiremos despacio");
    await probe(page, "restore", after);
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await expect.poll(async () => (await probe(page, "inspect")).position).toEqual(spatial.position);
    expect((await probe(page, "inspect")).decision).toBe(decision);
    expect((await probe(page, "inspect")).warning).toBe(observed);
    await approach(page, "sailor", "Confirmar"); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "ancla" : "sonda");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await approach(page, "board", "Volver al vapor"); await page.keyboard.press("e");
    await expect.poll(async () => (await probe(page, "inspect")).space).toBe("deck");
    expect((await probe(page, "inspect")).departed).toBe(true);
    expect((await probe(page, "inspect")).voyage).toBeGreaterThanOrEqual(explored.voyage);
    await expect(page.locator(".journey-conversation")).toHaveCount(1);
    await expect.poll(async () => (await probe(page, "inspect")).activeSources.every((source: { count: number }) => source.count === 0)).toBe(true);
    await probe(page, "restore", arrival);
    expect((await probe(page, "inspect")).loaded).toBe(false);
    expect((await probe(page, "inspect")).decision).toBeUndefined();
    await page.locator("canvas").focus(); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await probe(page, "restart");
    await expect.poll(async () => (await probe(page, "inspect")).space).toBe("deck");
    expect((await probe(page, "inspect")).book).toBe(false);
    expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  });
}

test("wood stop composition, moving mist and choices fit both viewports", async ({ page }, info) => {
  test.setTimeout(120_000); await enter(page);
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    await page.screenshot({ path: info.outputPath(`wood-stop-${viewport.width}x${viewport.height}.png`) });
  }
  const initial = await probe(page, "inspect");
  await expect.poll(async () => (await probe(page, "inspect")).fogX).not.toBe(initial.fogX);
  await examine(page, "warning", "advertencia", "Apresúrense");
  await examine(page, "book", "libro", "Towson");
  await examine(page, "wood", "leña", "Cargo lo necesario");
  await expect.poll(async () => (await probe(page, "inspect")).progress).toBeGreaterThan(initial.progress + .1);
  await approach(page, "sailor", "Decidir"); await page.keyboard.press("e");
  for (const viewport of [{ width: 1366, height: 768 }, { width: 800, height: 600 }]) {
    await page.setViewportSize(viewport);
    await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
    for (const element of [page.getByTestId("dialogue-panel"), ...await page.getByTestId("dialogue-choice").all()]) {
      const box = await element.boundingBox();
      expect(box).not.toBeNull(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    }
    await page.screenshot({ path: info.outputPath(`wood-stop-decision-${viewport.width}x${viewport.height}.png`) });
  }
  await page.keyboard.press("1");
  await expect(page.getByTestId("dialogue-text")).toContainText("luz diurna");
  await expect.poll(async () => (await probe(page, "inspect")).activeSources.length).toBe(3);
  expect((await probe(page, "inspect")).activeSources.every((source: { count: number }) => source.count <= 1)).toBe(true);
});

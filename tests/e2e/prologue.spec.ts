import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./prologueTestDriver";

for (const observed of [true, false]) test(`Nellie opening ${observed ? "observe" : "ignore"}: proximity, ordered tale and canonical restore`, async ({ page }) => {
  test.setTimeout(240000); await boot(page); const entry = await probe(page, "save"); await close(page);
  const anchored = await probe(page, "save");
  for (const [point, position] of [["far", { x: 400, y: 860 }], ["director", { x: 1250, y: 800 }]] as const) {
    await probe(page, "go", point); await expect.poll(async () => (await probe(page, "inspect")).player).toEqual(position);
    await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
    expect((await probe(page, "inspect")).state.phase).toBe("anchored");
  }
  if (observed) { await interact(page, "mooring", "agua del fondeadero"); await close(page); }
  await interact(page, "horizon", "Comenzar el relato");
  await expect(page.getByTestId("dialogue-text")).toContainText("lugares oscuros de la tierra");
  const opening = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(opening.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Roma");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "escuchamos junto a la amarra" : "cambia el silencio");
  const memory = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("marinero de agua dulce");
  const last = await probe(page, "save"); await close(page);
  expect((await probe(page, "inspect")).state).toEqual({ phase: "ready", anchorageObserved: observed });
  await probe(page, "place", JSON.stringify({ x: 1143.75, y: 819.5 }));
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1143.75, y: 819.5 });
  const ready = await probe(page, "save");
  await interact(page, "director", "Continuar el viaje");
  await expect(page.getByTestId("dialogue-text")).toContainText("episodios todavía no son jugables");
  const ellipsis = await probe(page, "save"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).deck).toBe(true);
  const deck = await probe(page, "save"); expect(deck.state.phase).toBe("complete"); expect(deck.ending.phase).toBe("inactive");
  expect(deck.playerCount).toBe(0); expect(deck.sources.filter((c: { id: string }) => c.id.startsWith("journey-prologue:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  for (const saved of [entry, anchored, opening, memory, last, ready, ellipsis]) {
    const exact = await probe(page, "restore", saved.data);
    expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player); expect(exact.labels).toEqual(saved.labels);
    expect(exact.dialogue).toEqual(saved.dialogue);
    if (saved.dialogue) await expect(page.getByTestId("dialogue-text")).toHaveText(saved.dialogue);
    expect(exact.ending.phase).toBe("inactive"); expect(exact.playerCount).toBe(1); expect(exact.overlays).toBe(1);
    if ([opening, memory, last].includes(saved)) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("ready"); }
    else if (saved === entry) await close(page);
    else if (saved === ellipsis) { await close(page); expect((await probe(page, "inspect")).deck).toBe(true); }
  }
  await probe(page, "restore", ready.data); await probe(page, "restore", ready.data);
  const s = await probe(page, "inspect"); expect(s.currentCount).toBeLessThanOrEqual(3); expect(s.overlays).toBe(1);
  await expect.poll(async () => (await probe(page, "inspect")).currentX).not.toBe(s.currentX);
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-prologue:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  await probe(page, "restartPrologue"); await expect(page.getByTestId("dialogue-text")).toContainText("Nellie está fondeada");
  expect((await probe(page, "inspect")).state).toEqual({ phase: "anchored", anchorageObserved: false });
  expect((await probe(page, "inspect")).overlays).toBe(1); await close(page);
  await probe(page, "restart"); const reset = await probe(page, "inspect"); expect(reset.deck).toBe(true);
  expect(reset.state.phase).toBe("inactive"); expect(reset.ending.phase).toBe("inactive");
  expect(reset.sources.filter((c: { id: string }) => c.id.startsWith("journey-prologue:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("optional prologue route preserves default Deck and Metamorphosis entry selection", async ({ page }) => {
  test.setTimeout(150000);
  for (const url of ["/", "/?story=journey", "/?episode=prologue", "/?story=journey&episode=unknown"]) {
    await page.goto(url); await expect(page.getByTestId("talk-prompt")).toBeVisible();
    expect((await probe(page, "inspect")).deck).toBe(true); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  }
  await page.goto("/?story=metamorphosis&episode=prologue");
  await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Gregor/);
  expect((await probe(page, "inspect")).deck).toBe(false); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

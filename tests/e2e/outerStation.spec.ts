import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./outerTestDriver";

for (const response of ["give", "stay"]) test(`Outer Station ${response}: spatial coast/shore route, memory and exact PixiVN restore`, async ({ page }) => {
  test.setTimeout(240000); const observed = response === "give";
  await boot(page); const entry = await probe(page, "save"); await close(page);
  for (const point of ["far", "landing", "accountant"]) {
    const position = await probe(page, "go", point);
    await expect.poll(async () => (await probe(page, "inspect")).player).toEqual(position);
    await page.keyboard.press("e");
    expect((await probe(page, "inspect")).labels).toEqual([]); expect((await probe(page, "inspect")).state.phase).toBe("coast");
  }
  if (observed) { await interact(page, "surf", "Escuchar la rompiente"); await close(page); }
  const coast = await probe(page, "save");
  await interact(page, "warship", "buque de guerra"); await expect(page.getByTestId("dialogue-text")).toContainText("dispara contra la vegetación"); await close(page);
  const landfall = await probe(page, "save"); expect(landfall.state.phase).toBe("landfall");
  await probe(page, "go", "warship"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
  await interact(page, "landing", "Desembarcar"); const captain = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("capitán sueco");
  const landedLine = await probe(page, "save"); expect(landedLine.coast).toBe(false); expect(landedLine.office).toBe(true);
  expect(landedLine.officeAboveSlope).toBe(true);
  await close(page); expect((await probe(page, "inspect")).state.phase).toBe("landed");
  await probe(page, "go", "accountant"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
  await interact(page, "works", "maquinaria y el camino"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("cadena al cuello"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "remeros de la rompiente" : "Dejo pasar la fila"); await close(page);
  const works = await probe(page, "save");
  await interact(page, "grove", "trabajadores en la sombra"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice").nth(0)).toHaveText("1 · Ofrecer la galleta");
  await expect(page.getByTestId("dialogue-choice").nth(1)).toHaveText("2 · Quedarme un momento a su lado");
  const pending = await probe(page, "save");
  await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.groveResponse).toBeNull();
  await page.keyboard.down("d"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(pending.player.x + 8); }
  finally { await page.keyboard.up("d"); }
  expect((await probe(page, "inspect")).choices).toHaveLength(2);
  await page.keyboard.press(observed ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "Ofrezco una galleta" : "Me quedo un momento");
  const chosen = await probe(page, "save"); expect(chosen.state.groveResponse).toBe(response);
  await close(page); const accounting = await probe(page, "save"); expect(accounting.state.phase).toBe("accounting");
  await interact(page, "accountant", "Escuchar al contable"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("señor Kurtz"); const kurtz = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "dedos cerrados sobre la galleta" : "momento sin palabras");
  const memory = await probe(page, "save"); await close(page);
  await probe(page, "place", JSON.stringify({ x: 1234.75, y: 812.5 }));
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1234.75, y: 812.5 });
  const ready = await probe(page, "save"); expect(ready.state).toEqual({ phase: "ready", surfObserved: observed, groveResponse: response });
  await interact(page, "exit", "una elipsis"); await expect(page.getByTestId("dialogue-text")).toContainText("caravana y la llegada a la Estación Central están disponibles en su entrada opcional");
  const ellipsis = await probe(page, "save"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).deck).toBe(true);
  const deck = await probe(page, "save"); expect(deck.state.phase).toBe("complete"); expect(deck.playerCount).toBe(0);
  expect(deck.sources.filter((c: { id: string }) => c.id.startsWith("journey-outer:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  for (const saved of [entry, coast, landfall, captain, landedLine, works, pending, chosen, accounting, kurtz, memory, ready, ellipsis]) {
    const exact = await probe(page, "restore", saved.data);
    expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player); expect(exact.labels).toEqual(saved.labels);
    expect(exact.coast).toBe(saved.coast); expect(exact.office).toBe(saved.office);
    expect(exact.dialogue).toEqual(saved.dialogue); expect(exact.choices).toEqual(saved.choices);
    if (saved.dialogue) await expect(page.getByTestId("dialogue-text")).toHaveText(saved.dialogue);
    expect(exact.playerCount).toBe(1); expect(exact.overlays).toBe(1);
    expect(exact.commission.phase).toBe("inactive"); expect(exact.prologue.phase).toBe("inactive");
    if (saved === pending) { await page.keyboard.press(observed ? "1" : "2"); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("accounting"); }
    else if (saved === chosen) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("accounting"); }
    else if (saved === captain) { await close(page); expect((await probe(page, "inspect")).coast).toBe(false); }
    else if ([kurtz, memory].includes(saved)) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("ready"); }
    else if (saved === ellipsis) { await close(page); expect((await probe(page, "inspect")).deck).toBe(true); }
  }
  await probe(page, "restore", pending.data); await probe(page, "restore", pending.data);
  await page.keyboard.press(observed ? "2" : "1"); await close(page);
  await interact(page, "accountant", "Escuchar al contable"); await page.keyboard.press("e"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "momento sin palabras" : "dedos cerrados sobre la galleta"); await close(page);
  await probe(page, "restore", ready.data); await probe(page, "restore", ready.data); await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-outer:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  expect((await probe(page, "inspect")).overlays).toBe(1);
  await probe(page, "restore", deck.data); expect((await probe(page, "inspect")).deck).toBe(true);
  await probe(page, "restartOuter"); expect((await probe(page, "inspect")).state).toEqual({ phase: "coast", surfObserved: false, groveResponse: null });
  await close(page); await probe(page, "restart"); expect((await probe(page, "inspect")).deck).toBe(true);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.filter((c: { id: string }) => c.id.startsWith("journey-outer:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Outer Station remains optional beside the Deck, Nellie, Company and Metamorphosis", async ({ page }) => {
  test.setTimeout(180000);
  for (const url of ["/", "/?story=journey", "/?episode=outer-station", "/?story=journey&episode=unknown"]) {
    await page.goto(url); await expect(page.getByTestId("talk-prompt")).toBeVisible();
    expect((await probe(page, "inspect")).deck).toBe(true); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  }
  await page.goto("/?story=journey&episode=prologue"); await expect(page.getByTestId("dialogue-text")).toContainText("Nellie está fondeada");
  expect((await probe(page, "inspect")).prologue.phase).toBe("anchored");
  await page.goto("/?story=journey&episode=commission"); await expect(page.getByTestId("dialogue-text")).toContainText("Antes del vapor hubo una carta");
  expect((await probe(page, "inspect")).commission.phase).toBe("recommended");
  await page.goto("/?story=metamorphosis&episode=outer-station"); await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Gregor/);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

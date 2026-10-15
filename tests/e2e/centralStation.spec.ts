import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./centralTestDriver";

for (const response of ["shade", "load"]) test(`Central Station ${response}: caravan exploration, wreck memory and exact canonical restores`, async ({ page }) => {
  test.setTimeout(240000); const observed = response === "shade";
  await boot(page); const entry = await probe(page, "save"); await close(page);
  for (const point of ["far", "arrival", "agent", "wreck"]) {
    const position = await probe(page, "go", point);
    await expect.poll(async () => (await probe(page, "inspect")).player).toEqual(position);
    await page.keyboard.press("e");
    expect((await probe(page, "inspect")).labels).toEqual([]);
    expect((await probe(page, "inspect")).state.phase).toBe("trail");
  }
  if (observed) { await interact(page, "village", "aldea abandonada"); await close(page); }
  const trail = await probe(page, "save");
  await interact(page, "ravine", "atravesar el barranco"); await close(page);
  const ravine = await probe(page, "save"); expect(ravine.state.phase).toBe("ravine");
  await interact(page, "camp", "campamento");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "paredes de hierba" : "Campamento, comida, sueño");
  await close(page); const camp = await probe(page, "save");
  await interact(page, "companion", "compañero enfermo"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice").nth(0)).toHaveText("1 · Resguardarlo del sol");
  await expect(page.getByTestId("dialogue-choice").nth(1)).toHaveText("2 · Observar cómo reparten la carga");
  const pending = await probe(page, "save"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.companionResponse).toBeNull();
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(pending.player.x + 8); }
  finally { await page.keyboard.up("d"); }
  expect((await probe(page, "inspect")).choices).toHaveLength(2);
  await page.keyboard.press(observed ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "chaqueta sobre su cabeza" : "distribución de la carga");
  const chosen = await probe(page, "save"); expect(chosen.state.companionResponse).toBe(response);
  await close(page); const approach = await probe(page, "save"); expect(approach.state.phase).toBe("approach");
  await interact(page, "arrival", "Estación Central"); const arrived = await probe(page, "save");
  expect(arrived.state.phase).toBe("arrived"); expect(arrived.caravan).toBe(false);
  expect(arrived.wreck).toBe(true); expect(arrived.gateAboveSoil).toBe(true);
  await close(page); await interact(page, "agent", "noticia del vapor");
  await expect(page.getByTestId("dialogue-text")).toContainText("fondo del río"); const news = await probe(page, "save");
  await close(page); const shore = await probe(page, "save"); expect(shore.state.phase).toBe("wreck");
  await interact(page, "wreck", "vapor hundido");
  await expect(page.getByTestId("dialogue-text")).toContainText("dos días antes");
  const wreck = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "sombra de mi chaqueta" : "peso de la hamaca");
  const memory = await probe(page, "save"); await close(page);
  await probe(page, "place", JSON.stringify({ x: 1234.75, y: 812.5 }));
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1234.75, y: 812.5 });
  const ready = await probe(page, "save");
  expect(ready.state).toEqual({ phase: "ready", villageObserved: observed, companionResponse: response });
  await interact(page, "exit", "una elipsis");
  await expect(page.getByTestId("dialogue-text")).toContainText("entrevista con el gerente");
  const ellipsis = await probe(page, "save"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).deck).toBe(true);
  const deck = await probe(page, "save"); expect(deck.state.phase).toBe("complete"); expect(deck.playerCount).toBe(0);
  expect(deck.sources.filter((source: { id: string }) => source.id.startsWith("journey-central:")).every((source: { count: number }) => source.count === 0)).toBe(true);
  for (const saved of [entry, trail, ravine, camp, pending, chosen, approach, arrived, news, shore, wreck, memory, ready, ellipsis]) {
    const restored = await probe(page, "restore", saved.data);
    expect(restored.state).toEqual(saved.state); expect(restored.player).toEqual(saved.player);
    expect(restored.dialogue).toEqual(saved.dialogue); expect(restored.choices).toEqual(saved.choices); expect(restored.labels).toEqual(saved.labels);
    expect(restored.caravan).toBe(saved.caravan); expect(restored.wreck).toBe(saved.wreck);
    expect(restored.playerCount).toBe(1); expect(restored.overlays).toBe(1);
    expect(restored.outer.phase).toBe("inactive"); expect(restored.commission.phase).toBe("inactive");
    if (saved.dialogue) await expect(page.getByTestId("dialogue-text")).toHaveText(saved.dialogue);
    if (saved === pending) { await page.keyboard.press(observed ? "1" : "2"); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("approach"); }
    else if (saved === chosen) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("approach"); }
    else if (saved === arrived) { await close(page); expect((await probe(page, "inspect")).caravan).toBe(false); }
    else if ([wreck, memory].includes(saved)) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("ready"); }
    else if (saved === ellipsis) { await close(page); expect((await probe(page, "inspect")).deck).toBe(true); }
  }
  await probe(page, "restore", pending.data); await probe(page, "restore", pending.data);
  await page.keyboard.press(observed ? "2" : "1"); await close(page);
  await interact(page, "arrival", "Estación Central"); await close(page);
  await interact(page, "agent", "noticia del vapor"); await close(page);
  await interact(page, "wreck", "vapor hundido"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "peso de la hamaca" : "sombra de mi chaqueta"); await close(page);
  await probe(page, "restore", ready.data); await probe(page, "restore", ready.data); await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((source: { id: string; count: number; volume: number }) =>
    source.id.startsWith("journey-central:") && source.count === 1 && source.volume > 0)).toBe(true);
  expect((await probe(page, "inspect")).sources.every((source: { count: number }) => source.count <= 1)).toBe(true);
  expect((await probe(page, "inspect")).overlays).toBe(1);
  await probe(page, "restore", deck.data); expect((await probe(page, "inspect")).deck).toBe(true);
  await probe(page, "restartCentral");
  expect((await probe(page, "inspect")).state).toEqual({ phase: "trail", villageObserved: false, companionResponse: null });
  await close(page); await probe(page, "restart"); expect((await probe(page, "inspect")).deck).toBe(true);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.filter((source: { id: string }) => source.id.startsWith("journey-central:")).every((source: { count: number }) => source.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Central Station entry preserves the Deck, earlier episodes and Metamorphosis", async ({ page }) => {
  test.setTimeout(180000);
  for (const url of ["/", "/?story=journey", "/?episode=central-station", "/?story=journey&episode=unknown"]) {
    await page.goto(url); await expect(page.getByTestId("talk-prompt")).toBeVisible();
    expect((await probe(page, "inspect")).deck).toBe(true); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  }
  await page.goto("/?story=journey&episode=prologue"); await expect(page.getByTestId("dialogue-text")).toContainText("Nellie está fondeada");
  expect((await probe(page, "inspect")).prologue.phase).toBe("anchored");
  await page.goto("/?story=journey&episode=commission"); await expect(page.getByTestId("dialogue-text")).toContainText("Antes del vapor hubo una carta");
  expect((await probe(page, "inspect")).commission.phase).toBe("recommended");
  await page.goto("/?story=journey&episode=outer-station"); await expect(page.getByTestId("dialogue-text")).toContainText("Partí en un vapor francés");
  expect((await probe(page, "inspect")).outer.phase).toBe("coast"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await page.goto("/?story=metamorphosis&episode=central-station"); await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Gregor/);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

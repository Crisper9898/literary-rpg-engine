import { expect, test } from "@playwright/test";
import { boot, interact, close, probe } from "./commissionTestDriver";

for (const response of ["return", "question"]) test(`Company appointment ${response}: spatial contract, medical choice and exact canonical restore`, async ({ page }) => {
  test.setTimeout(240000); const observed = response === "return";
  await boot(page); const entry = await probe(page, "save"); await close(page);
  for (const [point, position] of [["far", { x: 380, y: 860 }], ["doctor", { x: 470, y: 745 }], ["threshold", { x: 1510, y: 790 }]] as const) {
    await probe(page, "go", point); await expect.poll(async () => (await probe(page, "inspect")).player).toEqual(position);
    await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
    expect((await probe(page, "inspect")).state.phase).toBe("recommended");
  }
  if (observed) { await interact(page, "map", "mapa de colores"); await close(page); }
  await interact(page, "recommendation", "recomendación de tu tía");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("había golpeado a un jefe"); await close(page);
  const waiting = await probe(page, "save"); expect(waiting.state.phase).toBe("waiting");
  await interact(page, "threshold", "mujeres que tejen"); await expect(page.getByTestId("dialogue-text")).toContainText("lana negra");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "serpiente de tinta" : "gran mapa de colores"); await close(page);
  await interact(page, "contract", "Firmar el contrato"); await close(page);
  const contracted = await probe(page, "save"); expect(contracted.state.phase).toBe("contracted");
  await interact(page, "doctor", "Presentarte ante el médico"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice").nth(0)).toHaveText("1 · Preguntar por quienes regresan");
  await expect(page.getByTestId("dialogue-choice").nth(1)).toHaveText("2 · Cuestionar el propósito de la medición");
  const pending = await probe(page, "save"); expect(pending.state.medicalResponse).toBeNull();
  await page.keyboard.down("d"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(pending.player.x + 8); }
  finally { await page.keyboard.up("d"); }
  expect((await probe(page, "inspect")).choices).toHaveLength(2);
  await page.keyboard.press(response === "return" ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "quienes regresan" : "¿Es esto ciencia?");
  const chosen = await probe(page, "save"); expect(chosen.state.medicalResponse).toBe(response);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "Los cambios ocurren por dentro" : "contrastar una teoría");
  const reply = await probe(page, "save"); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("cleared");
  await interact(page, "threshold", "despedida de tu tía"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "Cuando vuelvas" : "No seas tan desconfiado");
  const farewell = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "aquellos colores" : "existe para obtener ganancias"); await close(page);
  await probe(page, "place", JSON.stringify({ x: 1234.75, y: 812.5 }));
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1234.75, y: 812.5 });
  const ready = await probe(page, "save"); expect(ready.state).toEqual({ phase: "ready", mapObserved: observed, medicalResponse: response });
  await interact(page, "threshold", "Continuar hacia el vapor"); await expect(page.getByTestId("dialogue-text")).toContainText("viaje costero");
  const ellipsis = await probe(page, "save"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).deck).toBe(true);
  const deck = await probe(page, "save"); expect(deck.state.phase).toBe("complete"); expect(deck.playerCount).toBe(0);
  expect(deck.sources.filter((c: { id: string }) => c.id.startsWith("journey-commission:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  for (const saved of [entry, waiting, contracted, pending, chosen, reply, farewell, ready, ellipsis]) {
    const exact = await probe(page, "restore", saved.data);
    expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player); expect(exact.labels).toEqual(saved.labels);
    expect(exact.dialogue).toEqual(saved.dialogue); expect(exact.choices).toEqual(saved.choices);
    if (saved.dialogue) await expect(page.getByTestId("dialogue-text")).toHaveText(saved.dialogue);
    expect(exact.europe.phase).toBe("inactive"); expect(exact.prologue.phase).toBe("inactive");
    expect(exact.playerCount).toBe(1); expect(exact.overlays).toBe(1);
    if (saved === pending) { await page.keyboard.press(response === "return" ? "1" : "2"); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("cleared"); }
    else if ([chosen, reply].includes(saved)) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("cleared"); }
    else if (saved === farewell) { await close(page); expect((await probe(page, "inspect")).state.phase).toBe("ready"); }
    else if (saved === entry) await close(page);
    else if (saved === ellipsis) { await close(page); expect((await probe(page, "inspect")).deck).toBe(true); }
  }
  await probe(page, "restore", ready.data); await probe(page, "restore", ready.data);
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-commission:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  expect((await probe(page, "inspect")).overlays).toBe(1);
  await probe(page, "restore", deck.data); expect((await probe(page, "inspect")).deck).toBe(true);
  await probe(page, "restartCommission"); expect((await probe(page, "inspect")).state).toEqual({ phase: "recommended", mapObserved: false, medicalResponse: null });
  await close(page); await probe(page, "restart"); expect((await probe(page, "inspect")).deck).toBe(true);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.filter((c: { id: string }) => c.id.startsWith("journey-commission:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("commission is optional: default Deck, opening Nellie and Metamorphosis keep their entries", async ({ page }) => {
  test.setTimeout(180000);
  for (const url of ["/", "/?story=journey", "/?episode=commission", "/?story=journey&episode=unknown"]) {
    await page.goto(url); await expect(page.getByTestId("talk-prompt")).toBeVisible();
    expect((await probe(page, "inspect")).deck).toBe(true); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  }
  await page.goto("/?story=journey&episode=prologue"); await expect(page.getByTestId("dialogue-text")).toContainText("Nellie está fondeada");
  expect((await probe(page, "inspect")).prologue.phase).toBe("anchored"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await page.goto("/?story=metamorphosis&episode=commission"); await expect(page.locator("canvas")).toHaveAttribute("aria-label", /Gregor/);
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

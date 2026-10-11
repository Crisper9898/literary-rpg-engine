import { expect, test } from "@playwright/test";
import { prepare, start, interact, choices, close, probe } from "./intendedTestDriver";

for (const key of ["1", "2"]) test(`Intended ${key}: delivery, moral pressure and canonical save/restore`, async ({ page }) => {
  test.setTimeout(240000); const witness = key === "1";
  await prepare(page, witness ? "witness" : "music"); const before = await probe(page, "save"); await start(page);
  const arrival = await probe(page, "save"); expect(arrival.packetVisible).toBe(false);
  await probe(page, "go", "intended"); await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1400, y: 775 });
  await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
  if (witness) {
    await interact(page, "window", "Mirar las tres ventanas"); await close(page);
    await interact(page, "piano", "Observar el piano"); await expect(page.getByTestId("dialogue-text")).toContainText("intenté hablarle del final"); await close(page);
  }
  await interact(page, "table", "Entregar las cartas"); const handing = await probe(page, "save");
  expect(handing.packetVisible).toBe(false); await close(page); const delivered = await probe(page, "save"); expect(delivered.packetVisible).toBe(true);
  await choices(page); const options = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(options.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await page.keyboard.press(key);
  await expect(page.getByTestId("dialogue-text")).toContainText(witness ? "hasta el final" : "cómo lo recuerda");
  const partial = await probe(page, "save"); expect(partial.state.approach).toBe(witness ? "witness" : "listen");
  await close(page); const heard = await probe(page, "save"); expect(heard.state.phase).toBe("heard");
  await interact(page, "intended", "Afrontar la pregunta");
  await expect(page.getByTestId("dialogue-text")).toContainText(witness ? "Estuvo con él" : "Conservo su voz");
  const request = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(witness ? "oscuridad del cristal" : "Todavía oigo");
  await expect(page.getByTestId("dialogue-text")).toContainText("El horror"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("su nombre"); const lie = await probe(page, "save");
  await close(page); const departure = await probe(page, "save"); expect(departure.state.phase).toBe("departure");
  await interact(page, "door", "Despedirse"); await expect(page.getByTestId("dialogue-text")).toContainText(witness ? "Quise hablar como testigo" : "Escuché al hombre");
  await close(page); const complete = await probe(page, "save"); expect(complete.state.phase).toBe("complete");
  for (const saved of [arrival, delivered, heard, departure, complete]) {
    const exact = await probe(page, "restore", saved.data); expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player);
    expect(exact.packetVisible).toBe(saved.packetVisible); expect(exact.dusk).toBe(saved.dusk);
  }
  await probe(page, "restore", options.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await probe(page, "restore", handing.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("delivered");
  await probe(page, "restore", partial.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("heard");
  await probe(page, "restore", request.data); await expect(page.getByTestId("dialogue-text")).toContainText("últimas palabras"); await close(page);
  await probe(page, "restore", lie.data); await expect(page.getByTestId("dialogue-text")).toContainText("su nombre"); await close(page);
  await probe(page, "restore", complete.data); await probe(page, "restore", complete.data);
  await interact(page, "door", "Recordar lo que no dije"); await expect(page.getByTestId("dialogue-text")).toContainText("mentira"); await close(page);
  const s = await probe(page, "inspect"); expect(s.playerCount).toBe(1); expect(s.packetCount).toBe(1); expect(s.overlays).toBe(1); expect(s.labels).toEqual([]);
  expect(s.sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-kurtz-intended:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect(s.sources.filter((c: { id: string }) => c.id.startsWith("journey-kurtz-legacy:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive"); expect((await probe(page, "inspect")).packetCount).toBe(0);
  await probe(page, "go", "door"); await expect(page.getByTestId("talk-prompt")).toContainText("Visitar a la Prometida");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});
test("Intended visit requires the last packet and actual door proximity", async ({ page }) => {
  test.setTimeout(150000); const { prepare: previous } = await import("./legacyTestDriver"); await previous(page);
  await probe(page, "go", "door"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Visitar a la Prometida");
  await probe(page, "completeLegacy"); await probe(page, "go", "far");
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 380, y: 860 }); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

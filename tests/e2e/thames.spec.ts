import { expect, test } from "@playwright/test";
import { prepare, start, interact, close, probe } from "./thamesTestDriver";

for (const observed of [true, false]) test(`Thames ${observed ? "observe" : "ignore"}: ordered frame and canonical restore`, async ({ page }) => {
  test.setTimeout(240000); await prepare(page, observed ? "witness" : "listen");
  const before = await probe(page, "save");
  await interact(page, "entry", "Regresar al relato en el Támesis"); const entry = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "Quise ser testigo" : "Escuché su certeza");
  await close(page); const returned = await probe(page, "save");
  await probe(page, "go", "horizon"); await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 970, y: 740 });
  await page.keyboard.press("e"); expect((await probe(page, "inspect")).labels).toEqual([]);
  if (observed) { await interact(page, "mooring", "agua junto a la amarra"); await close(page); }
  await interact(page, "director", "Escuchar al Director"); const silence = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(silence.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("comienzo del reflujo");
  const director = await probe(page, "save"); await close(page); const ebb = await probe(page, "save");
  expect(ebb.state.phase).toBe("ebb");
  await probe(page, "place", JSON.stringify({ x: 1143.75, y: 819.5 }));
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 1143.75, y: 819.5 });
  const positioned = await probe(page, "save");
  await interact(page, "horizon", "Levantar la mirada");
  await expect(page.getByTestId("dialogue-text")).toContainText(observed ? "vi pasar junto a la amarra" : "agua continúa pasando");
  const horizon = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("corazón de una inmensa oscuridad"); const ending = await probe(page, "save");
  await close(page); const complete = await probe(page, "save");
  expect(complete.state).toEqual({ phase: "complete", mooringObserved: observed });
  for (const saved of [returned, positioned, ebb, complete]) {
    const exact = await probe(page, "restore", saved.data); expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player);
    expect(exact.veil).toBe(saved.veil); expect(exact.labels).toEqual([]);
  }
  for (const saved of [entry, silence, director, horizon, ending]) {
    const exact = await probe(page, "restore", saved.data); expect(exact.player).toEqual(saved.player); expect(exact.labels).toEqual(saved.labels);
    await close(page); expect((await probe(page, "inspect")).state.phase).toBe(saved === entry ? "returned" : saved === silence || saved === director ? "ebb" : "complete");
  }
  await probe(page, "restore", complete.data); await probe(page, "restore", complete.data);
  await interact(page, "horizon", "Contemplar el río"); await expect(page.getByTestId("dialogue-text")).toContainText("El relato ha terminado"); await close(page);
  const s = await probe(page, "inspect"); expect(s.playerCount).toBe(1); expect(s.mooringCount).toBe(1); expect(s.overlays).toBe(1);
  expect(s.currentCount).toBeLessThanOrEqual(3); expect(s.labels).toEqual([]);
  await expect.poll(async () => (await probe(page, "inspect")).currentX).not.toBe(s.currentX);
  expect(s.sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-thames:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect(s.sources.filter((c: { id: string }) => c.id.startsWith("journey-kurtz-intended:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restore", before.data); const previous = await probe(page, "inspect");
  expect(previous.state.phase).toBe("inactive"); expect(previous.playerCount).toBe(0); expect(previous.intended.phase).toBe("complete");
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).toContainText("Regresar al relato");
  expect(previous.sources.filter((c: { id: string }) => c.id.startsWith("journey-thames:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});
test("Thames entry waits for the Intended departure and actual window proximity", async ({ page }) => {
  test.setTimeout(150000); const { prepare: previous } = await import("./intendedTestDriver"); await previous(page);
  await expect(page.getByTestId("talk-prompt")).not.toContainText("Regresar al relato");
  await probe(page, "completeIntended"); await probe(page, "go", "far");
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 380, y: 860 }); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, start, interact, cousinChoice, journalistChoice, close, probe } from "./legacyTestDriver";

for (const key of ["1", "2"]) test(`Kurtz legacy ${key}: document custody, different claims and canonical restoration`, async ({ page }) => {
  test.setTimeout(240000); const music = key === "1";
  await prepare(page, music ? "private" : "commerce"); const before = await probe(page, "save"); await start(page);
  const entered = await probe(page, "save");
  await probe(page, "go", "far"); await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 380, y: 860 });
  await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("cousin"); expect((await probe(page, "inspect")).labels).toEqual([]);
  await cousinChoice(page); const choices = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(choices.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press(key); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "muchos talentos" : "Estuve con él al final");
  const partial = await probe(page, "save"); expect(partial.state.phase).toBe("cousinAnswered");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "genio universal" : "cuesta imaginar");
  await close(page); const readyFamily = await probe(page, "save");
  await probe(page, "go", "door"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("familyReady");
  await interact(page, "family", "Recoger las cartas familiares"); await close(page); const heldFamily = await probe(page, "save");
  expect(heldFamily.familyVisible).toBe(false); expect(heldFamily.lettersVisible).toBe(true); expect(heldFamily.reportVisible).toBe(true);
  await interact(page, "door", "Entregar las cartas al primo"); const handingFamily = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "imagen del músico" : "dificultad para contar"); await close(page);
  const next = await probe(page, "save"); expect(next.state.phase).toBe("journalist");
  await probe(page, "go", "report"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("journalist");
  await journalistChoice(page); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "cartas como privadas" : "valor comercial");
  const journalistChoices = await probe(page, "save"); await page.keyboard.press(key);
  await expect(page.getByTestId("dialogue-text")).toContainText(music ? "qué partido" : "poseer más");
  const journalistPartial = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(music ? "De cualquiera" : "cualquier partido extremo"); await close(page);
  await interact(page, "report", "Recoger el informe para publicación"); await close(page); const heldReport = await probe(page, "save");
  expect(heldReport.reportVisible).toBe(false); expect(heldReport.familyVisible).toBe(false); expect(heldReport.lettersVisible).toBe(true);
  await interact(page, "door", "Entregar el informe al periodista"); const handingReport = await probe(page, "save");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "Cualquier partido" : "ambición"); await close(page);
  const remaining = await probe(page, "save"); expect(remaining.state.phase).toBe("remaining"); expect(remaining.pressureVisible).toBe(false);
  await interact(page, "letters", "Examinar el último paquete"); await expect(page.getByTestId("dialogue-text")).toContainText(music ? "reconocí sus talentos" : "como testigo");
  await expect(page.getByTestId("dialogue-text")).toContainText(music ? "por su partido" : "deseo de poseer"); await close(page);
  const completed = await probe(page, "save"); expect(completed.state.phase).toBe("complete");
  for (const saved of [entered, readyFamily, heldFamily, next, heldReport, remaining, completed]) {
    const exact = await probe(page, "restore", saved.data); expect(exact.state).toEqual(saved.state); expect(exact.player).toEqual(saved.player);
    expect(exact.familyVisible).toBe(saved.familyVisible); expect(exact.reportVisible).toBe(saved.reportVisible);
  }
  for (const saved of [choices, journalistChoices]) {
    await probe(page, "restore", saved.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  }
  await probe(page, "restore", partial.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("familyReady");
  await probe(page, "restore", journalistPartial.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("reportReady");
  await probe(page, "restore", handingFamily.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("journalist");
  await probe(page, "restore", handingReport.data); await close(page); expect((await probe(page, "inspect")).state.phase).toBe("remaining");
  await probe(page, "restore", completed.data); await probe(page, "restore", completed.data);
  await interact(page, "letters", "Recordar las dos visitas"); await expect(page.getByTestId("dialogue-text")).toContainText("todavía no salgo"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
  const s = await probe(page, "inspect"); expect(s.playerCount).toBe(1); expect(s.familyCount).toBe(1); expect(s.reportCount).toBe(1); expect(s.overlays).toBe(1); expect(s.labels).toEqual([]);
  expect(s.sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((c: { id: string; count: number; volume: number }) =>
    c.id.startsWith("journey-kurtz-legacy:") && c.count === 1 && c.volume > 0)).toBe(true);
  expect(s.sources.filter((c: { id: string }) => c.id.startsWith("journey-europe-return:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive"); expect((await probe(page, "inspect")).familyCount).toBe(0);
  await probe(page, "go", "door"); await expect(page.getByTestId("talk-prompt")).toContainText("Recibir al primo");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("Kurtz legacy requires the Company's departure and door proximity", async ({ page }) => {
  test.setTimeout(150000); const { prepare: prior } = await import("./europeTestDriver"); await prior(page);
  await probe(page, "prepareCompany"); await probe(page, "go", "door");
  await expect(page.getByTestId("talk-prompt")).not.toContainText("Recibir al primo");
  await probe(page, "finishCompany"); await probe(page, "go", "far");
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual({ x: 380, y: 860 }); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

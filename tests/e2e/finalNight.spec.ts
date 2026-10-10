import { expect, test } from "@playwright/test";
import { prepare, start, vigil, words, depart, announce, interact, close, probe } from "./finalNightTestDriver";

for (const response of ["reassure", "listen"]) test(`final night ${response}: spatial candle, unchanged last words, death and canonical restores`, async ({ page }) => {
  test.setTimeout(210000); const papers = response === "listen" ? "ask" : "sealed";
  await prepare(page, papers); const before = await probe(page, "save"); await start(page);
  await probe(page, "go", "patient"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("evening");
  const dusk = await probe(page, "save"); const x = dusk.player.x;
  await page.keyboard.down("d"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(x + 8); }
  finally { await page.keyboard.up("d"); }
  const held = await vigil(page); const choice = await probe(page, "save");
  await expect(page.getByTestId("dialogue-text")).toContainText(papers === "ask" ? "rostro de su prometida" : "paquete sigue cerrado");
  expect(choice.state.candle).toBe("bedside"); await page.keyboard.press(response === "reassure" ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "reassure" ? "Yo sigo aquí" : "No lleno el silencio"); await close(page);
  const bedside = await probe(page, "save"); expect(bedside.state.response).toBe(response);
  const riverX = bedside.riverX; await expect.poll(async () => (await probe(page, "inspect")).riverX).not.toBe(riverX);
  await words(page); const last = await probe(page, "save"); expect(last.state.wordsHeard).toBe(true);
  await close(page); await depart(page); const left = await probe(page, "save");
  expect(left.state.phase).toBe("left"); expect(left.candleVisible).toBe(false); expect(left.patientVisible).toBe(false);
  await probe(page, "go", "far"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("left");
  await announce(page); expect((await probe(page, "inspect")).state.phase).toBe("confirmed"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(papers === "ask" ? "fotografía" : "cordón sigue cerrado"); await close(page);
  const completed = await probe(page, "save"); expect(completed.state.finalSeen).toBe(true);
  await probe(page, "restore", dusk.data); const restoredDusk = await probe(page, "inspect");
  expect(restoredDusk.player).toEqual(dusk.player); expect(restoredDusk.state.distance).toBeGreaterThanOrEqual(dusk.state.distance);
  expect(restoredDusk.state.progress).toBeGreaterThanOrEqual(dusk.state.progress);
  // Returned values from restore are synchronous with composition, before the next voyage tick.
  const exact = await probe(page, "restore", dusk.data); expect(exact.state).toEqual(dusk.state); expect(exact.player).toEqual(dusk.player);
  const restoredHeld = await probe(page, "restore", held.data); expect(restoredHeld.state).toEqual(held.state);
  expect(restoredHeld.player).toEqual(held.player); expect(restoredHeld.candleVisible).toBe(true);
  await page.keyboard.down("d"); try {
    await expect.poll(async () => (await probe(page, "inspect")).candlePoint.x).toBeGreaterThan(restoredHeld.candlePoint.x + 8);
  } finally { await page.keyboard.up("d"); }
  await probe(page, "restore", choice.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  await probe(page, "restore", bedside.data); await probe(page, "go", "patient");
  await expect(page.getByTestId("talk-prompt")).toContainText("Quedarte a escuchar");
  expect((await probe(page, "inspect")).state.response).toBe(response);
  await probe(page, "restore", last.data); await expect(page.getByTestId("dialogue-text")).toHaveText("¡El horror! ¡El horror!");
  expect((await probe(page, "inspect")).state.phase).toBe("words"); await close(page);
  await probe(page, "restore", left.data); await probe(page, "go", "patient"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("left"); expect((await probe(page, "inspect")).labels).toEqual([]);
  await probe(page, "restore", completed.data); await probe(page, "restore", completed.data);
  const restored = await probe(page, "inspect"); expect(restored.state.response).toBe(response);
  expect(restored.state.phase).toBe("confirmed"); expect(restored.labels).toEqual([]);
  expect(restored.entities.every((e: { count: number }) => e.count === 1)).toBe(true);
  expect(restored.sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).toContainText("última noche");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("final night requires completed repair and papers, and E remains spatial", async ({ page }) => {
  test.setTimeout(150000); const { prepare: prior } = await import("./breakdownTestDriver"); await prior(page);
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).not.toContainText("última noche");
  await probe(page, "completeBreakdown"); await probe(page, "go", "far"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  await probe(page, "go", "far"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.candle).toBe("rack");
  await probe(page, "go", "crew"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("evening");
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

import { expect, test } from "@playwright/test";
import { prepare, start, interact, choice, close, probe } from "./europeTestDriver";

for (const response of ["private", "commerce"]) test(`European return ${response}: physical papers route, memory and canonical save/restore`, async ({ page }) => {
  test.setTimeout(240000); await prepare(page, response === "private" ? "help" : "alone", response === "private" ? "sealed" : "ask");
  const before = await probe(page, "save"); await start(page); const returned = await probe(page, "save");
  await probe(page, "go", "door"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("returned");
  if (response === "private") { await interact(page, "window", "Mirar la ciudad"); await close(page); }
  await interact(page, "packet", "Abrir el paquete"); await expect(page.getByTestId("dialogue-text")).toContainText(response === "private" ? "cordón" : "fotografía"); await close(page);
  await interact(page, "report", "Examinar el informe"); await expect(page.getByTestId("dialogue-text")).toContainText("posdata"); await close(page);
  await probe(page, "go", "report"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Preparar el informe");
  await interact(page, "letters", "Separar las cartas"); await close(page);
  await interact(page, "report", "Preparar el informe"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).postscriptVisible).toBe(false);
  const prepared = await probe(page, "save"); await interact(page, "door", "Responder al funcionario");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "private" ? "la ciudad continúa" : "ciertos documentos");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); const choices = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(choices.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press(response === "private" ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "private" ? "cartas son privadas" : "balance comercial");
  const partial = await probe(page, "save"); expect(partial.state.response).toBe(response); expect(partial.state.exchangeSeen).toBe(false);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(response === "private" ? "derecho" : "ciencia");
  await close(page); const replied = await probe(page, "save"); expect(replied.state.exchangeSeen).toBe(true);
  await probe(page, "go", "door"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("challenged");
  await interact(page, "report", "Recoger sólo el informe"); await close(page); const carrying = await probe(page, "save");
  expect(carrying.state.phase).toBe("carrying"); expect(carrying.reportVisible).toBe(false);
  await interact(page, "door", "Ofrecer el informe"); const offered = await probe(page, "save"); expect(offered.state.phase).toBe("offered");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(response === "private" ? "siguen siendo privadas" : "invocación de la ciencia");
  await close(page); const resolved = await probe(page, "save"); expect(resolved.state.phase).toBe("resolved");
  expect(resolved.reportVisible).toBe(true); expect(resolved.pressureVisible).toBe(false);
  const exact = await probe(page, "restore", returned.data); expect(exact.state).toEqual(returned.state); expect(exact.player).toEqual(returned.player);
  await probe(page, "restore", prepared.data); await probe(page, "go", "door"); await expect(page.getByTestId("talk-prompt")).toContainText("Responder al funcionario");
  await probe(page, "restore", choices.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  await probe(page, "restore", partial.data); await close(page); expect((await probe(page, "inspect")).state.response).toBe(response);
  const exactReply = await probe(page, "restore", replied.data); expect(exactReply.player).toEqual(replied.player);
  await probe(page, "go", "report"); await expect(page.getByTestId("talk-prompt")).toContainText("Recoger sólo");
  const exactCarry = await probe(page, "restore", carrying.data); expect(exactCarry.state).toEqual(carrying.state); expect(exactCarry.reportVisible).toBe(false);
  await probe(page, "restore", offered.data); await expect(page.getByTestId("dialogue-text")).toContainText("derecho a esperar"); await close(page);
  await probe(page, "restore", resolved.data); await probe(page, "restore", resolved.data);
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
  const s = await probe(page, "inspect"); expect(s.playerCount).toBe(1); expect(s.reportCount).toBe(1); expect(s.overlays).toBe(1); expect(s.labels).toEqual([]);
  expect(s.sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  expect(s.sources.filter((c: { id: string }) => c.id.startsWith("journey-kurtz-aftermath:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).toContainText("Regresar a Europa");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("European entry requires completed recovery and proximity; earlier return stays available", async ({ page }) => {
  test.setTimeout(150000); const { prepare: prior } = await import("./aftermathTestDriver"); await prior(page);
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Regresar a Europa");
  await probe(page, "completeAftermath"); await probe(page, "go", "far"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

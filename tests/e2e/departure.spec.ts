import { expect, test } from "@playwright/test";
import { prepare, board, release, decision, interact, close, probe } from "./departureTestDriver";
for (const response of ["whistle", "intervene"]) test(`departure ${response}: physical route, remembered priority and canonical restore`, async ({ page }) => {
  test.setTimeout(210000); await prepare(page, response === "whistle" ? "patient" : "cargo");
  const before = await probe(page, "save"); await board(page);
  expect((await probe(page, "inspect")).witnessesVisible).toBe(false);
  await interact(page, "patient", "Kurtz"); await expect(page.getByTestId("dialogue-text")).toContainText(response === "whistle" ? "antes que el marfil" : "Hice esperar"); await close(page);
  await release(page); expect((await probe(page, "inspect")).mooringVisible).toBe(false);
  const riverX = (await probe(page, "inspect")).riverX;
  await expect.poll(async () => (await probe(page, "inspect")).riverX).not.toBe(riverX);
  await expect.poll(async () => (await probe(page, "inspect")).sources.some((s: { id: string; count: number }) =>
    s.id.startsWith("journey-kurtz-departure:") && s.count === 1)).toBe(true);
  await interact(page, "bank", "orilla"); await expect(page.getByTestId("dialogue-text")).toContainText("Una mujer"); await close(page);
  await decision(page); const choice = await probe(page, "save"); await page.keyboard.press(response === "whistle" ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "whistle" ? "Tiro de la cuerda" : "iré hasta"); await close(page);
  if (response === "intervene") {
    await probe(page, "go", "helm"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Dar la señal");
    await interact(page, "crew", "bajen los rifles"); await close(page); await interact(page, "whistle", "Tirar"); await close(page);
  }
  const signalled = await probe(page, "save"); expect(signalled.state.response).toBe(response); expect(signalled.state.whistleUsed).toBe(true);
  await interact(page, "helm", "Dar la señal"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).state.progress).toBeGreaterThan(.05);
  await probe(page, "go", "far"); const mid = await probe(page, "save"); const x = mid.player.x;
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(x - 8); }
  finally { await page.keyboard.up("a"); }
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "whistle" ? "El silbato apartó" : "Mi orden les ganó", { timeout: 50000 });
  await close(page); const completed = await probe(page, "save"); expect(completed.state.finalSeen).toBe(true);
  const restored = await probe(page, "restore", mid.data); expect(restored.player).toEqual(mid.player);
  expect(restored.state.progress).toBe(mid.state.progress); expect(restored.shore).toEqual(mid.shore);
  expect(restored.state.response).toBe(response); expect(restored.state.bankSeen).toBe(true);
  await probe(page, "restore", completed.data); await probe(page, "restore", completed.data);
  expect((await probe(page, "inspect")).labels).toEqual([]);
  expect((await probe(page, "inspect")).entities.every((e: { count: number }) => e.count === 1)).toBe(true);
  expect((await probe(page, "inspect")).sources.every((e: { count: number }) => e.count <= 1)).toBe(true);
  await probe(page, "restore", choice.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  await probe(page, "restore", signalled.data); await probe(page, "go", "whistle");
  await expect(page.getByTestId("talk-prompt")).not.toContainText("Decidir");
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "go", "board"); await expect(page.getByTestId("talk-prompt")).toContainText("Embarcar");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((e: { count: number }) => e.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});
test("departure stays gated and spatial until the completed evacuation", async ({ page }) => {
  test.setTimeout(150000); const { prepare: prior } = await import("./evacuationTestDriver"); await prior(page);
  await probe(page, "go", "board"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Embarcar");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "completeEvacuation"); await probe(page, "go", "far"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await board(page); await probe(page, "go", "whistle"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  await release(page); await probe(page, "go", "far"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

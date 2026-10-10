import { expect, test } from "@playwright/test";
import { prepare, start, care, interact, close, probe } from "./aftermathTestDriver";

for (const response of ["help", "alone"]) test(`aftermath ${response}: spatial care, remembered choices and canonical save/restore`, async ({ page }) => {
  test.setTimeout(240000); await prepare(page, response === "help" ? "reassure" : "listen", response === "help" ? "sealed" : "ask");
  const before = await probe(page, "save"); await start(page); const morning = await probe(page, "save");
  await probe(page, "go", "far"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("morning");
  await probe(page, "go", "papers"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.papersSecured).toBe(false);
  await care(page); const choice = await probe(page, "save");
  await page.keyboard.down("a"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(choice.player.x - 8); }
  finally { await page.keyboard.up("a"); }
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press(response === "help" ? "1" : "2");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "help" ? "Necesito ayuda" : "No suelto el paquete");
  const partial = await probe(page, "save"); expect(partial.state.response).toBe(response); expect(partial.state.waterReceived).toBe(false);
  await close(page); const replied = await probe(page, "save"); expect(replied.state.careSeen).toBe(true);
  if (response === "alone") {
    await probe(page, "go", "shelter"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("fever");
    await interact(page, "water", "Buscar agua junto a la caseta"); await close(page);
  }
  expect((await probe(page, "inspect")).state.waterReceived).toBe(true);
  const cared = await probe(page, "save"), x = cared.player.x;
  await page.keyboard.down("d"); try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(x + 8); }
  finally { await page.keyboard.up("d"); }
  await interact(page, "shelter", "Resguardarte junto a la caseta"); const rest = await probe(page, "save");
  expect(rest.state.phase).toBe("resting"); await close(page); const recovering = await probe(page, "save");
  await interact(page, "recovery", "Volver a mirar la corriente");
  await expect(page.getByTestId("dialogue-text")).toContainText(response === "help" ? "mano del marinero" : "caseta sin ayuda");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(response === "help" ? "seguir aquí" : "silencio");
  await close(page); const completed = await probe(page, "save"); expect(completed.state.phase).toBe("survived");
  expect(completed.patientCount).toBe(0); expect(completed.papersVisible).toBe(false);
  const riverX = completed.riverX; await expect.poll(async () => (await probe(page, "inspect")).riverX).not.toBe(riverX);
  const exact = await probe(page, "restore", morning.data); expect(exact.state).toEqual(morning.state); expect(exact.player).toEqual(morning.player);
  await probe(page, "restore", choice.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  expect((await probe(page, "inspect")).state.response).toBeUndefined();
  await probe(page, "restore", partial.data); await close(page); expect((await probe(page, "inspect")).state.response).toBe(response);
  await probe(page, "restore", replied.data);
  if (response === "alone") { await probe(page, "go", "water"); await expect(page.getByTestId("talk-prompt")).toContainText("Buscar agua"); }
  else expect((await probe(page, "inspect")).state.waterReceived).toBe(true);
  const restoredCare = await probe(page, "restore", cared.data); expect(restoredCare.state).toEqual(cared.state); expect(restoredCare.player).toEqual(cared.player);
  await probe(page, "restore", rest.data); await expect(page.getByTestId("dialogue-text")).toContainText("gris");
  expect((await probe(page, "inspect")).state.phase).toBe("resting"); await close(page);
  await probe(page, "restore", recovering.data); await probe(page, "go", "burial");
  await expect(page.getByTestId("talk-prompt")).not.toContainText("noticia del entierro");
  await probe(page, "restore", completed.data); await probe(page, "restore", completed.data);
  const s = await probe(page, "inspect"); expect(s.state.response).toBe(response); expect(s.labels).toEqual([]);
  expect(s.entities.every((e: { count: number }) => e.count === 1)).toBe(true);
  expect(s.sources.every((c: { count: number }) => c.count <= 1)).toBe(true);
  expect(s.sources.filter((c: { id: string }) => c.id.startsWith("journey-kurtz-final-night:")).every((c: { count: number }) => c.count === 0)).toBe(true);
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).toContainText("Esperar el amanecer");
  await probe(page, "restart"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  expect((await probe(page, "inspect")).sources.every((c: { count: number }) => c.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

test("aftermath requires the completed death announcement and a nearby crew entry", async ({ page }) => {
  test.setTimeout(150000); const { prepare: prior } = await import("./finalNightTestDriver"); await prior(page);
  await probe(page, "go", "entry"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Esperar el amanecer");
  await probe(page, "completeFinalNight"); await probe(page, "go", "far"); await page.keyboard.press("e");
  expect((await probe(page, "inspect")).state.phase).toBe("inactive"); await start(page);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

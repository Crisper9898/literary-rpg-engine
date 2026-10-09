import { expect, test } from "@playwright/test";
import { prepare, start, examine, decision, secure, transfer, guide, interact, probe, close } from "./evacuationTestDriver";
for (const choice of [1, 2]) test(`evacuation priority ${choice}: preparation, living transfer and canonical saves`, async ({ page }) => {
  test.setTimeout(240000); await prepare(page, choice); const before = await probe(page, "save"); await start(page);
  await examine(page); await decision(page); const undecided = await probe(page, "save");
  await page.keyboard.press(String(choice)); const selected = await probe(page, "save");
  expect(selected.state.priority).toBe(choice === 1 ? "patient" : "cargo");
  await probe(page, "restore", undecided.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  expect((await probe(page, "inspect")).state.priority).toBeUndefined();
  await probe(page, "restore", selected.data); expect((await probe(page, "inspect")).state.priority).toBe(selected.state.priority);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "Es mi marfil" : "Mis palabras pueden esperar");
  const x = (await probe(page, "inspect")).player.x; await page.keyboard.down("a");
  try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeLessThan(x - 10); }
  finally { await page.keyboard.up("a"); } await close(page);
  await secure(page); const secured = await probe(page, "save"); expect(secured.ropeVisible).toBe(false);
  if (choice === 2) {
    await probe(page, "go", "patient"); await expect(page.getByTestId("talk-prompt")).not.toContainText("alzar");
    await interact(page, "cargo", "atado"); await close(page);
    const loaded = await probe(page, "inspect"); expect(loaded.cargoAlpha).toBe(1);
    expect(loaded.cargoSize.width * loaded.cargoSize.height).toBeLessThan(secured.cargoSize.width * secured.cargoSize.height / 2);
    expect(loaded.cargoFoot).toEqual(secured.cargoFoot);
  } else expect((await probe(page, "inspect")).cargoAlpha).toBe(1);
  await transfer(page); await probe(page, "go", "far");
  const still = (await probe(page, "inspect")).state.cot; await probe(page, "settleFrame");
  expect((await probe(page, "inspect")).state.cot).toEqual(still);
  await probe(page, "go", "ahead"); const moving = (await probe(page, "inspect")).state.cot.x;
  await page.keyboard.down("a");
  try { await expect.poll(async () => (await probe(page, "inspect")).state.cot.x).toBeLessThan(moving - 3); }
  finally { await page.keyboard.up("a"); }
  await probe(page, "go", "far"); await probe(page, "settleFrame"); const mid = await probe(page, "save");
  await guide(page); await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "antes que la carga" : "detrás del primer atado");
  await close(page); const final = await probe(page, "save"); expect(final.state.phase).toBe("ready"); expect(final.state.readySeen).toBe(true);
  const restored = await probe(page, "restore", mid.data);
  expect(restored.state.cot).toEqual(mid.state.cot); expect(restored.player).toEqual(mid.player); expect(restored.state.phase).toBe("transfer");
  await probe(page, "restore", final.data); await interact(page, "landing", "Permanecer");
  await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "La carga queda atrás" : "ya ha esperado bastante"); await close(page);
  await probe(page, "restore", secured.data); expect((await probe(page, "inspect")).state.phase).toBe("preparing");
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "go", "start");
  await expect(page.getByTestId("talk-prompt")).toContainText("amanecer"); expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});
test("evacuation is optional, spatial, prerequisite gated and cleans up on restart", async ({ page }) => {
  test.setTimeout(180000); const { reveal } = await import("./nightEscapeTestDriver"); await reveal(page);
  await probe(page, "go", "start"); await expect(page.getByTestId("talk-prompt")).not.toContainText("amanecer");
  await probe(page, "go", "far"); await page.keyboard.press("e"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await probe(page, "completeNight"); await probe(page, "go", "far");
  await expect(page.getByTestId("talk-prompt")).not.toContainText("amanecer"); expect((await probe(page, "inspect")).state.phase).toBe("inactive");
  await start(page); await probe(page, "go", "priority"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Decidir");
  await probe(page, "go", "bindings"); await expect(page.getByTestId("talk-prompt")).not.toContainText("Asegurar");
  const dawn = await probe(page, "save"); await probe(page, "restore", dawn.data); await probe(page, "restore", dawn.data);
  const restored = await probe(page, "inspect"); expect(restored.entities.every((e: { count: number }) => e.count === 1)).toBe(true);
  expect(restored.sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
  expect(restored.sources.filter((s: { id: string }) => s.id.startsWith("journey-kurtz-night:")).every((s: { count: number }) => s.count === 0)).toBe(true);
  await probe(page, "restart"); await expect(page.getByTestId("talk-prompt")).toBeVisible();
  const reset = await probe(page, "inspect"); expect(reset.state.phase).toBe("inactive");
  expect(reset.sources.every((s: { count: number }) => s.count === 0)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

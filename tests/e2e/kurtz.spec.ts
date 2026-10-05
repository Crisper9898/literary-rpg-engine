import { expect, test } from "@playwright/test";
import { probe, boot, closeDialogue, begin } from "./kurtzTestDriver";
test("attack-to-station route preserves prerequisites; Kurtz never appears just by approaching the house", async ({ page }) => {
  test.setTimeout(90000); await boot(page); await probe(page, "prepare"); await page.locator("canvas").focus();
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Aminoro");
  await closeDialogue(page); await probe(page, "dockTo", 1);
  await page.evaluate(async () => { const url = "/tests/e2e/stationProbe.ts"; (await import(url)).go("bow"); });
  await expect(page.getByTestId("talk-prompt")).toContainText("Desembarcar"); await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).player).not.toBeNull();
  await probe(page, "go", "path"); await expect(page.getByTestId("talk-prompt")).toContainText("Observar"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Kurtz");
  expect((await probe(page, "inspect")).introduction.activated).toBe(false);
  expect((await probe(page, "inspect")).visible).toBe(false);
  await closeDialogue(page);
  const stationGo = async (id: string) => page.evaluate(async id => { const url = "/tests/e2e/stationProbe.ts"; (await import(url)).go(id); }, id);
  await stationGo("planks"); await expect(page.getByTestId("talk-prompt")).toContainText("tablones");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("tablones"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("travesaño cruje"); await closeDialogue(page);
  await stationGo("russian"); await expect(page.getByTestId("talk-prompt")).toContainText("ruso");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Ruso, marinero");
  for (let choice = 0; choice < 3; choice++) {
    for (let i = 0; i < 16 && !await page.getByTestId("dialogue-choice").count(); i++) { await page.keyboard.press("e"); await page.waitForTimeout(150); }
    await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await page.keyboard.press("1"); await page.waitForTimeout(150);
  }
  await closeDialogue(page); await probe(page, "go", "path");
  await expect(page.getByTestId("talk-prompt")).toContainText("Prepararse"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("falta conocer"); await closeDialogue(page);
  await expect(page.getByTestId("talk-prompt")).toContainText("Esperar la llegada"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Kurtz está aquí"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("reconoció mi libro"); await closeDialogue(page);
  expect((await probe(page, "inspect")).stage).toBe("anticipation");
});
for (const choice of [1, 2]) test(`Kurtz ${choice}: staged arrival, spatial exchange, memories and restores`, async ({ page }) => {
  test.setTimeout(150000); await begin(page, choice === 1 ? "listen" : "question");
  await expect.poll(async () => (await probe(page, "inspect")).ready).toBe(true);
  const before = await probe(page, "save");
  await probe(page, "go", "away"); const p = (await probe(page, "inspect")).player;
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await probe(page, "inspect")).player.x).toBeGreaterThan(p.x + 15); }
  finally { await page.keyboard.up("d"); }
  await probe(page, "advanceTo", 33000);
  await expect.poll(async () => (await probe(page, "inspect")).stage).toBe("silhouette");
  await expect.poll(async () => (await probe(page, "inspect")).visible).toBe(true);
  await expect.poll(async () => (await probe(page, "inspect")).sources.filter((s: { id: string }) => /forest|distant-water/.test(s.id))
    .every((s: { volume: number }) => s.volume < .005)).toBe(true);
  await probe(page, "advanceTo", 39000); const partial = await probe(page, "save");
  await probe(page, "advanceTo", 52000); await probe(page, "restore", partial.data);
  expect((await probe(page, "inspect")).stage).toBe("partial");
  await probe(page, "restore", before.data); expect((await probe(page, "inspect")).stage).toBe("anticipation");
  await probe(page, "advanceTo", 52000); await probe(page, "go", "kurtz");
  await expect(page.getByTestId("talk-prompt")).toContainText("Hablar con Kurtz");
  const arrived = await probe(page, "save"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Marlow"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); const atChoice = await probe(page, "save");
  await page.keyboard.press(String(choice));
  await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "sabe escuchar" : "Apenas ha llegado");
  const chosen = await probe(page, "save");
  expect((await probe(page, "inspect")).response).toBe(choice === 1 ? "listen" : "challenge");
  expect((await probe(page, "inspect")).pose).toBe(choice === 1 ? "intense" : "commanding");
  await probe(page, "restore", atChoice.data); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await probe(page, "restore", chosen.data); await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "sabe escuchar" : "Apenas ha llegado");
  expect((await probe(page, "inspect")).labels).toHaveLength(2); // parent + selected child, never duplicated parent
  await closeDialogue(page); await probe(page, "go", "russian");
  await expect(page.getByTestId("talk-prompt")).toContainText("ruso"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(choice === 1 ? "Ahora ha oído su voz" : "Antes dudaba de mi fe");
  await closeDialogue(page);
  for (const [id, line] of [["bindings", "Las lianas"], ["witnesses", "Nadie habló"], ["threshold", "umbral"]]) {
    await probe(page, "go", id); await expect(page.getByTestId("talk-prompt")).toContainText(id === "threshold" ? "Mirar" : "Observar");
    if (id === "threshold") await expect(page.getByTestId("talk-prompt")).toContainText("umbral");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(id === "threshold" ? "La hierba" : line);
    await closeDialogue(page);
  }
  expect((await probe(page, "inspect")).observed).toHaveLength(3);
  await probe(page, "restore", arrived.data);
  expect((await probe(page, "inspect")).stage).toBe("present"); expect((await probe(page, "inspect")).response).toBeUndefined();
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await expect.poll(async () => (await probe(page, "inspect")).renderedPosition).toEqual((await probe(page, "inspect")).position);
  expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
  expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
});

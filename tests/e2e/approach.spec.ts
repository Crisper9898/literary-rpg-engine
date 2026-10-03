import { expect, test, type Page } from "@playwright/test";
const probe = (page: Page, method: string, value?: string | number) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/approachProbe.ts";
  return (await import(url))[method](value);
}, { method, value });
async function enter(page: Page, decision = "wait") {
  await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible();
  await probe(page, "prepareHut", decision);
  await expect(page.getByTestId("talk-prompt")).toContainText("Volver al vapor");
  await page.locator("canvas").focus(); await page.keyboard.press("e");
  await probe(page, "nearHelm");
  await expect(page.getByTestId("talk-prompt")).toContainText("Reanudar el viaje");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(decision === "wait" ? "Esperamos la luz" : "sonda preparada");
  await expect.poll(async () => (await probe(page, "inspect")).loadedArt).toBe(true);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
  await page.keyboard.press("e"); await expect.poll(async () => (await probe(page, "inspect")).atHelm).toBe(true);
}
async function beat(page: Page, progress: number, line: string) {
  await probe(page, "travelTo", progress);
  await expect(page.getByTestId("dialogue-text")).toContainText(line);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
}
for (const decision of ["wait", "proceed"]) {
  test(`fog and attack ${decision}: navigation, cues, helmsman, whistle and all restore phases`, async ({ page }) => {
    test.setTimeout(120_000); await enter(page, decision);
    const beginning = await probe(page, "inspect");
    expect(beginning.profile.initialMist).toBe(decision === "wait" ? .22 : .43);
    const position = beginning.position;
    await page.keyboard.down("d"); await page.keyboard.down("w");
    try { await expect.poll(async () => (await probe(page, "inspect")).navigation.lateral).toBeGreaterThan(.025); }
    finally { await page.keyboard.up("d"); await page.keyboard.up("w"); }
    expect((await probe(page, "inspect")).position).toEqual(position);
    await page.keyboard.press("e"); // Leave helm for exact stopped canonical checkpoints.
    await expect.poll(async () => (await probe(page, "inspect")).atHelm).toBe(false);
    await beat(page, .12, "babor");
    await expect.poll(async () => (await probe(page, "inspect")).sources.find((c: { alias: string }) => c.alias === "journey-approach:left:channel")?.volume).toBeGreaterThan(0);
    await beat(page, .3, "estribor");
    const before = await probe(page, "save"), original = await probe(page, "inspect");
    await beat(page, .49, "Flechas");
    const attack = await probe(page, "save"), attacking = await probe(page, "inspect");
    await probe(page, "restore", before);
    expect((await probe(page, "inspect")).navigation).toEqual(original.navigation);
    expect((await probe(page, "inspect")).position).toEqual(original.position);
    expect((await probe(page, "inspect")).decision).toBe(decision);
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await probe(page, "restore", attack);
    expect((await probe(page, "inspect")).navigation).toEqual(attacking.navigation);
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await probe(page, "travelTo", .67);
    await expect(page.getByTestId("dialogue-text")).toContainText("cae junto a la rueda");
    expect((await probe(page, "inspect")).fate).toBe("lost");
    expect((await probe(page, "inspect")).atHelm).toBe(false);
    const fallen = await probe(page, "save");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("juntos");
    await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await probe(page, "restore", fallen);
    await expect(page.getByTestId("dialogue-text")).toContainText("cae junto a la rueda");
    expect((await probe(page, "inspect")).labels).toHaveLength(1);
    await page.keyboard.press("e"); await page.keyboard.press("e");
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await expect.poll(async () => (await probe(page, "inspect")).navigation.interruptionMS, { timeout: 15000 }).toBe(0);
    await page.keyboard.press("e");
    await expect.poll(async () => (await probe(page, "inspect")).atHelm).toBe(true);
    await probe(page, "travelTo", .86);
    await expect(page.getByTestId("navigation-status")).toContainText("sirena");
    expect((await probe(page, "inspect")).navigation.progress).toBe(.86);
    await page.keyboard.press("Space");
    await expect.poll(async () => (await probe(page, "inspect")).navigation.whistle).toBe(true);
    await beat(page, 1, "Estación Interior");
    await page.keyboard.press("e"); // Cannot replay an ended episode or enter another scene.
    const after = await probe(page, "save");
    await probe(page, "restore", before);
    expect((await probe(page, "inspect")).fate).toBe("alive");
    await probe(page, "restore", after);
    expect((await probe(page, "inspect")).navigation.progress).toBe(1);
    expect((await probe(page, "inspect")).fate).toBe("lost");
    expect((await probe(page, "inspect")).seen).toHaveLength(6);
    await expect(page.getByTestId("dialogue-panel")).toBeHidden();
    await expect(page.locator(".journey-conversation")).toHaveCount(1);
    expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count <= 1)).toBe(true);
    await probe(page, "restart");
    await expect.poll(async () => (await probe(page, "inspect")).navigation).toBeUndefined();
    expect((await probe(page, "inspect")).sources.every((s: { count: number }) => s.count === 0)).toBe(true);
    expect(await page.evaluate(() => window.pixiVN.errors)).toEqual([]);
  });
}
test("off-helm walking, actual obstacle contact and the spatial checkpoint remain independent", async ({ page }) => {
  test.setTimeout(90000); await enter(page);
  await page.keyboard.press("e");
  await expect.poll(async () => (await probe(page, "inspect")).atHelm).toBe(false);
  const initial = await probe(page, "inspect");
  await page.keyboard.down("d");
  try { await expect.poll(async () => (await probe(page, "inspect")).position.x).toBeGreaterThan(initial.position.x + 25); }
  finally { await page.keyboard.up("d"); }
  const saved = await probe(page, "save"), position = (await probe(page, "inspect")).position;
  await probe(page, "moveAway");
  await expect.poll(async () => (await probe(page, "inspect")).position.x).toBe(1400);
  const restored = await probe(page, "restore", saved); expect(restored.position).toEqual(position);
  await beat(page, .12, "babor");
  await probe(page, "alignChannel", -.24);
  await probe(page, "travelTo", .191);
  await expect(page.getByTestId("navigation-status")).toContainText("Contacto");
  expect((await probe(page, "inspect")).navigation.contacts).toEqual(["driftwood"]);
  const contact = await probe(page, "save");
  await probe(page, "travelTo", .3); await expect(page.getByTestId("dialogue-text")).toContainText("estribor");
  await probe(page, "restore", contact);
  expect((await probe(page, "inspect")).navigation.contacts).toEqual(["driftwood"]);
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
});

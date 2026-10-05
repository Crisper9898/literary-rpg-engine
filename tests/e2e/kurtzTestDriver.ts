import { expect, type Page } from "@playwright/test";
export const probe = (page: Page, method: string, value?: string | number) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/kurtzProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function boot(page: Page) { await page.goto("/"); await expect(page.getByTestId("talk-prompt")).toBeVisible(); }
export async function closeDialogue(page: Page) {
  for (let i = 0; i < 6 && await page.getByTestId("dialogue-panel").isVisible(); i++) {
    await page.keyboard.press("e"); await page.waitForTimeout(150);
  }
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
}
export async function begin(page: Page, stance = "listen") {
  await boot(page); await probe(page, "seed", stance); await page.locator("canvas").focus();
  await expect(page.getByTestId("talk-prompt")).toContainText("Esperar la llegada"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(stance === "question" ? "No le pido que me crea" : "Me escuchó hablar");
  await closeDialogue(page); await expect.poll(async () => (await probe(page, "inspect")).stage).toBe("anticipation");
}

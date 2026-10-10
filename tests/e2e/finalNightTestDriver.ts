import { expect, type Page } from "@playwright/test";
import { prepare as prepareBreakdown, close } from "./breakdownTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/finalNightProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, papers = "sealed") {
  await prepareBreakdown(page); await probe(page, "completeBreakdown", papers);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "entry", "última noche"); await expect(page.getByTestId("dialogue-text")).toContainText("Cae la tarde");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function vigil(page: Page) {
  await interact(page, "candle", "Tomar una vela"); await close(page);
  const held = await probe(page, "save");
  await interact(page, "patient", "Acercar la vela"); await expect(page.getByTestId("dialogue-text")).toContainText("esperando la muerte");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  return held;
}
export async function words(page: Page) {
  await interact(page, "patient", "Quedarte a escuchar"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toHaveText("¡El horror! ¡El horror!");
}
export async function depart(page: Page) { await interact(page, "patient", "Apagar la vela"); await close(page); }
export async function announce(page: Page) {
  await interact(page, "crew", "tripulación"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText("Kurtz ha muerto");
}

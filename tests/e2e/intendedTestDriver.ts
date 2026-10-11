import { expect, type Page } from "@playwright/test";
import { prepare as prepareLegacy, close } from "./legacyTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/intendedProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, response = "music") {
  await prepareLegacy(page); await probe(page, "completeLegacy", response);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "door", "Visitar a la Prometida");
  await expect(page.getByTestId("dialogue-text")).toContainText("más de un año");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function choices(page: Page) {
  await interact(page, "intended", "Escuchar a la Prometida"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}

import { expect, type Page } from "@playwright/test";
export { closeDialogue as close } from "./kurtzTestDriver";
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/prologueProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function boot(page: Page) {
  await page.goto("/?story=journey&episode=prologue");
  await expect(page.getByTestId("dialogue-text")).toContainText("Nellie está fondeada");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}

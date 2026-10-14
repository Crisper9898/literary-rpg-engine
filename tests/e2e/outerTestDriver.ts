import { expect, type Page } from "@playwright/test";
export { closeDialogue as close } from "./kurtzTestDriver";
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/outerProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function boot(page: Page) {
  await page.goto("/?story=journey&episode=outer-station");
  await expect(page.getByTestId("dialogue-text")).toContainText("Partí en un vapor francés");
  await expect.poll(async () => { const s = await probe(page, "inspect"); return s.artReady && s.forestReady; }).toBe(true);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}

import { expect, type Page } from "@playwright/test";
export { closeDialogue as close } from "./kurtzTestDriver";
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/centralProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function boot(page: Page) {
  await page.goto("/?story=journey&episode=central-station");
  await expect(page.getByTestId("dialogue-text")).toContainText("sesenta porteadores");
  await expect.poll(async () => { const state = await probe(page, "inspect"); return state.artReady && state.forestReady; }).toBe(true);
}
export async function interact(page: Page, point: string, prompt: string) {
  const position = await probe(page, "go", point);
  await expect.poll(async () => (await probe(page, "inspect")).player).toEqual(position);
  await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
  // A scene-changing label can mount a panel before its awaited reconstruction
  // writes the line. Save only after the actual narrative step is ready.
  await expect(page.getByTestId("dialogue-text")).toHaveText(/\S/);
}

import { expect, type Page } from "@playwright/test";
import { prepare as prepareIntended, close } from "./intendedTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/thamesProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, approach = "witness") {
  await prepareIntended(page); await probe(page, "completeIntended", approach);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "entry", "Regresar al relato en el Támesis");
  await expect(page.getByTestId("dialogue-text")).toContainText("Nellie");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}

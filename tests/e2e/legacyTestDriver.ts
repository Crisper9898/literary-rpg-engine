import { expect, type Page } from "@playwright/test";
import { prepare as prepareEurope, close } from "./europeTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/legacyProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, response = "private") {
  await prepareEurope(page); await probe(page, "completeEurope", response);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "door", "Recibir al primo"); await expect(page.getByTestId("dialogue-text")).toContainText("Dos días después");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function cousinChoice(page: Page) {
  await interact(page, "door", "Preguntar al primo"); await expect(page.getByTestId("dialogue-text")).toContainText("gran músico");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}
export async function handFamily(page: Page) {
  await interact(page, "family", "Recoger las cartas familiares"); await close(page);
  await interact(page, "door", "Entregar las cartas al primo"); await close(page);
}
export async function journalistChoice(page: Page) {
  await interact(page, "door", "Escuchar al periodista"); await expect(page.getByTestId("dialogue-text")).toContainText("política popular");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}

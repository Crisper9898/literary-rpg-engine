import { expect, type Page } from "@playwright/test";
import { prepare as prepareNight, close } from "./evacuationTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/departureProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, priority = "patient") {
  await prepareNight(page, priority === "patient" ? 1 : 2); await probe(page, "completeEvacuation", priority);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function board(page: Page) {
  await interact(page, "board", "Embarcar"); await expect(page.getByTestId("dialogue-text")).toContainText("Es mediodía");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function release(page: Page) { await interact(page, "mooring", "Soltar"); await close(page); }
export async function decision(page: Page) {
  await interact(page, "whistle", "Decidir"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}

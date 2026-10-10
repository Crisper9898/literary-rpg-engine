import { expect, type Page } from "@playwright/test";
import { prepare as prepareDeparture, close } from "./departureTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/breakdownProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, response = "whistle") {
  await prepareDeparture(page); await probe(page, "completeDeparture", response);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "entry", "Continuar río abajo"); await expect(page.getByTestId("dialogue-text")).toContainText("Río abajo");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function halt(page: Page) {
  await expect(page.getByTestId("dialogue-text")).toContainText("Se acabó el golpe", { timeout: 50000 }); await close(page);
  expect((await probe(page, "inspect")).state.phase).toBe("stopped");
}
export async function papers(page: Page) {
  await interact(page, "patient", "confiarte"); await expect(page.getByTestId("dialogue-text")).toContainText("papeles y la fotografía");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}
export async function repair(page: Page) {
  await interact(page, "engine", "Examinar"); await close(page); await interact(page, "forge", "Avivar"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).state.repairProgress, { timeout: 30000 }).toBe(1);
  await interact(page, "engine", "montar"); await close(page);
}

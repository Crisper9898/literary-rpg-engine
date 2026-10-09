import { expect, type Page } from "@playwright/test";
import { reveal, close } from "./nightEscapeTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/evacuationProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, choice = 1) {
  await reveal(page, choice); await probe(page, "completeNight", choice === 1 ? "reason" : "challenge");
}
export async function interact(page: Page, id: string, prompt: string) {
  await probe(page, "go", id); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "start", "amanecer"); await expect(page.getByTestId("dialogue-text")).toContainText("mañana no trae alivio");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
  await probe(page, "finishMorning");
  await expect.poll(async () => (await probe(page, "inspect")).state.phase, { timeout: 25000 }).toBe("preparing");
}
export async function examine(page: Page) {
  await interact(page, "patient", "cómo está"); await expect(page.getByTestId("dialogue-text")).toContainText("tos le dobla");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(
    (await probe(page, "inspect")).previous === "reason" ? "Me habló de mañana" : "Me impidió volver"); await close(page);
}
export async function decision(page: Page) {
  await interact(page, "priority", "primero"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}
export async function secure(page: Page) {
  await interact(page, "bindings", "ligaduras"); await close(page);
  await interact(page, "landing", "tablones"); await close(page);
}
export async function transfer(page: Page) {
  await interact(page, "patient", "alzar"); await close(page);
}
export async function guide(page: Page) {
  for (let i = 0; i < 12 && (await probe(page, "inspect")).state.cot.x > 618; i++) {
    const x = (await probe(page, "inspect")).state.cot.x;
    await probe(page, "go", "ahead");
    await expect.poll(async () => (await probe(page, "inspect")).state.cot.x, { timeout: 12000 }).toBeLessThan(Math.max(618, x - 65));
  }
  await interact(page, "landing", "Recibir");
}

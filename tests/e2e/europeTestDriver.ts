import { expect, type Page } from "@playwright/test";
import { prepare as prepareAftermath, close } from "./aftermathTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/europeProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, care = "help", papers = "sealed") {
  await prepareAftermath(page, "listen", papers); await probe(page, "completeAftermath", care);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "entry", "Regresar a Europa"); await expect(page.getByTestId("dialogue-text")).toContainText("ciudad europea");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText(
    (await probe(page, "inspect")).care === "help" ? "mano del marinero" : "por mi cuenta"); await close(page);
}
export async function sort(page: Page) {
  await interact(page, "packet", "Abrir el paquete"); await expect(page.getByTestId("dialogue-text")).toContainText(
    (await probe(page, "inspect")).papersResponse === "sealed" ? "cordón" : "fotografía"); await close(page);
  await interact(page, "report", "Examinar el informe"); await close(page);
  await interact(page, "letters", "Separar las cartas"); await close(page);
  await interact(page, "report", "Preparar el informe"); await close(page);
}
export async function choice(page: Page) {
  await interact(page, "door", "Responder al funcionario"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}

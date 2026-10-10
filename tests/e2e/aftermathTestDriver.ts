import { expect, type Page } from "@playwright/test";
import { prepare as prepareFinalNight, close } from "./finalNightTestDriver";
export { close };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/aftermathProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function prepare(page: Page, vigil = "listen", papers = "ask") {
  await prepareFinalNight(page, papers); await probe(page, "completeFinalNight", vigil);
}
export async function interact(page: Page, point: string, prompt: string) {
  await probe(page, "go", point); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function start(page: Page) {
  await interact(page, "entry", "Esperar el amanecer");
  await expect(page.getByTestId("dialogue-text")).toContainText("mañana");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function care(page: Page) {
  await interact(page, "burial", "Escuchar la noticia del entierro"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText((await probe(page, "inspect")).vigil === "reassure" ? "yo seguía allí" : "silencio");
  await close(page); await interact(page, "papers", "Resguardar los papeles");
  await expect(page.getByTestId("dialogue-text")).toContainText((await probe(page, "inspect")).papersResponse === "ask" ? "fotografía" : "cordón");
  await close(page);
  await interact(page, "care", "Buscar apoyo en la barandilla"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
}
export async function recover(page: Page) {
  await interact(page, "shelter", "Resguardarte junto a la caseta"); await close(page);
  await interact(page, "recovery", "Volver a mirar la corriente");
}

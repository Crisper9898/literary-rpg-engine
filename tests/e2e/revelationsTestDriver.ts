import { expect, type Page } from "@playwright/test";
import { begin, probe as kurtzProbe, closeDialogue } from "./kurtzTestDriver";
export { closeDialogue };
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/revelationsProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function enter(page: Page, response = 1) {
  await begin(page, response === 1 ? "listen" : "question"); await kurtzProbe(page, "advanceTo", 52000);
  await kurtzProbe(page, "go", "kurtz"); await expect(page.getByTestId("talk-prompt")).toContainText("Hablar con Kurtz");
  expect((await probe(page, "inspect")).available).toBe(false);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("Marlow");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await page.keyboard.press(String(response)); await closeDialogue(page);
  await expect.poll(async () => (await probe(page, "inspect")).props.every((p: { visible: boolean; ready: boolean }) => p.visible && p.ready)).toBe(true);
  await page.locator("canvas").focus();
}
export async function investigate(page: Page, id: string) {
  await probe(page, "go", id);
  await expect(page.getByTestId("talk-prompt")).toContainText(id === "ivory" ? "marfil" : id === "palisade" ? "empalizada" : id === "report" ? "informe" : "reunión");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
  await closeDialogue(page);
  await expect.poll(async () => (await probe(page, "inspect")).discoveries).toContain(id);
}

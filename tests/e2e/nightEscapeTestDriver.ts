import { expect, type Page } from "@playwright/test";
import { enter, investigate, probe as revelations } from "./revelationsTestDriver";
export const probe = (page: Page, method: string, value?: string) => page.evaluate(async ({ method, value }) => {
  const url = "/tests/e2e/nightEscapeProbe.ts"; return (await import(url))[method](value);
}, { method, value });
export async function close(page: Page) {
  for (let i = 0; i < 10 && await page.getByTestId("dialogue-panel").isVisible(); i++) {
    expect(await page.getByTestId("dialogue-choice").count()).toBe(0);
    await page.keyboard.press("e"); await page.waitForTimeout(150);
  }
  await expect(page.getByTestId("dialogue-panel")).toBeHidden();
}
export async function reveal(page: Page, choice = 1) {
  await enter(page, choice); await investigate(page, "ivory"); await investigate(page, "palisade");
  await revelations(page, "go", "russian"); await expect(page.getByTestId("talk-prompt")).toContainText("ruso");
  await page.keyboard.press("e"); await page.keyboard.press("e"); await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2); await page.keyboard.press(String(choice)); await close(page);
}
export async function start(page: Page) {
  await probe(page, "go", "vigil"); await expect(page.getByTestId("talk-prompt")).toContainText("guardia");
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-text")).toContainText("pierde su última luz");
  await expect.poll(async () => (await probe(page, "inspect")).artReady).toBe(true); await close(page);
}
export async function darken(page: Page) {
  await probe(page, "finishDusk"); await expect.poll(async () => (await probe(page, "inspect")).state.phase, { timeout: 20000 }).toBe("search");
}
export async function examine(page: Page, id: string, prompt: string) {
  await probe(page, "go", id); await expect(page.getByTestId("talk-prompt")).toContainText(prompt);
  await page.keyboard.press("e"); await expect(page.getByTestId("dialogue-panel")).toBeVisible();
}
export async function track(page: Page) {
  await examine(page, "bed", "vacío"); await close(page);
  for (const [id, prompt] of [["grass", "hierba"], ["prints", "barro"], ["branches", "ramas"]]) {
    await examine(page, id, prompt); await close(page);
  }
  await examine(page, "exit", "Cruzar"); await close(page);
  await expect.poll(async () => (await probe(page, "inspect")).forest, { timeout: 20000 }).toBeGreaterThan(.95);
}
export async function confront(page: Page) {
  await examine(page, "kurtz", "sin alzar");
  const memory = await probe(page, "inspect");
  await expect(page.getByTestId("dialogue-text")).toContainText(memory.previousChoice === "brutality" ? "La mano que vi mandar" : "Lo encuentro");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-text")).toContainText(memory.firstResponse === "challenge" ? "Otra vez usted" : "planes inmensos");
  await page.keyboard.press("e");
  await expect(page.getByTestId("dialogue-choice")).toHaveCount(2);
  await expect.poll(async () => (await probe(page, "inspect")).sources.find((source: { id: string }) =>
    source.id === "journey-kurtz-night:canopy:channel")?.volume).toBe(0);
}
/** Small checkpoint approaches keep the escort close; movement/stop is separately asserted with actual keys. */
export async function escort(page: Page) {
  for (let i = 0; i < 8 && (await probe(page, "inspect")).state.escort.x < 1560; i++) {
    const x = (await probe(page, "inspect")).state.escort.x;
    await probe(page, "go", "beside");
    await expect.poll(async () => (await probe(page, "inspect")).state.escort.x, { timeout: 12000 }).toBeGreaterThan(Math.min(1560, x + 65));
  }
  await examine(page, "exit", "Volver con Kurtz");
}

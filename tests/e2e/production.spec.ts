import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://127.0.0.1:4173" });

for (const [url, scene, excluded] of [["/", "journeyDeck-", "showRoom-"],
  ["/?story=metamorphosis", "showRoom-", "journeyDeck-"]] as const) {
  test(`production boots ${scene} without loading the other scene`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors: string[] = [], scripts: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => { if (request.resourceType() === "script") scripts.push(request.url()); });
    await page.goto(url);
    await expect(page.locator("#root canvas")).toHaveCount(1);
    await expect(page.getByTestId(scene === "journeyDeck-" ? "talk-prompt" : "metamorphosis-prompt"))
      .toBeVisible({ timeout: 30_000 });
    expect(scripts.some((file) => file.includes(scene))).toBe(true);
    expect(scripts.some((file) => file.includes(excluded))).toBe(false);
    expect(errors).toEqual([]);
  });
}

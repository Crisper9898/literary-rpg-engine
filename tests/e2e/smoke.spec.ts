import { expect, test } from "@playwright/test";

test("boots the PixiVN canvas", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#root canvas")).toHaveCount(1);
});

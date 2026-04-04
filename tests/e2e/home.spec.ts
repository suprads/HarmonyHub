import { test, expect } from "@playwright/test";

test("Home page is successfully navigated to", async ({ page }) => {
  await page.goto("");

  await expect(page.getByRole("heading", { name: /Home/ })).toBeVisible();
});

import { expect, test } from "@playwright/test";

const liveEnabled = process.env.E2E_LIVE === "1";

test.describe("Component Builder live API", () => {
  test.skip(!liveEnabled, "Set E2E_LIVE=1 to run against the real Cursor API");

  test("generates a component through the real backend", async ({ page }) => {
    test.setTimeout(180_000);

    await page.goto("/");

    await page.getByTestId("chat-input").fill("a simple primary button labeled Click me");
    await page.getByTestId("generate-button").click();

    await expect(page.getByTestId("preview-loading")).toBeVisible();
    await expect(page.getByTestId("preview-loading")).toBeHidden({
      timeout: 120_000,
    });

    await expect(
      page.getByText("Component generated successfully"),
    ).toBeVisible();

    await expect(page.getByTestId("live-preview")).toBeVisible();
    await expect(
      page.frameLocator('[data-testid="live-preview"] iframe').first().locator("body"),
    ).not.toBeEmpty({ timeout: 30_000 });

    await page.getByTestId("code-tab").click();
    await expect(page.getByText("export default function Component")).toBeVisible();
  });
});

import { expect, test } from "@playwright/test";

import { MOCK_GENERATE_RESPONSE } from "./fixtures/mock-component";

test.describe("Component Builder E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/generate", async (route) => {
      const body = route.request().postDataJSON() as { prompt?: string };

      await new Promise((resolve) => setTimeout(resolve, 800));

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...MOCK_GENERATE_RESPONSE,
          prompt: body.prompt,
        }),
      });
    });
  });

  test("loads the app with chat and empty preview panel", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Component Builder" })).toBeVisible();
    await expect(page.getByTestId("chat-panel")).toBeVisible();
    await expect(page.getByTestId("preview-panel")).toBeVisible();
    await expect(page.getByTestId("preview-empty-state")).toBeVisible();
    await expect(page.getByText("Try an example")).toBeVisible();
    await expect(page.getByTestId("chat-input")).toBeVisible();
    await expect(page.getByTestId("generate-button")).toBeDisabled();
  });

  test("fills prompt from suggestion chips", async ({ page }) => {
    await page.goto("/");

    await page
      .getByRole("button", {
        name: "A login form with email, password, and social buttons",
      })
      .click();

    await expect(page.getByTestId("chat-input")).toHaveValue(
      "A login form with email, password, and social buttons",
    );
    await expect(page.getByTestId("generate-button")).toBeEnabled();
  });

  test("generates component and shows live preview", async ({ page }) => {
    await page.goto("/");

    const prompt = "create an interactive login component";
    await page.getByTestId("chat-input").fill(prompt);
    await page.getByTestId("generate-button").click();

    await expect(page.getByTestId("preview-loading")).toBeVisible();
    await expect(page.getByText(prompt)).toBeVisible();

    await expect(page.getByTestId("preview-loading")).toBeHidden();
    await expect(
      page.getByText(
        "Component generated successfully. Check the live preview on the right, or switch to Code view to copy the source.",
      ),
    ).toBeVisible();

    await expect(page.getByTestId("preview-empty-state")).toBeHidden();
    await expect(page.getByTestId("live-preview")).toBeVisible();

    const previewFrame = page
      .frameLocator('[data-testid="live-preview"] iframe')
      .first();
    await expect(previewFrame.getByText("Sign in")).toBeVisible({
      timeout: 30_000,
    });
    await expect(previewFrame.getByPlaceholder("Email")).toBeVisible();
    await expect(previewFrame.getByRole("button", { name: "Log in" })).toBeVisible();
  });

  test("switches to code view and copies generated source", async ({ page }) => {
    await page.goto("/");

    await page
      .getByTestId("chat-input")
      .fill("create an interactive login component");
    await page.getByTestId("generate-button").click();

    await expect(page.getByTestId("live-preview")).toBeVisible({
      timeout: 30_000,
    });

    await page.getByTestId("code-tab").click();
    await expect(page.getByTestId("code-viewer")).toBeVisible();
    await expect(page.getByTestId("live-preview")).toBeHidden();
    await expect(page.getByText("export default function Component")).toBeVisible();

    await page.getByTestId("copy-code-button").click();
    await expect(page.getByTestId("copy-code-button")).toContainText("Copied");

    const clipboardText = await page.evaluate(async () =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toContain("export default function Component");
    expect(clipboardText).toContain("Sign in");
  });

  test("supports Enter key to submit prompt", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("chat-input").fill("a simple blue button");
    await page.getByTestId("chat-input").press("Enter");

    await expect(page.getByTestId("preview-loading")).toBeVisible();
    await expect(page.getByTestId("live-preview")).toBeVisible({
      timeout: 30_000,
    });
  });

  test("toggles back to preview from code view", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("chat-input").fill("a stats widget");
    await page.getByTestId("generate-button").click();

    await expect(page.getByTestId("live-preview")).toBeVisible({
      timeout: 30_000,
    });

    await page.getByTestId("code-tab").click();
    await expect(page.getByTestId("code-viewer")).toBeVisible();

    await page.getByTestId("preview-tab").click();
    await expect(page.getByTestId("live-preview")).toBeVisible();
    await expect(page.getByTestId("code-viewer")).toBeHidden();
  });
});

test.describe("Component Builder error handling", () => {
  test("shows API error in chat when generation fails", async ({ page }) => {
    await page.route("**/api/generate", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Could not reach Cursor cloud. Check your internet connection and try again.",
          retryable: true,
        }),
      });
    });

    await page.goto("/");
    await page.getByTestId("chat-input").fill("a pricing card");
    await page.getByTestId("generate-button").click();

    await expect(
      page.getByText(
        "Could not reach Cursor cloud. Check your internet connection and try again.",
      ),
    ).toBeVisible();
    await expect(page.getByTestId("preview-empty-state")).toBeVisible();
  });
});

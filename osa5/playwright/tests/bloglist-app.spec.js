const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Bloglist app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Keke Godberg",
        username: "keke",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    const header = await page.getByText("Log in to application");
    const username = await page.getByTestId("username-input");
    const password = await page.getByTestId("password-input");

    await expect(header).toBeVisible();
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
  });
});

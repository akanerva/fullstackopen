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

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      const username = await page.getByTestId("username-input");
      const password = await page.getByTestId("password-input");

      await username.fill("keke");
      await password.fill("salainen");

      await page.getByText("login").click();
      await expect(page.getByText("Keke Godberg logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      const username = await page.getByTestId("username-input");
      const password = await page.getByTestId("password-input");

      await username.fill("jaska");
      await password.fill("avonainen");

      await page.getByText("login").click();
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });
});

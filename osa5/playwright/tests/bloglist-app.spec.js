const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

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

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "keke", "salainen");
      await expect(page.getByText("Keke Godberg logged in")).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "muumilaakson tarinat", "muumipappa", "kek");

      // looks for exact matches
      await expect(
        page.getByText("a new blog muumilaakson tarinat added")
      ).toBeVisible();
      await expect(page.getByText("muumilaakson tarinat")).toBeVisible();
      await expect(page.getByRole("button", { name: "view" })).toBeVisible();

      await expect(
        page.getByRole("button", { name: "create blog" })
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "muumilaakson tarinat", "muumipappa", "kek");

      await page.getByRole("button", { name: "view" }).click();

      await expect(page.getByText("likes 0")).toBeVisible();
      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("a blog can be removed", async ({ page }) => {
      await createBlog(page, "muumilaakson tarinat", "muumipappa", "kek");

      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "remove" }).click();

      page.on("dialog", (dialog) => dialog.appect());
      await expect(
        page.getByRole("button", { name: "view" })
      ).not.toBeVisible();
    });
  });
});

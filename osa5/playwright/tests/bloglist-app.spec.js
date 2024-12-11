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

      page.on("dialog", (dialog) => dialog.accept());
      await expect(
        page.getByRole("button", { name: "view" })
      ).not.toBeVisible();
    });

    test("blog is removable only by user who added it", async ({
      page,
      request,
    }) => {
      await createBlog(page, "muumilaakson tarinat", "muumipappa", "kek");

      await page.getByRole("button", { name: "view" }).click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Lohilaakson Tom",
          username: "tom",
          password: "siikret",
        },
      });
      await loginWith(page, "tom", "siikret");

      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });
  });

  // blogs are added via http requests because it is away easier to set likes that way
  test("blogs are sorted by amount of likes", async ({ page, request }) => {
    await loginWith(page, "keke", "salainen");
    await expect(page.getByText("Keke Godberg logged in")).toBeVisible();
    const user = await page.evaluate(
      "localStorage.getItem('loggedBloglistUser')"
    );
    const token = JSON.parse(user).token;
    await request.post("http://localhost:3003/api/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: "on tämä työmaa",
        author: "röi ukko",
        url: "asdf",
        likes: 3,
        user: "asdf",
      },
    });
    await request.post("http://localhost:3003/api/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: "jumppa piristää päivääsi",
        author: "jumppapirkko",
        url: "qwerty",
        likes: 10,
        user: "asdf",
      },
    });
    await request.post("http://localhost:3003/api/blogs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: "jo on kissanpäivät",
        author: "tiger king",
        url: "jkjkjk",
        likes: 5,
        user: "asdf",
      },
    });

    await page.reload();

    // the view button disappears after pressing it so this will get them all
    await page.getByRole("button", { name: "view" }).first().click();
    await page.getByRole("button", { name: "view" }).first().click();
    await page.getByRole("button", { name: "view" }).first().click();

    const likes = await page.getByText(/likes/).all();

    // looking for subtext because the div also contains a button
    await expect(likes[0]).toHaveText(/likes 10/);
    await expect(likes[1]).toHaveText(/likes 5/);
    await expect(likes[2]).toHaveText(/likes 3/);
  });
});

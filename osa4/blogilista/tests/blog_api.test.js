const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const lodash = require("lodash");

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

describe("GET /api/blogs", () => {
  test("returns correct amount of JSON objects", async () => {
    const result = await api.get("/api/blogs");
    assert.strictEqual(result.body.length, 6);
  });

  test("blog object includes attribute id instead of _id", async () => {
    const result = await api.get("/api/blogs");
    assert.strictEqual(result.body[1].hasOwnProperty("id"), true);
    assert.notStrictEqual(result.body[1].hasOwnProperty("_id"), true);
  });
});

describe("POST /api/blogs", () => {
  test("actually adds blog to database", async () => {
    const result = await api.get("/api/blogs");
    const blogExample = { title: "x", author: "y", url: "z", likes: 1 };
    await api.post("/api/blogs").send(blogExample);
    const newResult = await api.get("/api/blogs");
    assert.strictEqual(result.body.length + 1, newResult.body.length);
  });

  test("omitted likes defaults to 0", async () => {
    const blog = { title: "example", author: "tester", url: "e" };
    await api.post("/api/blogs").send(blog);
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(lodash.find(blogs.body, blog).likes, 0);
  });
});

describe("DELETE /api/blogs", () => {
  test("actually deletes a blog", async () => {
    const result = await api.get("/api/blogs");
    const blogToRemove = result.body[0];
    const id = blogToRemove.id;
    await api.delete(`/api/blogs/${id}`);
    const newResult = await api.get("/api/blogs");
    assert.strictEqual(result.body.length - 1, newResult.body.length);
    assert.notStrictEqual(
      lodash.find(newResult.body, blogToRemove),
      blogToRemove
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});

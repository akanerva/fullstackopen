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

  test("requires title in body", async () => {
    const blogsBefore = await api.get("/api/blogs");
    const blogWithoutTitle = { author: "tester", url: "e" };
    const postResult = await api.post("/api/blogs").send(blogWithoutTitle);
    const blogsAfter = await api.get("/api/blogs");
    assert.strictEqual(postResult.statusCode, 400);
    assert.strictEqual(blogsBefore.body.length, blogsAfter.body.length);
  });

  test("requires url in body", async () => {
    const blogsBefore = await api.get("/api/blogs");
    const blogWithoutUrl = { title: "example", author: "tester" };
    const postResult = await api.post("/api/blogs").send(blogWithoutUrl);
    const blogsAfter = await api.get("/api/blogs");
    assert.strictEqual(postResult.statusCode, 400);
    assert.strictEqual(blogsBefore.body.length, blogsAfter.body.length);
  });
});

describe("DELETE /api/blogs/:id", () => {
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

describe("PUT /api/blogs:id", () => {
  test("actually udpates a blog", async () => {
    const blogs = await api.get("/api/blogs");
    const idToUpdate = blogs.body[0].id;
    const newBlog = {
      title: "aybabtu",
      author: "tiatlg",
      url: "kek",
      likes: 5,
    };
    await api.put(`/api/blogs/${idToUpdate}`).send(newBlog);
    const updatedResult = await api.get(`/api/blogs/${idToUpdate}`);
    const newBlogWithId = {
      id: idToUpdate,
      ...newBlog,
    };
    assert.deepEqual(updatedResult.body, newBlogWithId);
  });
});

after(async () => {
  await mongoose.connection.close();
});

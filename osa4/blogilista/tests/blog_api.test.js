const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const lodash = require("lodash");

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const app = require("../app");
const bcrypt = require("bcrypt");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("asdf1234", 10);
  const user = new User({
    username: "root",
    name: "Richard",
    blogs: [],
    passwordHash: passwordHash,
  });

  await user.save();
});

beforeEach(async () => {
  await Blog.deleteMany({});
  const users = await User.find({});
  const user = users[0];
  const blogObjects = helper.initialBlogs.map(
    (blog) =>
      new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes ? blog.likes : 0,
        user: user._id,
      })
  );
  const blogPromiseArray = blogObjects.map((blog) => {
    blog.save();
    user.blogs = user.blogs.concat(blog._id);
  });
  await Promise.all(blogPromiseArray);
  await user.save();
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
    const loginResult = await api
      .post("/api/login")
      .send({ username: "root", password: "asdf1234" });
    const token = loginResult.body.token;
    const result = await api.get("/api/blogs");
    const blogExample = { title: "x", author: "y", url: "z", likes: 1 };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogExample);
    const newResult = await api.get("/api/blogs");
    assert.strictEqual(result.body.length + 1, newResult.body.length);
  });

  test("omitted likes defaults to 0", async () => {
    const loginResult = await api
      .post("/api/login")
      .send({ username: "root", password: "asdf1234" });
    const token = loginResult.body.token;
    const blog = { title: "example", author: "tester", url: "e" };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog);
    const blogs = await api.get("/api/blogs");
    assert.strictEqual(lodash.find(blogs.body, blog).likes, 0);
  });

  test("requires title in body", async () => {
    const loginResult = await api
      .post("/api/login")
      .send({ username: "root", password: "asdf1234" });
    const token = loginResult.body.token;
    const blogsBefore = await api.get("/api/blogs");
    const blogWithoutTitle = { author: "tester", url: "e" };
    const postResult = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutTitle);
    const blogsAfter = await api.get("/api/blogs");
    assert.strictEqual(postResult.statusCode, 400);
    assert.strictEqual(blogsBefore.body.length, blogsAfter.body.length);
  });

  test("requires url in body", async () => {
    const loginResult = await api
      .post("/api/login")
      .send({ username: "root", password: "asdf1234" });
    const token = loginResult.body.token;
    const blogsBefore = await api.get("/api/blogs");
    const blogWithoutUrl = { title: "example", author: "tester" };
    const postResult = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutUrl);
    const blogsAfter = await api.get("/api/blogs");
    assert.strictEqual(postResult.statusCode, 400);
    assert.strictEqual(blogsBefore.body.length, blogsAfter.body.length);
  });
  test("requires token in header", async () => {
    const blogExample = { title: "x", author: "y", url: "z", likes: 1 };
    const postResult = await api.post("/api/blogs").send(blogExample);
    assert.strictEqual(postResult.statusCode, 401);
  });
});

describe("DELETE /api/blogs/:id", () => {
  test("actually deletes a blog", async () => {
    const loginResult = await api
      .post("/api/login")
      .send({ username: "root", password: "asdf1234" });
    const token = loginResult.body.token;
    const result = await api.get("/api/blogs");
    const blogToRemove = result.body[0];
    const id = blogToRemove.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${token}`);
    const newResult = await api.get("/api/blogs");
    assert.strictEqual(result.body.length - 1, newResult.body.length);
    assert.notStrictEqual(
      lodash.find(newResult.body, blogToRemove),
      blogToRemove
    );
  });
});

describe("PUT /api/blogs:id", () => {
  test("actually updates a blog", async () => {
    const blogs = await api.get("/api/blogs");
    const idToUpdate = blogs.body[0].id;
    const newBlog = {
      title: "aybabtu",
      author: "tiatlg",
      url: "kek",
      likes: 5,
      user: ["674fe6feba604b74f8bb668a"],
    };
    await api.put(`/api/blogs/${idToUpdate}`).send(newBlog);
    const updatedResult = await api.get(`/api/blogs/${idToUpdate}`);
    const newBlogWithId = {
      id: idToUpdate,
      ...newBlog,
    };
    assert.deepEqual(updatedResult.body, newBlogWithId);
  });

  test("only changes likes with likes as only parameter, and returns full info", async () => {
    const blogs = await api.get("/api/blogs");
    const blogToUpdate = blogs.body[0];
    const idToUpdate = blogs.body[0].id;
    const newBlog = {
      likes: 45,
    };
    const response = await api.put(`/api/blogs/${idToUpdate}`).send(newBlog);
    const expectedBlog = { ...blogToUpdate, likes: newBlog.likes };
    console.log("expectedBlog: ", expectedBlog);
    assert.deepEqual(expectedBlog, response.body);
  });
});

after(async () => {
  await mongoose.connection.close();
});

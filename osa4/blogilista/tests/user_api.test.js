const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");

const lodash = require("lodash");

const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
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

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

describe("POST new user", () => {
  test("doesn't create duplicate users", async () => {
    const exampleUser = {
      username: "root",
      name: "Luke",
      password: "kaput123",
    };
    const result = await api.post("/api/users").send(exampleUser);
    assert.strictEqual(result.statusCode, 400);
  });
  test("username is required", async () => {
    const exampleUser = {
      name: "Luke",
      password: "kaput123",
    };
    const result = await api.post("/api/users").send(exampleUser);
    assert.strictEqual(result.statusCode, 400);
  });
  test("username length 2 fails", async () => {
    const exampleUser = {
      username: "ro",
      name: "Luke",
      password: "kaput123",
    };
    const result = await api.post("/api/users").send(exampleUser);
    assert.strictEqual(result.statusCode, 400);
  });
  test("password is required", async () => {
    const exampleUser = {
      username: "fusrodah",
      name: "Luke",
    };
    const result = await api.post("/api/users").send(exampleUser);
    assert.strictEqual(result.statusCode, 400);
  });
  test("password length 2 fails", async () => {
    const exampleUser = {
      username: "roope",
      name: "Luke",
      password: "ka",
    };
    const result = await api.post("/api/users").send(exampleUser);
    assert.strictEqual(result.statusCode, 400);
  });
});

after(async () => {
  await mongoose.connection.close();
});

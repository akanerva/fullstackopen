const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("totalLikes", () => {
  const listWithOneBlog = [
    {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
  ];
  const listWithTwoBlogs = [
    {
      id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
    },
    {
      id: "5a422aa71b54a676234d17f4",
      title: "Keep It Simple Stupid",
      author: "Kelly Johnson",
      url: "https://en.wikipedia.org/wiki/KISS_principle",
      likes: 6,
    },
  ];
  test("works with a list of one blog", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });
  test("works with a list of two blogs", () => {
    const result = listHelper.totalLikes(listWithTwoBlogs);
    assert.strictEqual(result, 11);
  });
});

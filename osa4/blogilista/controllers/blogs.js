const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog);
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
  };
  const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(result);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  if (!body.title || !body.url) {
    return response.status(400).json();
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user.id,
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const blogToRemove = await Blog.findById(request.params.id);
  logger.info(`decodedToken.id: ${decodedToken.id}`);
  logger.info(`blogToRemove.user.toString(): ${blogToRemove.user.toString()}`);
  if (decodedToken.id !== blogToRemove.user.toString()) {
    return response
      .status(401)
      .json({ error: "cannot remove someone else's blog" });
  }
  const user = await User.findById(decodedToken.id);
  user.blogs = user.blogs.filter(
    (blog) => blog.id.toString() !== request.params.id
  );
  await user.save();
  const removedBlog = await Blog.findByIdAndDelete(request.params.id);
  response.json(removedBlog);
});

module.exports = blogsRouter;

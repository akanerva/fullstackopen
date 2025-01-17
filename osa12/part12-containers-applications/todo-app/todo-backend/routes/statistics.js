const express = require("express");
const { getAsync } = require("../redis");
const router = express.Router();

/* GET meta statistics. */
router.get("/", async (_, res) => {
  const todos = await getAsync("added_todos");
  res.send({ added_todos: todos || "0" });
});

module.exports = router;

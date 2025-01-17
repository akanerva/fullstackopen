const express = require("express");
const { Todo } = require("../mongo");
const { getAsync, setAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const todos = await getAsync("added_todos");
  console.log(`todos: ${todos}`);
  console.log(todos === "NaN");
  console.log(`parseInt result: ${parseInt(todos)}`);
  const result = await setAsync(
    "added_todos",
    todos === "NaN" || todos === null ? 1 : parseInt(todos) + 1
  );
  console.log(result);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const updatedTodo = {
    text: req.body.text,
    done: req.body.done,
  };

  const todo = await Todo.findByIdAndUpdate(req.todo._id, updatedTodo, {
    new: true,
    context: "query",
  });
  res.send(todo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;

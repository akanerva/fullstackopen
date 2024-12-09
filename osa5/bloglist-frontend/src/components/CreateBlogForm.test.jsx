import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlogForm from "./CreateBlogForm";

test("handleCreateBlog gets called upon creating blog", async () => {
  const username = "tester";
  const addBlogHandler = vi.fn();
  const messageHandler = vi.fn();
  const user = userEvent.setup();

  const { container } = render(
    <CreateBlogForm
      username={username}
      handleAddBlog={addBlogHandler}
      handleMessageChange={messageHandler}
    />
  );

  const togglable = screen.getByText("create blog");
  await user.click(togglable);

  const title = container.querySelector("#title-input");
  const author = container.querySelector("#author-input");
  const url = container.querySelector("#url-input");

  expect(title).toBeDefined();

  await user.type(title, "foo bar fizz buzz");
  await user.type(author, "foo fighters");
  await user.type(url, "1234");

  const submit = screen.getByText("create");
  await user.click(submit);

  const blogObject = {
    username: username,
    title: "foo bar fizz buzz",
    author: "foo fighters",
    url: "1234",
  };

  expect(addBlogHandler.mock.calls).toHaveLength(1);
  expect(addBlogHandler.mock.calls[0][0]).toStrictEqual(blogObject);
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders content", () => {
  const blog = {
    author: "kalevi",
    title: "kalevin kaviomarkkinat kuopion torilla",
    url: "...",
    likes: 2,
    user: "fff",
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("kalevin kaviomarkkinat kuopion torilla");
  expect(element).toBeDefined();
});

test("renders more additional content after pressing view", async () => {
  const blog = {
    author: "kalevi",
    title: "kalevin kaviomarkkinat kuopion torilla",
    url: "...",
    likes: 2,
    user: "fff",
  };

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const title = screen.getByText(blog.title);
  const author = screen.getByText(blog.author);
  const url = screen.getByText(blog.url);
  const likes = screen.getByText(`likes ${blog.likes}`);

  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(url).toBeDefined();
  expect(likes).toBeDefined();
});

test("like button calls handleLike function", async () => {
  const blog = {
    author: "kalevi",
    title: "kalevin kaviomarkkinat kuopion torilla",
    url: "...",
    likes: 2,
    user: "fff",
  };

  const likeHandler = vi.fn();
  render(<Blog blog={blog} handleLike={likeHandler} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(likeHandler.mock.calls).toHaveLength(2);
});

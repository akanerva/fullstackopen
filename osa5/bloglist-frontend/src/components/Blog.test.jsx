import { render, screen } from "@testing-library/react";
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

  const element = screen.getByText(
    "kalevin kaviomarkkinat kuopion torilla kalevi"
  );
  expect(element).toBeDefined();
});

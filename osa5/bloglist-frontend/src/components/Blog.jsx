import { useState } from "react";

const Blog = ({ blog, handleLike, handleRemoveBlog }) => {
  const [collapsed, setCollapsed] = useState(true);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const collapsedBlog = () => (
    <>
      {blog.title} {blog.author}
      <button onClick={() => setCollapsed(false)}>view</button>
    </>
  );

  const fullBlog = () => (
    <>
      <div>
        {blog.title} <button onClick={() => setCollapsed(true)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}{" "}
        <button onClick={() => handleLike(blog)}>like</button>
      </div>
      <div>{blog.author}</div>
      <div>
        <button onClick={() => handleRemoveBlog(blog)}>remove</button>
      </div>
    </>
  );

  return (
    <div style={blogStyle}>
      {collapsed && collapsedBlog()}
      {!collapsed && fullBlog()}
    </div>
  );
};
export default Blog;

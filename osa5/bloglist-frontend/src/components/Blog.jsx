import { useState } from "react";

const Blog = ({ blog }) => {
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
        likes {blog.likes} <button>like</button>
      </div>
      <div>{blog.author}</div>
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

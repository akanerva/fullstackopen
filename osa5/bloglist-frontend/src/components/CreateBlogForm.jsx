import { useState, useRef } from "react";
import Togglable from "./Togglable";
import blogService from "../services/blogs";
import PropTypes from "prop-types";

const CreateBlogForm = ({ username, handleMessageChange, handleAddBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const blogFormRef = useRef();

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        username,
        title,
        url,
        author,
      };
      const response = await blogService.create(newBlog);
      handleAddBlog(response);
      setTitle("");
      setAuthor("");
      setUrl("");
      handleMessageChange({
        text: `a new blog ${response.title} added`,
        error: false,
      });
      setTimeout(() => {
        handleMessageChange(null);
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      console.log(exception.message);
      handleMessageChange({ text: "error creating blog", error: true });
      setTimeout(() => {
        handleMessageChange(null);
      }, 5000);
    }
  };

  return (
    <Togglable buttonLabel="create blog" ref={blogFormRef}>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
          <div>
            <button type="submit">create</button>
          </div>
        </div>
      </form>
    </Togglable>
  );
};

CreateBlogForm.propTypes = {
  username: PropTypes.string.isRequired,
  handleMessageChange: PropTypes.func.isRequired,
  handleAddBlog: PropTypes.func.isRequired,
};

export default CreateBlogForm;

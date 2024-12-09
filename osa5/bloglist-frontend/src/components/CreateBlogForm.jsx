import { useState, useRef } from "react";
import Togglable from "./Togglable";
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
      handleAddBlog(newBlog);
      handleMessageChange({
        text: `a new blog ${title} added`,
        error: false,
      });
      setTitle("");
      setAuthor("");
      setUrl("");
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
            id="title-input"
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            id="author-input"
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            id="url-input"
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

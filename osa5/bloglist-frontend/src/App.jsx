import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Notification = ({ message }) => {
  if (message == null) {
    return <></>;
  }
  console.log("message.error: ", message.error);
  const messageStyle =
    message.error === true
      ? {
          backgroundColor: "LightGrey",
          color: "red",
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
        }
      : {
          backgroundColor: "LightGrey",
          color: "ForestGreen",
          borderStyle: "solid",
          borderRadius: "4px",
          padding: "10px",
          marginBottom: "10px",
        };
  return <div style={messageStyle}>{message.text}</div>;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage({ text: "wrong username or password", error: true });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem("loggedBloglistUser");
      setUser(null);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("couldn't logout");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

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
      setBlogs([...blogs, response]);
      setTitle("");
      setAuthor("");
      setUrl("");
      setMessage({ text: `a new blog ${response.title} added`, error: false });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      blogFormRef.current.toggleVisibility();
    } catch (exception) {
      setMessage({ text: "error creating blog", error: true });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const createBlogForm = () => (
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

  const blogsForm = () => {
    const marginTop = {
      marginTop: "20px",
    };

    return (
      <>
        <h2>blogs</h2>
        <Notification message={message} />
        <div>
          {user.name} logged in{" "}
          <button onClick={() => handleLogout()}>logout</button>
        </div>
        <div style={marginTop}>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      {!user && loginForm()}
      {user && blogsForm()}
      {user && createBlogForm()}
    </div>
  );
};

export default App;

import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import CreateBlogForm from "./components/CreateBlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Notification = ({ message }) => {
  if (message === null) {
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
  const [message, setMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(blogs);
    });
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
      setMessage({ text: "couldn't logout", error: false });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleAddBlog = (blog) => {
    setBlogs([...blogs, blog]);
  };

  const handleLike = async (blog) => {
    const response = await blogService.update(blog.id, {
      likes: blog.likes + 1,
    });
    console.log("like response: ", response);
    const newBlogs = blogs.map((b) => (b.id === blog.id ? response : b));
    setBlogs(newBlogs);
  };

  const handleRemoveBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog);
        const newBlogs = blogs.filter((b) => b.id !== blog.id);
        setBlogs(newBlogs);
      } catch (exception) {
        console.log(exception);
      }
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

  const blogsForm = () => {
    const divStyle = {
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
        <div style={divStyle}>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLike={handleLike}
              handleRemoveBlog={handleRemoveBlog}
            />
          ))}
        </div>
      </>
    );
  };

  if (!user) {
    return <div>{loginForm()}</div>;
  }

  return (
    <div>
      {blogsForm()}
      <CreateBlogForm
        username={username}
        handleMessageChange={setMessage}
        handleAddBlog={handleAddBlog}
      />
    </div>
  );
};

export default App;

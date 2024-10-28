const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  blogs.forEach((blog) => (total = total + blog.likes));
  return total;
};

const favoriteBlog = (blogs) => {
  let favorite = blogs[0];
  let maxLikes = blogs[0].likes;
  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favorite = blog;
    }
  });
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const map = new Map();
  let blogger = blogs[0].author;
  let maxBlogs = 1;
  blogs.forEach((blog) => {
    const amount = map.get(blog.author) ?? 0;
    map.set(blog.author, amount + 1);
    if (amount + 1 > maxBlogs) {
      blogger = blog.author;
      maxBlogs = amount + 1;
    }
  });
  return {
    author: blogger,
    blogs: maxBlogs,
  };
};

const mostLikes = (blogs) => {
  const map = new Map();
  let author = blogs[0].author;
  let maxLikes = 0;
  blogs.forEach((blog) => {
    let totalLikes = map.get(blog.author) ?? 0;
    totalLikes = totalLikes + blog.likes;
    map.set(blog.author, totalLikes);
    if (totalLikes > maxLikes) {
      maxLikes = totalLikes;
      author = blog.author;
    }
  });
  return {
    author: author,
    likes: maxLikes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

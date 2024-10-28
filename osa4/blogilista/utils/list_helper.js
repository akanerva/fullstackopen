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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

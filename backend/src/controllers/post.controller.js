const { createPost, getPosts } = require("../services/post.service");

const createPostController = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const postData = req.body;

    const { status, response } = await createPost(userId, userRole, postData);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getPostsController = async (req, res) => {
  try {
    const { status, response } = await getPosts();
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createPostController,
  getPostsController,
};

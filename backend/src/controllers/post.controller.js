const {
  createPost,
  getPosts,
  getUserPosts,
  incrementPostViews,
  updatePost,
  deletePost,
  archivePost,
} = require("../services/post.service");

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

const getUserPostsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, response } = await getUserPosts(userId);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const incrementPostViewsController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, response } = await incrementPostViews(id, userId);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const postData = req.body;

    const { status, response } = await updatePost(id, userId, postData);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { status, response } = await deletePost(id, userId);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const archivePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { status, response } = await archivePost(id, userId);
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
  getUserPostsController,
  incrementPostViewsController,
  updatePostController,
  deletePostController,
  archivePostController,
};

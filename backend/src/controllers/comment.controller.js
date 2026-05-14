const { addComment, getCommentsByPost, deleteComment, addReply, getRepliesByComment } = require("../services/comment.service");

const addCommentController = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const { status, response } = await addComment(postId, userId, content);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getCommentsController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page, limit } = req.query;

    const { status, response } = await getCommentsByPost(postId, page, limit);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const { status, response } = await deleteComment(commentId, userId);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const addReplyController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Reply content is required" });
    }

    const { status, response } = await addReply(postId, commentId, userId, content);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getRepliesController = async (req, res) => {
  try {
    const { commentId } = req.params;

    const { status, response } = await getRepliesByComment(commentId);
    return res.status(status).json(response);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  addCommentController,
  getCommentsController,
  deleteCommentController,
  addReplyController,
  getRepliesController,
};

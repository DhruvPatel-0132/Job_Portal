const Comment = require("../models/Comment");
const Post = require("../models/Post");

const addComment = async (postId, userId, content) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const newComment = new Comment({
      post: postId,
      user: userId,
      content,
    });

    await newComment.save();

    // Increment comment count on the post
    post.stats.commentsCount = (post.stats.commentsCount || 0) + 1;
    await post.save();

    // Populate user details before returning
    await newComment.populate("user", "firstName lastName avatar headline role");
    let commentObj = newComment.toObject();

    if (commentObj.user && commentObj.user.role === "company") {
      const Company = require("../models/Company");
      const company = await Company.findOne({ createdBy: commentObj.user._id }).select("name logo tagline");
      if (company) {
        commentObj.user.companyName = company.name;
        commentObj.user.companyLogo = company.logo;
        commentObj.user.companyTagline = company.tagline;
      }
    }

    return {
      status: 201,
      response: {
        success: true,
        message: "Comment added successfully",
        data: commentObj,
      },
    };
  } catch (error) {
    return {
      status: 500,
      response: { success: false, message: "Error adding comment", error: error.message },
    };
  }
};

const getCommentsByPost = async (postId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    let comments = await Comment.find({ post: postId, isDeleted: false, parentComment: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "firstName lastName avatar headline role")
      .lean();

    const companyUserIds = comments.filter(c => c.user && c.user.role === "company").map(c => c.user._id);
    if (companyUserIds.length > 0) {
      const Company = require("../models/Company");
      const companies = await Company.find({ createdBy: { $in: companyUserIds } }).select("createdBy name logo tagline");
      comments = comments.map(c => {
        if (c.user && c.user.role === "company") {
          const comp = companies.find(comp => comp.createdBy.toString() === c.user._id.toString());
          if (comp) {
            c.user.companyName = comp.name;
            c.user.companyLogo = comp.logo;
            c.user.companyTagline = comp.tagline;
          }
        }
        return c;
      });
    }

    const totalComments = await Comment.countDocuments({ post: postId, isDeleted: false, parentComment: null });

    return {
      status: 200,
      response: {
        success: true,
        data: comments,
        pagination: {
          total: totalComments,
          page: Number(page),
          pages: Math.ceil(totalComments / limit),
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      response: { success: false, message: "Error fetching comments", error: error.message },
    };
  }
};

const deleteComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return { status: 404, response: { success: false, message: "Comment not found" } };
    }
    if (comment.user.toString() !== userId.toString()) {
      return { status: 403, response: { success: false, message: "Not authorized to delete this comment" } };
    }

    comment.isDeleted = true;
    await comment.save();

    if (comment.parentComment) {
      // It's a reply — decrement repliesCount on the parent comment
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $inc: { repliesCount: -1 }
      });
    } else {
      // Top-level comment — decrement commentsCount on the post
      const post = await Post.findById(comment.post);
      if (post && post.stats.commentsCount > 0) {
        post.stats.commentsCount -= 1;
        await post.save();
      }
    }

    return { status: 200, response: { success: true, message: "Comment deleted successfully" } };
  } catch (error) {
    return { status: 500, response: { success: false, message: "Error deleting comment", error: error.message } };
  }
};

const addReply = async (postId, parentCommentId, userId, content) => {
  try {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment || parentComment.isDeleted) {
      return { status: 404, response: { success: false, message: "Parent comment not found" } };
    }

    const reply = new Comment({
      post: postId,
      user: userId,
      content,
      parentComment: parentCommentId,
    });
    await reply.save();

    // Increment repliesCount on parent
    parentComment.repliesCount = (parentComment.repliesCount || 0) + 1;
    await parentComment.save();

    await reply.populate("user", "firstName lastName avatar headline role");
    let replyObj = reply.toObject();

    if (replyObj.user && replyObj.user.role === "company") {
      const Company = require("../models/Company");
      const company = await Company.findOne({ createdBy: replyObj.user._id }).select("name logo tagline");
      if (company) {
        replyObj.user.companyName = company.name;
        replyObj.user.companyLogo = company.logo;
        replyObj.user.companyTagline = company.tagline;
      }
    }

    return {
      status: 201,
      response: { success: true, message: "Reply added successfully", data: replyObj },
    };
  } catch (error) {
    return { status: 500, response: { success: false, message: "Error adding reply", error: error.message } };
  }
};

const getRepliesByComment = async (commentId) => {
  try {
    let replies = await Comment.find({ parentComment: commentId, isDeleted: false })
      .sort({ createdAt: 1 })
      .populate("user", "firstName lastName avatar headline role")
      .lean();

    const companyUserIds = replies.filter(r => r.user && r.user.role === "company").map(r => r.user._id);
    if (companyUserIds.length > 0) {
      const Company = require("../models/Company");
      const companies = await Company.find({ createdBy: { $in: companyUserIds } }).select("createdBy name logo tagline");
      replies = replies.map(r => {
        if (r.user && r.user.role === "company") {
          const comp = companies.find(c => c.createdBy.toString() === r.user._id.toString());
          if (comp) {
            r.user.companyName = comp.name;
            r.user.companyLogo = comp.logo;
            r.user.companyTagline = comp.tagline;
          }
        }
        return r;
      });
    }

    return { status: 200, response: { success: true, data: replies } };
  } catch (error) {
    return { status: 500, response: { success: false, message: "Error fetching replies", error: error.message } };
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
  addReply,
  getRepliesByComment,
};

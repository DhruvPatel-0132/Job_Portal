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

    let comments = await Comment.find({ post: postId, isDeleted: false })
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

    const totalComments = await Comment.countDocuments({ post: postId, isDeleted: false });

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

module.exports = {
  addComment,
  getCommentsByPost,
};

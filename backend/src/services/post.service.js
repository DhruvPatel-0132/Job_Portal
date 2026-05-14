const Post = require("../models/Post");
const Company = require("../models/Company");
const JobPost = require("../models/JobPost");
const Article = require("../models/Article");
const ShowcaseProject = require("../models/ShowcaseProject");
const Achievement = require("../models/Achievement");

const createPost = async (userId, userRole, postData) => {
  try {
    let authorId = userId;
    let authorModel = "User";
    let referenceId = null;
    let referenceModel = null;
    let postType = postData.postType || "regular";


    // If user is a company or hire, we might want to post as the company
    const company = await Company.findOne({ createdBy: userId });
    if ((userRole === "company" || userRole === "hire") && company) {
      authorId = company._id;
      authorModel = "Company";
    }


    // Handle Specialized Post Types
    if (postType === "job_post" && postData.jobData) {
      const job = await JobPost.create({
        title: postData.jobData.title,
        description: postData.jobData.description || postData.content,
        company: authorId,
        industry: postData.jobData.industry,
        category: postData.jobData.category,
        location: postData.jobData.location,
        employmentType: postData.jobData.type,
        workMode: postData.jobData.workMode,
        experienceLevel: postData.jobData.experienceLevel,
        educationLevel: postData.jobData.educationLevel,
        skillsRequired: postData.jobData.skills || [],
        salary: {
          min: Number(postData.jobData.salaryMin) || 0,
          max: Number(postData.jobData.salaryMax) || 0,
          isNegotiable: postData.jobData.isNegotiable || false,
          hideSalary: postData.jobData.hideSalary || false,
        },
        applicationUrl: postData.jobData.applicationUrl,
        applicationDeadline: (postData.jobData.applicationDeadline && postData.jobData.applicationDeadline.trim()) ? new Date(postData.jobData.applicationDeadline) : null,
        benefits: postData.jobData.benefits ? postData.jobData.benefits.split(",").map(b => b.trim()) : [],
      });
      referenceId = job._id;
      referenceModel = "JobPost";
    } else if (postType === "article" && postData.articleData) {
      const content = postData.articleData.content || postData.content || "";
      const wordCount = content.trim().split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));

      const generatedSlug = postData.articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
      const article = await Article.create({
        title: postData.articleData.title,
        summary: postData.articleData.summary,
        content: content,
        tags: postData.articleData.tags || [],
        seoSlug: generatedSlug,
        bannerImage: postData.articleData.coverImage ? { url: postData.articleData.coverImage.url } : null,
        readTime: readTime,
        status: "published",
        publishedAt: new Date()
      });
      referenceId = article._id;
      referenceModel = "Article";
    } else if (postType === "project" && postData.projectData) {
      const project = await ShowcaseProject.create({
        title: postData.projectData.title,
        description: postData.projectData.description || postData.content,
        techStack: (postData.projectData.tech || []).map(t => ({ name: t })),
        githubUrl: postData.projectData.githubUrl,
        liveUrl: postData.projectData.live,
        demoVideoUrl: postData.projectData.demoVideoUrl,
        projectStatus: postData.projectData.status,
        startDate: (postData.projectData.startDate && postData.projectData.startDate.trim()) ? new Date(postData.projectData.startDate) : null,
        endDate: (postData.projectData.endDate && postData.projectData.endDate.trim()) ? new Date(postData.projectData.endDate) : null,
        owner: userId,
        gallery: (postData.projectData.images || []).map(img => ({ url: img.url }))
      });
      referenceId = project._id;
      referenceModel = "ShowcaseProject";
      postType = "showcase_project";
    } else if (postType === "achievement" && postData.achievementData) {
      const achievement = await Achievement.create({
        title: postData.achievementData.title,
        type: postData.achievementData.type,
        issuer: { name: postData.achievementData.issuer },
        issueDate: (postData.achievementData.date && postData.achievementData.date.trim()) ? new Date(postData.achievementData.date) : new Date(),
        expiryDate: (postData.achievementData.expiryDate && postData.achievementData.expiryDate.trim()) ? new Date(postData.achievementData.expiryDate) : null,
        doesNotExpire: postData.achievementData.doesNotExpire || false,
        credentialId: postData.achievementData.credentialId,
        credentialUrl: postData.achievementData.credentialUrl,
        description: postData.achievementData.description,
        skills: postData.achievementData.skills || [],
      });
      referenceId = achievement._id;
      referenceModel = "Achievement";
    }



    const newPost = new Post({
      _id: postData._id || undefined, // Use pre-generated ID if available
      author: authorId,
      authorModel: authorModel,
      postType: postType,

      content: postData.content,
      media: postData.media || [],
      hashtags: postData.hashtags || [],
      mentions: postData.mentions || [],
      referenceId,
      referenceModel
    });

    const savedPost = await newPost.save();

    // Populate author details for the response
    await savedPost.populate({
      path: "author",
      select: "firstName lastName name logo avatar",
    });

    const { emitToAll } = require("../config/socket");
    emitToAll("new_post", savedPost);

    return {
      status: 201,
      response: {
        success: true,
        message: "Post created successfully",
        post: savedPost,
      },
    };
  } catch (error) {
    console.error("Create Post Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to create post",
        error: error.message,
      },
    };
  }
};


const getPosts = async (query = {}) => {
  try {
    const posts = await Post.find({ 
      isDeleted: { $ne: true }, 
      isArchived: { $ne: true }, 
      ...query 
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar",
      })
      .populate("referenceId");


    return {
      status: 200,
      response: {
        success: true,
        posts,
      },
    };
  } catch (error) {
    console.error("Get Posts Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch posts",
        error: error.message,
      },
    };
  }
};

const getUserPosts = async (userId) => {
  try {
    const company = await Company.findOne({ createdBy: userId });
    let authorQuery = { author: userId };

    // If user is a company, they might have posts under their company ID
    if (company) {
      authorQuery = { author: { $in: [userId, company._id] } };
    }

    const posts = await Post.find({ 
      ...authorQuery, 
      isDeleted: { $ne: true } 
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar",
      })
      .populate("referenceId");

    return {
      status: 200,
      response: {
        success: true,
        posts,
      },
    };
  } catch (error) {
    console.error("Get User Posts Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch user posts",
        error: error.message,
      },
    };
  }
};

const incrementPostViews = async (postId, userId) => {
  try {
    const post = await Post.findOneAndUpdate(
      {
        _id: postId,
        "stats.viewedBy": { $ne: userId }
      },
      {
        $inc: { "stats.viewsCount": 1 },
        $push: { "stats.viewedBy": userId }
      },
      { new: true }
    );

    if (!post) {
      const existingPost = await Post.findById(postId);
      if (!existingPost) {
        return {
          status: 404,
          response: { success: false, message: "Post not found" },
        };
      }
      return {
        status: 200,
        response: { success: true, viewsCount: existingPost.stats.viewsCount, message: "View already recorded" },
      };
    }

    return {
      status: 200,
      response: { success: true, viewsCount: post.stats.viewsCount },
    };
  } catch (error) {
    console.error("Increment Views Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to increment views",
        error: error.message,
      },
    };
  }
};

const updatePost = async (postId, userId, postData) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    // Authorization check: User can only edit their own posts
    // Note: If author is a Company, we should check if the user is the creator of that company
    const company = await Company.findOne({ createdBy: userId });
    const isAuthorized = post.author.toString() === userId || (company && post.author.toString() === company._id.toString());

    if (!isAuthorized) {
      return { status: 403, response: { success: false, message: "Unauthorized to edit this post" } };
    }

    // Update specialized content if applicable
    if (post.referenceId && post.referenceModel) {
      if (post.referenceModel === "JobPost" && postData.jobData) {
        await JobPost.findByIdAndUpdate(post.referenceId, {
          title: postData.jobData.title,
          description: postData.jobData.description || postData.content,
          location: postData.jobData.location,
          employmentType: postData.jobData.type,
          workMode: postData.jobData.workMode,
          experienceLevel: postData.jobData.experienceLevel,
          educationLevel: postData.jobData.educationLevel,
          skillsRequired: postData.jobData.skills || [],
          salary: {
            min: Number(postData.jobData.salaryMin) || 0,
            max: Number(postData.jobData.salaryMax) || 0,
            isNegotiable: postData.jobData.isNegotiable || false,
            hideSalary: postData.jobData.hideSalary || false,
          },
          applicationUrl: postData.jobData.applicationUrl,
          applicationDeadline: (postData.jobData.applicationDeadline && postData.jobData.applicationDeadline.trim()) ? new Date(postData.jobData.applicationDeadline) : null,
          benefits: postData.jobData.benefits ? (Array.isArray(postData.jobData.benefits) ? postData.jobData.benefits : postData.jobData.benefits.split(",").map(b => b.trim())) : [],
        });
      } else if (post.referenceModel === "Article" && postData.articleData) {
        const content = postData.articleData.content || postData.content || "";
        const wordCount = content.trim().split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        await Article.findByIdAndUpdate(post.referenceId, {
          title: postData.articleData.title,
          summary: postData.articleData.summary,
          content: content,
          tags: postData.articleData.tags || [],
          bannerImage: postData.articleData.coverImage ? { url: postData.articleData.coverImage.url } : undefined,
          readTime: readTime,
        });
      } else if (post.referenceModel === "ShowcaseProject" && postData.projectData) {
        await ShowcaseProject.findByIdAndUpdate(post.referenceId, {
          title: postData.projectData.title,
          description: postData.projectData.description || postData.content,
          techStack: (postData.projectData.tech || []).map(t => ({ name: t })),
          githubUrl: postData.projectData.githubUrl,
          liveUrl: postData.projectData.live,
          demoVideoUrl: postData.projectData.demoVideoUrl,
          projectStatus: postData.projectData.status,
          startDate: (postData.projectData.startDate && postData.projectData.startDate.trim()) ? new Date(postData.projectData.startDate) : null,
          endDate: (postData.projectData.endDate && postData.projectData.endDate.trim()) ? new Date(postData.projectData.endDate) : null,
          gallery: (postData.projectData.images || []).map(img => ({ url: img.url }))
        });
      } else if (post.referenceModel === "Achievement" && postData.achievementData) {
        await Achievement.findByIdAndUpdate(post.referenceId, {
          title: postData.achievementData.title,
          type: postData.achievementData.type,
          issuer: { name: postData.achievementData.issuer },
          issueDate: (postData.achievementData.date && postData.achievementData.date.trim()) ? new Date(postData.achievementData.date) : new Date(),
          expiryDate: (postData.achievementData.expiryDate && postData.achievementData.expiryDate.trim()) ? new Date(postData.achievementData.expiryDate) : null,
          doesNotExpire: postData.achievementData.doesNotExpire || false,
          credentialId: postData.achievementData.credentialId,
          credentialUrl: postData.achievementData.credentialUrl,
          description: postData.achievementData.description,
          skills: postData.achievementData.skills || [],
        });
      }
    }

    // Update main post
    post.content = postData.content;
    post.media = postData.media || post.media;
    post.hashtags = postData.hashtags || post.hashtags;
    post.mentions = postData.mentions || post.mentions;
    post.isEdited = true;
    post.editedAt = new Date();

    const updatedPost = await post.save();
    await updatedPost.populate([
      { path: "author", select: "firstName lastName name logo avatar" },
      { path: "referenceId" }
    ]);

    return {
      status: 200,
      response: {
        success: true,
        message: "Post updated successfully",
        post: updatedPost,
      },
    };
  } catch (error) {
    console.error("Update Post Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to update post", error: error.message },
    };
  }
};

const deletePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const company = await Company.findOne({ createdBy: userId });
    const isAuthorized = post.author.toString() === userId || (company && post.author.toString() === company._id.toString());

    if (!isAuthorized) {
      return { status: 403, response: { success: false, message: "Unauthorized to delete this post" } };
    }

    post.isDeleted = true;
    await post.save();

    return {
      status: 200,
      response: { success: true, message: "Post deleted successfully" },
    };
  } catch (error) {
    console.error("Delete Post Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to delete post", error: error.message },
    };
  }
};

const archivePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const company = await Company.findOne({ createdBy: userId });
    const isAuthorized = post.author.toString() === userId || (company && post.author.toString() === company._id.toString());

    if (!isAuthorized) {
      return { status: 403, response: { success: false, message: "Unauthorized to archive this post" } };
    }

    post.isArchived = !post.isArchived; // Toggle archive status
    await post.save();

    return {
      status: 200,
      response: {
        success: true,
        message: post.isArchived ? "Post archived successfully" : "Post unarchived successfully",
        isArchived: post.isArchived
      },
    };
  } catch (error) {
    console.error("Archive Post Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to archive post", error: error.message },
    };
  }
};

module.exports = {
  createPost,
  getPosts,
  getUserPosts,
  incrementPostViews,
  updatePost,
  deletePost,
  archivePost,
};

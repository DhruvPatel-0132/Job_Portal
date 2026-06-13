const Post = require("../models/Post");
const Company = require("../models/Company");
const JobPost = require("../models/JobPost");
const Article = require("../models/Article");
const ShowcaseProject = require("../models/ShowcaseProject");
const Achievement = require("../models/Achievement");
const Reaction = require("../models/Reaction");
const User = require("../models/User");
const SavedPost = require("../models/SavedPost");
const Profile = require("../models/Profile");

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
          currency: postData.jobData.salaryCurrency || "INR",
          period: postData.jobData.salaryPeriod || "yearly",
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
    } else if ((postType === "project" || postType === "showcase_project") && postData.projectData) {
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


const getPosts = async (query = {}, userId = null, limit = 15, cursor = null) => {
  try {
    const hibernatedProfiles = await Profile.find({ status: "hibernated" }).select("userId");
    const hibernatedUserIds = hibernatedProfiles.map(p => p.userId);

    let dbQuery = {
      isDeleted: { $ne: true },
      isArchived: { $ne: true },
      author: { $nin: hibernatedUserIds },
      ...query
    };

    // If a cursor is provided, fetch posts strictly older than the cursor ID
    if (cursor) {
      dbQuery._id = { $lt: cursor };
    }

    const posts = await Post.find(dbQuery)
      .sort({ _id: -1 }) // _id naturally encodes the timestamp in a perfect chronological order
      .limit(limit + 1) // Fetch one extra to determine if there are more pages
      .select("author authorModel postType content media hashtags mentions referenceId referenceModel stats isEdited editedAt createdAt")
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar createdBy",
      })
      .populate("referenceId")
      .lean();

    const hasMore = posts.length > limit;
    if (hasMore) {
      posts.pop(); // Remove the extra item
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1]._id.toString() : null;

    // Attach userReaction and isSaved for authenticated user
    if (userId) {
      const postIds = posts.map(p => p._id);
      const [reactions, savedPosts] = await Promise.all([
        Reaction.find({ post: { $in: postIds }, user: userId }).select("post reactionType"),
        SavedPost.find({ post: { $in: postIds }, user: userId }).select("post")
      ]);
      const reactionMap = {};
      reactions.forEach(r => { reactionMap[r.post.toString()] = r.reactionType; });
      const savedMap = new Set(savedPosts.map(s => s.post.toString()));
      
      posts.forEach(p => { 
        p.stats = p.stats || {}; 
        p.stats.userReaction = reactionMap[p._id.toString()] || null; 
        p.stats.isSaved = savedMap.has(p._id.toString());
      });
    }

    // Attach author slugs
    const authorUserIds = posts.map(p => {
       if (!p.author) return null;
       return p.authorModel === "Company" ? p.author.createdBy : p.author._id;
    }).filter(Boolean);

    const authorProfiles = await Profile.find({ userId: { $in: authorUserIds } }).select("userId slug");
    const profileMap = {};
    authorProfiles.forEach(prof => profileMap[prof.userId.toString()] = prof.slug);

    posts.forEach(p => {
        if (p.author) {
           const aUserId = p.authorModel === "Company" ? p.author.createdBy?.toString() : p.author._id?.toString();
           if (aUserId && profileMap[aUserId]) {
               p.author.slug = profileMap[aUserId];
           }
        }
    });

    return {
      status: 200,
      response: {
        success: true,
        posts,
        nextCursor,
        hasMore,
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

const getPostById = async (postId, userId = null) => {
  try {
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar createdBy",
      })
      .populate("referenceId")
      .lean();

    if (!post) {
      return {
        status: 404,
        response: { success: false, message: "Post not found" },
      };
    }

    if (userId) {
      const [reaction, savedPost] = await Promise.all([
        Reaction.findOne({ post: postId, user: userId }).select("reactionType"),
        SavedPost.findOne({ post: postId, user: userId }).select("_id")
      ]);
      post.stats = post.stats || {};
      post.stats.userReaction = reaction ? reaction.reactionType : null;
      post.stats.isSaved = !!savedPost;
    }

    if (post.author) {
      const aUserId = post.authorModel === "Company" ? post.author.createdBy?.toString() : post.author._id?.toString();
      if (aUserId) {
        const authorProfile = await Profile.findOne({ userId: aUserId }).select("slug");
        if (authorProfile) {
           post.author.slug = authorProfile.slug;
        }
      }
    }

    return {
      status: 200,
      response: {
        success: true,
        post,
      },
    };
  } catch (error) {
    console.error("Get Post By Id Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch post",
        error: error.message,
      },
    };
  }
};

const getUserPosts = async (userId, requestingUserId = null) => {
  try {
    const company = await Company.findOne({ createdBy: userId });
    let authorQuery = { author: userId };

    // If user is a company, they might have posts under their company ID
    if (company) {
      authorQuery = { author: { $in: [userId, company._id] } };
    }

    let isHibernated = false;
    if (requestingUserId && requestingUserId.toString() !== userId.toString()) {
      const profile = await Profile.findOne({ userId });
      if (profile && profile.status === "hibernated") {
        isHibernated = true;
      }
    }

    if (isHibernated) {
      return {
        status: 200,
        response: {
          success: true,
          posts: [],
        },
      };
    }

    const posts = await Post.find({ 
      ...authorQuery, 
      isDeleted: { $ne: true } 
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar createdBy",
      })
      .populate("referenceId")
      .lean();

    // Attach userReaction and isSaved for the requesting user
    if (requestingUserId) {
      const postIds = posts.map(p => p._id);
      const [reactions, savedPosts] = await Promise.all([
        Reaction.find({ post: { $in: postIds }, user: requestingUserId }).select("post reactionType"),
        SavedPost.find({ post: { $in: postIds }, user: requestingUserId }).select("post")
      ]);
      const reactionMap = {};
      reactions.forEach(r => { reactionMap[r.post.toString()] = r.reactionType; });
      const savedMap = new Set(savedPosts.map(s => s.post.toString()));

      posts.forEach(p => { 
        p.stats = p.stats || {}; 
        p.stats.userReaction = reactionMap[p._id.toString()] || null; 
        p.stats.isSaved = savedMap.has(p._id.toString());
      });
    }

    // Attach author slugs
    const authorUserIds = posts.map(p => {
       if (!p.author) return null;
       return p.authorModel === "Company" ? p.author.createdBy : p.author._id;
    }).filter(Boolean);

    const authorProfiles = await Profile.find({ userId: { $in: authorUserIds } }).select("userId slug");
    const profileMap = {};
    authorProfiles.forEach(prof => profileMap[prof.userId.toString()] = prof.slug);

    posts.forEach(p => {
        if (p.author) {
           const aUserId = p.authorModel === "Company" ? p.author.createdBy?.toString() : p.author._id?.toString();
           if (aUserId && profileMap[aUserId]) {
               p.author.slug = profileMap[aUserId];
           }
        }
    });

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

const getSavedPosts = async (userId, requestingUserId = null, limit = 15, cursor = null) => {
  try {
    let dbQuery = { user: userId };

    if (cursor) {
      dbQuery._id = { $lt: cursor };
    }

    const hibernatedProfiles = await Profile.find({ status: "hibernated" }).select("userId");
    const hibernatedUserIds = hibernatedProfiles.map(p => p.userId);

    const savedPosts = await SavedPost.find(dbQuery)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate({
        path: "post",
        match: { isDeleted: { $ne: true }, author: { $nin: hibernatedUserIds } },
        populate: [
          { path: "author", select: "firstName lastName name logo avatar createdBy" },
          { path: "referenceId" }
        ]
      })
      .lean();

    const hasMore = savedPosts.length > limit;
    if (hasMore) {
      savedPosts.pop();
    }

    const nextCursor = savedPosts.length > 0 ? savedPosts[savedPosts.length - 1]._id.toString() : null;

    // Extract posts that are not null (i.e. not deleted)
    let posts = savedPosts.map(sp => sp.post).filter(p => p != null);

    // Attach userReaction and isSaved for the requesting user
    if (requestingUserId) {
      const postIds = posts.map(p => p._id);
      const [reactions, userSavedPosts] = await Promise.all([
        Reaction.find({ post: { $in: postIds }, user: requestingUserId }).select("post reactionType"),
        SavedPost.find({ post: { $in: postIds }, user: requestingUserId }).select("post")
      ]);
      const reactionMap = {};
      reactions.forEach(r => { reactionMap[r.post.toString()] = r.reactionType; });
      const savedMap = new Set(userSavedPosts.map(s => s.post.toString()));

      posts.forEach(p => {
        p.stats = p.stats || {};
        p.stats.userReaction = reactionMap[p._id.toString()] || null;
        p.stats.isSaved = savedMap.has(p._id.toString());
      });
    }

    // Attach author slugs
    const authorUserIds = posts.map(p => {
       if (!p.author) return null;
       return p.authorModel === "Company" ? p.author.createdBy : p.author._id;
    }).filter(Boolean);

    const authorProfiles = await Profile.find({ userId: { $in: authorUserIds } }).select("userId slug");
    const profileMap = {};
    authorProfiles.forEach(prof => profileMap[prof.userId.toString()] = prof.slug);

    posts.forEach(p => {
        if (p.author) {
           const aUserId = p.authorModel === "Company" ? p.author.createdBy?.toString() : p.author._id?.toString();
           if (aUserId && profileMap[aUserId]) {
               p.author.slug = profileMap[aUserId];
           }
        }
    });

    return {
      status: 200,
      response: {
        success: true,
        posts,
        nextCursor,
        hasMore,
      },
    };
  } catch (error) {
    console.error("Get Saved Posts Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch saved posts",
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
            currency: postData.jobData.salaryCurrency || "INR",
            period: postData.jobData.salaryPeriod || "yearly",
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

const toggleReaction = async (postId, userId, reactionType = "like") => {
  try {
    const { emitToAll } = require("../config/socket");
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const existingReaction = await Reaction.findOne({ post: postId, user: userId });

    if (existingReaction) {
      if (existingReaction.reactionType === reactionType) {
        // Remove reaction
        await Reaction.deleteOne({ _id: existingReaction._id });
        post.stats.likesCount = Math.max(0, post.stats.likesCount - 1);
        post.stats.likedBy = post.stats.likedBy.filter(id => id.toString() !== userId.toString());
        await post.save();

        emitToAll("post_reaction_updated", {
          postId: post._id.toString(),
          likesCount: post.stats.likesCount,
          likedBy: post.stats.likedBy,
        });

        return {
          status: 200,
          response: { success: true, message: "Reaction removed", likesCount: post.stats.likesCount, likedBy: post.stats.likedBy, userReaction: null },
        };
      } else {
        // Change reaction
        existingReaction.reactionType = reactionType;
        await existingReaction.save();

        emitToAll("post_reaction_updated", {
          postId: post._id.toString(),
          likesCount: post.stats.likesCount,
          likedBy: post.stats.likedBy,
        });

        return {
          status: 200,
          response: { success: true, message: "Reaction updated", likesCount: post.stats.likesCount, likedBy: post.stats.likedBy, userReaction: reactionType },
        };
      }
    } else {
      // Add reaction
      await Reaction.create({ post: postId, user: userId, reactionType });
      post.stats.likesCount += 1;
      if (!post.stats.likedBy.includes(userId)) {
        post.stats.likedBy.push(userId);
      }
      await post.save();

      emitToAll("post_reaction_updated", {
        postId: post._id.toString(),
        likesCount: post.stats.likesCount,
        likedBy: post.stats.likedBy,
      });

      return {
        status: 201,
        response: { success: true, message: "Reaction added", likesCount: post.stats.likesCount, likedBy: post.stats.likedBy, userReaction: reactionType },
      };
    }
  } catch (error) {
    console.error("Toggle Reaction Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to toggle reaction", error: error.message },
    };
  }
};

const toggleSavePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const existingSavedPost = await SavedPost.findOne({ post: postId, user: userId });

    if (existingSavedPost) {
      // Unsave post
      await SavedPost.deleteOne({ _id: existingSavedPost._id });
      post.stats.savesCount = Math.max(0, post.stats.savesCount - 1);
      
      await post.save();

      return {
        status: 200,
        response: { success: true, message: "Post unsaved", savesCount: post.stats.savesCount, isSaved: false },
      };
    } else {
      // Save post
      await SavedPost.create({ post: postId, user: userId });
      post.stats.savesCount += 1;

      await post.save();

      return {
        status: 200,
        response: { success: true, message: "Post saved", savesCount: post.stats.savesCount, isSaved: true },
      };
    }
  } catch (error) {
    console.error("Toggle Save Post Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to toggle save post", error: error.message },
    };
  }
};

const getRecommendedJobs = async (userId = null) => {
  try {
    const jobs = await Post.find({
      postType: "job_post",
      isDeleted: { $ne: true },
      isArchived: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "author",
        populate: {
          path: "createdBy",
          select: "role avatar firstName lastName",
          options: { strictPopulate: false }
        }
      })
      .populate("referenceId")
      .lean();

    // Attach isSaved for the requesting user
    if (userId && jobs.length > 0) {
      const postIds = jobs.map(j => j._id);
      const savedPosts = await SavedPost.find({ post: { $in: postIds }, user: userId }).select("post");
      const savedSet = new Set(savedPosts.map(s => s.post.toString()));
      jobs.forEach(j => {
        j.stats = j.stats || {};
        j.stats.isSaved = savedSet.has(j._id.toString());
      });
    }

    return {
      status: 200,
      response: {
        success: true,
        jobs
      }
    };
  } catch (error) {
    console.error("getRecommendedJobs Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch recommended jobs",
        error: error.message
      }
    };
  }
};

const getMyJobPosts = async (userId) => {
  try {
    const company = await Company.findOne({ createdBy: userId });
    let authorQuery = { author: userId };

    if (company) {
      authorQuery = { author: { $in: [userId, company._id] } };
    }

    const posts = await Post.find({
      ...authorQuery,
      postType: "job_post",
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName name logo avatar createdBy",
      })
      .populate("referenceId")
      .lean();

    return {
      status: 200,
      response: {
        success: true,
        posts,
      },
    };
  } catch (error) {
    console.error("Get My Job Posts Service Error:", error);
    return {
      status: 500,
      response: {
        success: false,
        message: "Failed to fetch job posts",
        error: error.message,
      },
    };
  }
};

const toggleJobStatus = async (postId, userId) => {
  try {
    const post = await Post.findById(postId).populate("referenceId");
    if (!post) {
      return { status: 404, response: { success: false, message: "Post not found" } };
    }

    const company = await Company.findOne({ createdBy: userId });
    const isAuthorized = post.author.toString() === userId || (company && post.author.toString() === company._id.toString());

    if (!isAuthorized) {
      return { status: 403, response: { success: false, message: "Unauthorized to modify this post" } };
    }

    if (post.referenceModel !== "JobPost" || !post.referenceId) {
      return { status: 400, response: { success: false, message: "Post is not a job post" } };
    }

    const job = await JobPost.findById(post.referenceId._id);
    job.isActive = !job.isActive;
    await job.save();

    return {
      status: 200,
      response: {
        success: true,
        message: job.isActive ? "Job post activated" : "Job post deactivated",
        isActive: job.isActive,
      },
    };
  } catch (error) {
    console.error("Toggle Job Status Service Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Failed to toggle job status", error: error.message },
    };
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getUserPosts,
  getSavedPosts,
  incrementPostViews,
  updatePost,
  deletePost,
  archivePost,
  toggleReaction,
  toggleSavePost,
  getRecommendedJobs,
  getMyJobPosts,
  toggleJobStatus,
};

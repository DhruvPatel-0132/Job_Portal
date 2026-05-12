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
        location: postData.jobData.location,
        employmentType: postData.jobData.type,
        workMode: postData.jobData.workMode,
        experienceLevel: postData.jobData.experienceLevel,
        skillsRequired: postData.jobData.skills || [],
        salary: {
          min: Number(postData.jobData.salaryMin) || 0,
          max: Number(postData.jobData.salaryMax) || 0,
        }
      });
      referenceId = job._id;
      referenceModel = "JobPost";
    } else if (postType === "article" && postData.articleData) {
      const article = await Article.create({
        title: postData.articleData.title,
        summary: postData.articleData.summary,
        content: postData.articleData.content || postData.content,

        tags: postData.articleData.tags || [],
        slug: postData.articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
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
        liveUrl: postData.projectData.live,
        projectStatus: postData.projectData.status,
        owner: userId,
        gallery: (postData.projectData.images || []).map(img => ({ url: img.url }))
      });
      referenceId = project._id;
      referenceModel = "ShowcaseProject";
      // Update postType to match model enum if needed
      postType = "showcase_project";
    } else if (postType === "achievement" && postData.achievementData) {
      const achievement = await Achievement.create({
        title: postData.achievementData.title,
        type: postData.achievementData.type,
        issuer: { name: postData.achievementData.issuer },
        issueDate: new Date(postData.achievementData.date),
        credentialUrl: postData.achievementData.credentialUrl,
      });
      referenceId = achievement._id;
      referenceModel = "Achievement";
    }



    const newPost = new Post({
      author: authorId,
      authorModel: authorModel,
      postType: postType,

      content: postData.content,
      media: postData.media || [],
      hashtags: postData.hashtags || [],
      mentions: postData.mentions || [],
      visibility: postData.visibility || "public",
      referenceId,
      referenceModel
    });

    const savedPost = await newPost.save();
    
    // Populate author details for the response
    await savedPost.populate({
      path: "author",
      select: "firstName lastName name logo avatar",
    });

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
    const posts = await Post.find({ isDeleted: false, ...query })
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

module.exports = {
  createPost,
  getPosts,
};

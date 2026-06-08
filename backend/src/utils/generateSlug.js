const mongoose = require("mongoose");

/**
 * Generates a unique slug based on a string (e.g. name or company name).
 * It appends a random string if the base slug already exists.
 * @param {string} baseString 
 * @returns {string} Unique slug
 */
const generateSlug = async (baseString) => {
  if (!baseString) {
    baseString = "user";
  }

  // 1. Clean the string
  let slug = baseString
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric chars
    .replace(/[\s-]+/g, "-")      // Replace spaces and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, "");     // Trim hyphens from start and end

  if (!slug) {
    slug = "user";
  }

  const Profile = mongoose.model("Profile");

  // 2. Check for uniqueness
  let isUnique = false;
  let currentSlug = slug;
  let counter = 1;

  while (!isUnique) {
    const profileExists = await Profile.exists({ slug: currentSlug });

    if (!profileExists) {
      isUnique = true;
    } else {
      // Append a random 4-character string to make it unique
      const randomStr = Math.random().toString(36).substring(2, 6);
      currentSlug = `${slug}-${randomStr}`;
    }
  }

  return currentSlug;
};

module.exports = { generateSlug };

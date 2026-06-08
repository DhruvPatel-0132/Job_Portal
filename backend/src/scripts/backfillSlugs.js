const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const Company = require("../models/Company");
const Profile = require("../models/Profile");
const { generateSlug } = require("../utils/generateSlug");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/talentforge")
  .then(async () => {
    console.log("Connected to DB");

    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profiles to update.`);
    for (const profile of profiles) {
      const user = await User.findById(profile.userId);
      if (!user) continue;

      let slugName = `${user.firstName || ""} ${user.lastName || ""}`;
      
      if (user.role === "company") {
          const company = await Company.findOne({ createdBy: user._id });
          if (company && company.name) {
              slugName = company.name;
          }
      }

      const slug = await generateSlug(slugName);
      profile.slug = slug;
      await profile.save();
      console.log(`Updated profile ${profile._id} with slug ${slug}`);
    }

    console.log("Unsetting old slug fields from users and companies collections...");
    await mongoose.connection.db.collection('users').updateMany({}, { $unset: { slug: "" } });
    await mongoose.connection.db.collection('companies').updateMany({}, { $unset: { slug: "" } });

    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Resume = require("../models/Resume");
const { calculateATSScore } = require("../utils/atsEngine");

const uploadToCloudinary = (buffer, fileName, mimetype) => {
  const isPDF = mimetype === "application/pdf";
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Resumes",
        resource_type: "auto",
        // For PDFs (images), Cloudinary auto-appends .pdf. 
        // For others (raw), we manually append the extension to the public_id.
        public_id: (Date.now() + "-" + fileName.replace(/\.[^/.]+$/, "")).replace(/\s+/g, "_") + (isPDF ? "" : fileName.substring(fileName.lastIndexOf("."))),
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const extractText = async (file) => {
  if (file.mimetype === "application/pdf") {
    // Some versions of pdf-parse export the function differently
    const parse = typeof pdfParse === "function" ? pdfParse : pdfParse.default || pdfParse;
    if (typeof parse !== "function") {
      throw new Error("pdf-parse is not correctly loaded");
    }
    const data = await parse(file.buffer);
    return data.text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value;
  }

  return "";
};

const uploadResume = async (req, res) => {
  try {
    console.log("Upload request received for file:", req.file?.originalname);
    if (!req.file) {
      return res.status(400).json({
        message: "Resume required",
      });
    }

    console.log("Extracting text...");
    const extractedText = await extractText(req.file);
    if (!extractedText || extractedText.trim().length === 0) {
       throw new Error("Could not extract text from the file. Please ensure it's a valid PDF or DOCX.");
    }
    console.log("Text extracted, length:", extractedText.length);

    console.log("Calculating ATS score...");
    const atsResult = calculateATSScore(extractedText);
    console.log("ATS score calculated:", atsResult.score);

    console.log("Uploading to Cloudinary...");
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );
    console.log("Cloudinary upload successful:", cloudinaryResult.secure_url);

    const highlights = [
      `ATS Level: ${atsResult.level}`,
      `Detected ${atsResult.debug.skills.length} technical skills`,
      `${atsResult.debug.exp.years}+ years experience detected`,
      `Resume score is ${atsResult.score}%`,
    ];

    console.log("Saving to database...");
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      resumeUrl: cloudinaryResult.secure_url,
      extractedText,
      atsScore: atsResult.score,
      level: atsResult.level,
      highlights,
      skills: atsResult.debug.skills,
      debug: atsResult.debug,
    });
    // console.log("Resume saved to DB:", resume._id);

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Resume upload failed",
      error: error.message,
    });
  }
};

const getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

module.exports = {
  uploadResume,
  getLatestResume,
};

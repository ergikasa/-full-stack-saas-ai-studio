import OpenAI from "openai";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import cloudinary from "cloudinary";
import FormData from "form-data";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import sql from "../configs/db.js";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------- Helpers --------------
const incrementFreeUsage = async (userId, currentUsage) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: { free_usage: currentUsage + 1 },
  });
};

// -------------- Generate Article --------------
export const generateArticle = async (req, res) => {
  try {
    const { userId, has } = req;
    const { prompt, length } = req.body;
    const free_usage = req.free_usage;

    if (!has({ plan: "premium" }) && free_usage >= 10) {
      return res
        .status(403)
        .json({ success: false, message: "Upgrade to premium to continue" });
    }

    const tokens = Math.min(length * 2, 4000);

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: `Write a detailed article about "${prompt}" with approximately ${length} words. Include headings, subheadings, and multiple paragraphs.`,
        },
      ],
      temperature: 0.7,
      max_tokens: tokens,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (!has({ plan: "premium" })) {
      await incrementFreeUsage(userId, free_usage);
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("generateArticle error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------- Generate Blog Title --------------
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId, has } = req;
    const { prompt } = req.body;
    const free_usage = req.free_usage;

    if (!has({ plan: "premium" }) && free_usage >= 10) {
      return res
        .status(403)
        .json({ success: false, message: "Upgrade to premium to continue" });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (!has({ plan: "premium" })) {
      await incrementFreeUsage(userId, free_usage);
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("generateBlogTitle error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------- Generate Image --------------
export const generateImage = async (req, res) => {
  try {
    const { userId, has } = req;
    const { prompt, publish } = req.body;

    if (!has({ plan: "premium" })) {
      return res.status(403).json({
        success: false,
        message: "Upgrade to premium to continue",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    const { secure_url } = await cloudinary.v2.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("generateImage error:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Image generation failed" });
  }
};


// -------------- Remove Image Background --------------
export const removeImageBackground = async (req, res) => {
  try {
    const { has } = req;

    if (!has({ plan: "premium" })) {
      return res
        .status(403)
        .json({ success: false, message: "Upgrade to premium to continue" });
    }

    const { secure_url } = await cloudinary.v2.uploader.upload(req.file.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    fs.unlinkSync(req.file.path);

    res.json({ success: true, content: secure_url });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("removeImageBackground error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------- Remove Image Object --------------
export const removeImageObject = async (req, res) => {
  try {
    const { has } = req;

    if (!has({ plan: "premium" })) {
      return res
        .status(403)
        .json({ success: false, message: "Upgrade to premium to continue" });
    }

    const uploaded = await cloudinary.v2.uploader.upload(req.file.path);

    fs.unlinkSync(req.file.path);

    res.json({ success: true, content: uploaded.secure_url });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("removeImageObject error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------- Resume Review --------------
export const resumeReview = async (req, res) => {
  try {
    const { has } = req;
    const resume = req.file;

    if (!has({ plan: "premium" })) {
      return res
        .status(403)
        .json({ success: false, message: "Upgrade to premium to continue" });
    }

    if (resume.size > 5 * 1024 * 1024) {
      fs.unlinkSync(resume.path);
      return res
        .status(400)
        .json({ success: false, message: "Resume file size exceeds 5MB" });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    fs.unlinkSync(resume.path);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume content:\n\n${pdfData.text}`;
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    res.json({ success: true, content });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("resumeReview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

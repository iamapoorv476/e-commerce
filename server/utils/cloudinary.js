import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Manual config using separate variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Debug logs
console.log("🔍 Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("🔍 Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
console.log("🔍 Cloudinary Secret:", process.env.CLOUDINARY_API_SECRET ? "✓ Loaded" : "❌ Missing");

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "ecommerce_uploads", // optional
    });

    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

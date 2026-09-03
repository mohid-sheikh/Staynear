import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const uploadImage = async (filePath) => {
  try {
    // 1. If Cloudinary credentials are fully configured in .env, upload to Cloudinary
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME.trim() !== "" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY.trim() !== ""
    ) {
      console.log("Uploading image file to Cloudinary:", filePath);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "staynear",
      });

      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      if (result && result.secure_url) {
        console.log("Cloudinary Upload Success:", result.secure_url);
        return result.secure_url;
      }
    }

    // 2. Local File Upload Fallback:
    // If Cloudinary keys are missing or unconfigured in server/.env,
    // save the owner-uploaded file to server/uploads/ directory and return a valid local static URL.
    console.log("Cloudinary credentials missing or unconfigured. Storing image locally:", filePath);
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(filePath) || ".jpg"}`;
    const targetPath = path.join(uploadsDir, fileName);

    if (filePath && fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, targetPath);
      fs.unlinkSync(filePath);
    }

    const PORT = process.env.PORT || 5000;
    const hostUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
    const localUrl = `${hostUrl}/uploads/${fileName}`;

    console.log("Local Upload Success:", localUrl);
    return localUrl;

  } catch (error) {
    console.error("Upload Image Error:", error.message || error);

    // Emergency local fallback if Cloudinary API call threw an exception
    try {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(filePath) || ".jpg"}`;
      const targetPath = path.join(uploadsDir, fileName);

      if (filePath && fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, targetPath);
        fs.unlinkSync(filePath);
      }

      const PORT = process.env.PORT || 5000;
      const hostUrl = process.env.SERVER_URL || `http://localhost:${PORT}`;
      const localUrl = `${hostUrl}/uploads/${fileName}`;

      console.log("Emergency Local Upload Success:", localUrl);
      return localUrl;
    } catch (localErr) {
      console.error("Emergency Local Upload Error:", localErr);
      throw new Error("Failed to process property image upload.");
    }
  }
};

export default uploadImage;
import { cloudinary } from "../config/cloudinary.js";
import fs from "fs";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

const uploadImage = async (filePath) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME.trim() === "") {
            console.warn("Cloudinary credentials missing in .env. Using fallback accommodation image.");
            if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return DEFAULT_IMAGE;
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "staynear",
        });

        // Delete the temporary file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return result.secure_url;

    } catch (error) {
        console.error("Cloudinary Upload Warning:", error.message || error);
        // Delete temp file even if upload fails
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return DEFAULT_IMAGE;
    }
};

export default uploadImage;
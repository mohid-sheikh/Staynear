import express from "express";
import upload from "../middleware/multer.js";
import {
    createListing,
    deleteListing,
    getAllListings,
    getMyListings,
    getSingleListing,
    updateListing,
    updateListingStatus,
} from "../controllers/listingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllListings);
router.get("/my-listings", authMiddleware, getMyListings);
router.get("/:id", getSingleListing);

// Protected Routes
router.post(
    "/",
    authMiddleware,
    upload.array("images", 5),
    createListing
);
router.put(
    "/:id",
    authMiddleware,
    upload.array("images", 5),
    updateListing
);
router.patch("/:id/status", authMiddleware, updateListingStatus);
router.delete("/:id", authMiddleware, deleteListing);

export default router;
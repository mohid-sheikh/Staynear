import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createReview,
  getListingReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// Reviews Routes
router.post("/", authMiddleware, createReview);
router.get("/:listingId", getListingReviews);
router.delete("/:id", authMiddleware, deleteReview);

export default router;

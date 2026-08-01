import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getRecentlyViewed,
  addToRecentlyViewed,
} from "../controllers/userController.js";

const router = express.Router();

// Wishlist Routes
router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist/:listingId", authMiddleware, addToWishlist);
router.delete("/wishlist/:listingId", authMiddleware, removeFromWishlist);

// Recently Viewed Routes
router.get("/recent", authMiddleware, getRecentlyViewed);
router.post("/recent/:listingId", authMiddleware, addToRecentlyViewed);

export default router;

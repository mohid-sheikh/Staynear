import mongoose from "mongoose";
import User from "../models/User.js";
import Listing from "../models/listingModels.js";

// GET /api/users/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: {
        path: "owner",
        select: "name email phone college",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist ? user.wishlist.length : 0,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    console.error("getWishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// POST /api/users/wishlist/:listingId
export const addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exists = user.wishlist.some(
      (id) => id.toString() === listingId.toString()
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Listing already in wishlist",
      });
    }

    user.wishlist.push(listingId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Listing added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("addToWishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DELETE /api/users/wishlist/:listingId
export const removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== listingId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Listing removed from wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET /api/users/recent
export const getRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "recentlyViewed.listing",
      populate: {
        path: "owner",
        select: "name email phone college",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Sort newest first & filter out deleted listings
    const recent = (user.recentlyViewed || [])
      .filter((item) => item.listing != null)
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt));

    res.status(200).json({
      success: true,
      count: recent.length,
      recentlyViewed: recent,
    });
  } catch (error) {
    console.error("getRecentlyViewed error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// POST /api/users/recent/:listingId
export const addToRecentlyViewed = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove duplicate entry if present
    user.recentlyViewed = (user.recentlyViewed || []).filter(
      (item) => item.listing && item.listing.toString() !== listingId.toString()
    );

    // Insert newest at top
    user.recentlyViewed.unshift({
      listing: listingId,
      viewedAt: new Date(),
    });

    // Enforce max 20 items
    if (user.recentlyViewed.length > 20) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Recently viewed updated",
    });
  } catch (error) {
    console.error("addToRecentlyViewed error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

import mongoose from "mongoose";
import Listing from "../models/listingModels.js";
import User from "../models/User.js";

// GET /api/dashboard/owner
export const getOwnerDashboardAnalytics = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Fetch listing status breakdowns for this owner
    const listingStats = await Listing.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          totalListings: { $sum: 1 },
          availableListings: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$status", "available"] },
                    { $eq: ["$available", true] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          bookedListings: {
            $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] },
          },
          occupiedListings: {
            $sum: { $cond: [{ $eq: ["$status", "occupied"] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = listingStats[0] || {
      totalListings: 0,
      availableListings: 0,
      bookedListings: 0,
      occupiedListings: 0,
    };

    // 2. Fetch owner's listing IDs
    const ownerListings = await Listing.find({ owner: ownerId }).select("_id");
    const ownerListingIds = ownerListings.map((l) => l._id);

    // 3. Aggregate total wishlist count across all users for owner's listings
    let totalWishlistCount = 0;
    if (ownerListingIds.length > 0) {
      const wishlistStats = await User.aggregate([
        { $unwind: "$wishlist" },
        { $match: { wishlist: { $in: ownerListingIds } } },
        { $count: "count" },
      ]);
      totalWishlistCount = wishlistStats[0] ? wishlistStats[0].count : 0;
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalListings: stats.totalListings,
        availableListings: stats.availableListings,
        bookedListings: stats.bookedListings,
        occupiedListings: stats.occupiedListings,
        totalWishlistCount,
      },
    });
  } catch (error) {
    console.error("getOwnerDashboardAnalytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error loading dashboard analytics",
    });
  }
};

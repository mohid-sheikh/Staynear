import mongoose from "mongoose";
import Review from "../models/Review.js";
import Listing from "../models/listingModels.js";

// POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;

    if (!listingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide listingId, rating (1-5), and comment",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format",
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 1 and 5",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check for existing review by student for this listing
    const existingReview = await Review.findOne({
      student: req.user.id,
      listing: listingId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this listing",
      });
    }

    const review = await Review.create({
      rating: numericRating,
      comment: comment.trim(),
      student: req.user.id,
      listing: listingId,
    });

    const populatedReview = await Review.findById(review._id).populate(
      "student",
      "name profileImage"
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this listing",
      });
    }
    console.error("createReview error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET /api/reviews/:listingId
export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid listing ID format",
      });
    }

    const reviews = await Review.find({ listing: listingId })
      .populate("student", "name profileImage")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews
            ).toFixed(1)
          )
        : 0;

    res.status(200).json({
      success: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("getListingReviews error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID format",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (
      review.student.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

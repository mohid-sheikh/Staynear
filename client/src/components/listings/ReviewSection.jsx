import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getListingReviews,
  createReview,
  deleteReview,
} from "../../services/reviewService.js";
import { HiStar, HiTrash } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../common/Loader.jsx";

const ReviewSection = ({ listingId }) => {
  const { user, isAuthenticated, isStudent } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getListingReviews(listingId);
      if (res.success) {
        setReviews(res.reviews || []);
        setTotalReviews(res.totalReviews || 0);
        setAverageRating(res.averageRating || 0);
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listingId) {
      fetchReviews();
    }
  }, [listingId]);

  const hasReviewed = reviews.some(
    (rev) => rev.student?._id === user?._id || rev.student?.id === user?._id
  );

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview({
        listingId,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;

    try {
      const res = await deleteReview(reviewId);
      if (res.success) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete review");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-8">
      
      {/* Header & Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Student Reviews & Ratings
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified student residents
          </p>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-1 text-amber-500 text-xl font-black">
            <HiStar />
            <span>{averageRating > 0 ? averageRating : "N/A"}</span>
          </div>
          <span className="text-xs font-semibold text-blue-700">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      {isAuthenticated && isStudent ? (
        hasReviewed ? (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-medium text-emerald-800">
            ✅ You have already submitted a review for this accommodation.
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-slate-800">Write a Review</h4>
            
            {/* Star Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl transition-colors cursor-pointer"
                  >
                    <HiStar
                      className={
                        star <= (hoverRating || rating)
                          ? "text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 ml-2">
                {hoverRating || rating} / 5
              </span>
            </div>

            {/* Comment Textarea */}
            <div>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding food, Wi-Fi, cleanliness, owner behavior..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )
      ) : !isAuthenticated ? (
        <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center">
          Please log in as a student to leave a review.
        </div>
      ) : null}

      {/* Reviews List */}
      {loading ? (
        <Loader message="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-medium">
          No reviews yet. Be the first student to review this property!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isOwnReview =
              user?._id &&
              (rev.student?._id === user._id || rev.student?.id === user._id);

            return (
              <div
                key={rev._id}
                className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-2xl text-blue-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {rev.student?.name || "Student"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                      <HiStar />
                      <span className="text-slate-800 text-xs">{rev.rating}</span>
                    </div>

                    {isOwnReview && (
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        title="Delete your review"
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <HiTrash className="text-base" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ReviewSection;

import api from "./api.js";

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const getListingReviews = async (listingId) => {
  const response = await api.get(`/reviews/${listingId}`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

import api from "./api.js";

// Wishlist Services
export const getWishlist = async () => {
  const response = await api.get("/users/wishlist");
  return response.data;
};

export const addToWishlist = async (listingId) => {
  const response = await api.post(`/users/wishlist/${listingId}`);
  return response.data;
};

export const removeFromWishlist = async (listingId) => {
  const response = await api.delete(`/users/wishlist/${listingId}`);
  return response.data;
};

// Recently Viewed Services
export const getRecentlyViewed = async () => {
  const response = await api.get("/users/recent");
  return response.data;
};

export const addToRecentlyViewed = async (listingId) => {
  const response = await api.post(`/users/recent/${listingId}`);
  return response.data;
};

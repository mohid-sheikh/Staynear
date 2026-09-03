import api from "./api.js";

export const getAllListings = async (queryParams = {}) => {
  const response = await api.get("/listings", { params: queryParams });
  return response.data;
};

export const getSingleListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get("/listings/my-listings");
  return response.data;
};

export const createListing = async (formData) => {
  const response = await api.post("/listings", formData);
  return response.data;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/listings/${id}`, listingData);
  return response.data;
};

export const updateListingStatus = async (id, status) => {
  const response = await api.patch(`/listings/${id}/status`, { status });
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);
  return response.data;
};

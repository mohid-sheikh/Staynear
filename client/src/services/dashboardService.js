import api from "./api.js";

export const getOwnerAnalytics = async () => {
  const response = await api.get("/dashboard/owner");
  return response.data;
};

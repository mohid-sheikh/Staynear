import api from "./api.js";

export const createVisitRequest = async (visitData) => {
  const response = await api.post("/visits", visitData);
  return response.data;
};

export const getStudentVisitRequests = async () => {
  const response = await api.get("/visits/my-requests");
  return response.data;
};

export const getOwnerVisitRequests = async () => {
  const response = await api.get("/visits/owner-requests");
  return response.data;
};

export const updateVisitStatus = async (id, status) => {
  const response = await api.patch(`/visits/${id}/status`, { status });
  return response.data;
};

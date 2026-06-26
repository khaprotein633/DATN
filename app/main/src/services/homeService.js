import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getOverview = async () => {
  try {
    const response = await api.get("/home/overview");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy data thất bại"
    );
  }
};

export const getQuickAssessment = async (user_id) => {
  try {
    const response = await api.get(`/home/quickass/${user_id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy data thất bại"
    );
  }
};
export const getRecentActivities = async (user_id) => {
  try {
    const response = await api.get(`/home/recent/${user_id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy data thất bại"
    );
  }
};
export const getSubjectAccuracy = async (user_id) => {
  try {
    const response = await api.get(`/home/subAcc/${user_id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy data thất bại"
    );
  }
};


import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getStatistic = async () => {
  try {
    const response = await api.get(`/statistic/getall/`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy dữ liệu thất bại"
    );
  }
};
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getBySubjectId = async (user_id, subject_id) => {
  try {
    const response = await api.get(
      `/assessment/subject/${subject_id}/user/${user_id}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy dữ liệu thất bại"
    );
  }
};
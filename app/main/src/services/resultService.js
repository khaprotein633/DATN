import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getResultByID = async (id) => {
  try {
    const response = await api.get(`/result/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy kết quả bài thi");
  }
};

export const getAllByExam = async (exam_id) => {
  try {
    const response = await api.get(`/result/all/exam/${exam_id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy kết quả bài thi ");
  }
};

export const getResultHistoryByUser = async (user_id,page = 1,limit = 10) => {
  try {
    const response = await api.get(`/result/history/${user_id}/?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy tất cả lịch sử bài thi");
  }
};

export const getResultHistoryBySubject = async (user_id,subject_id,page = 1,limit = 10) => {
  try {
    const response = await api.get(
      `/result/history/${user_id}/subject/${subject_id}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy tất cả lịch sử bài thi theo môn");
  }
};

export const add = async (data) => {
  try {
    const response = await api.post(`/result/add/`,data);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi tạo kết quả bài thi");
  }
};
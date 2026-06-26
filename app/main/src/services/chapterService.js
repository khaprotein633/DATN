import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllChapter = async () => {
  try {
    const response = await api.get(`/chapter/all`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy chương");
  }
};

export const getChaperBySubject = async (subject_id) => {
  try {
    const response = await api.get(`/chapter/subject/${subject_id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy chương môn học");
  }
};

export const getListChaperBySubject = async (page = 1,limit = 10,search = "",subject_id) => {
  try {
    const response = await api.get(`/chapter/list/${subject_id}?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy chương môn học");
  }
};

export const getChaperByID = async (_id) => {
  try {
    const response = await api.get(`/chapter/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy chương");
  }
};

export const addChapter = async (data) => {
  try {
    const response = await api.post(`/chapter/add/`,data);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi thêm chương");
  }
};
export const updateChapter = async (data) => {
  try {
    const response = await api.put(`/chapter/update/`,data);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi chỉnh sửa chương");
  }
};
export const deleteChapter = async (chapter_id) => {
  try {
    const response = await api.delete(`/chapter/remove/${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi xoá chương");
  }
};
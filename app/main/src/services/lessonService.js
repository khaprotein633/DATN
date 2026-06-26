import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAllLesson = async () => {
  try {
    const response = await api.get(`/lesson/all`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy chương");
  }
};

export const getLessonByChapter = async (chapter_id) => {
  try {
    const response = await api.get(`/lesson/Chapter/${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài theo chương");
  }
};

export const getListLessonByChapter = async (page = 1,limit = 10,search = "",chapter_id) => {
  try {
    const response = await api.get(`/lesson/list/${chapter_id}?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    console.error("Get chapter error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài theo chương");
  }
};

export const getLessonByID = async (id) => {
  try {
    const response = await api.get(`/lesson/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get lesson error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài theo id");
  }
};

export const addLesson = async (data) => {
  try {
    const response = await api.post(`/lesson/add`,data);
    return response.data;
  } catch (error) {
    console.error("Get lesson error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi");
  }
};

export const updateLesson = async (data) => {
  try {
    const response = await api.put(`/lesson/update`,data);
    return response.data;
  } catch (error) {
    console.error("Get lesson error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi");
  }
};

export const deleteLesson = async (lesson_id) => {
  try {
    const response = await api.delete(`/lesson/remove/${lesson_id}`);
    return response.data;
  } catch (error) {
    console.error("Get lesson error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi");
  }
};


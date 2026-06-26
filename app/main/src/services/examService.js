import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getAll = async () => {
  try {
    const response = await api.get(`/exam/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get test error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài test");
  }
};

export const getList = async (page = 1, limit = 10,search = "",subject_id = "",created_by = "") => {
  try {
    const response = await api.get(`/exam/list?page=${page}&limit=${limit}&search=${search}&subject_id =${subject_id}&created_by=${created_by}`);

    return response.data;
  } catch (error) {
    console.error("Get exam list error:", error.response?.data || error.message
    );

    throw (
      error.response?.data ||
      new Error("Lỗi khi lấy danh sách đề thi")
    );
  }
};

export const getByID = async (id) => {
  try {
    const response = await api.get(`/exam/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get test error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài test");
  }
};

export const add = async (data) => {
  try {
    const response = await api.post(`/exam/add`, data);
    console.log("Add test response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get test error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi tạo test");
  }
};

export const removeExam = async (id) => {
  try {
    const response = await api.delete(`/exam/remove/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get test error:", error.response?.data || error.message);
    throw error.response?.data || new Error("Lỗi khi lấy bài test");
  }
};

import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getall = async () => {
  try {
    const response = await api.get("/subject/all");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy toàn bộ môn học thất bại"
    );
  }
};

export const getAllAndTotal = async () => {
  try {
    const response = await api.get("/subject/alltotal");

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy toàn bộ môn học thất bại"
    );
  }
};

export const getList = async (page = 1,limit = 10,search = "") => {
  try {
    const response = await api.get(`/subject/list?page=${page}&limit=${limit}&search=${search}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy list môn học thất bại"
    );
  }
};

export const getsubjectByid = async (id) => {
  try {
    const response = await api.get(`/subject/id/${id}`);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy thông tin môn học thất bại"
    );
  }
};

export const addSubject = async (data) => {
  try {
    const response = await api.post(`/subject/add`,data);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Thêm môn học thất bại"
    );
  }
};

export const updateSubject = async (data) => {
  try {
    const response = await api.put(`/subject/update`,data);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Chỉnh sửa môn học thất bại"
    );
  }
};

export const deleteSubject = async (subject_id) => {
  try {
    const response = await api.delete(`/subject/remove/${subject_id}`,);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xoá môn học thất bại"
    );
  }
};
import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getallUser = async (page = 1,limit = 10,search = "") => {
  try {

    const response = await api.get(`/user/all?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy tất cả người dùng thất bại"
    );
  }
};

export const getById = async (id) => {
  try {

    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Lấy thông tin người dùng thất bại"
    );
  }
};

export const updateUser = async (data) => {
  try {

    const response = await api.put(`/user/update`,data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Cập nhật thông tin người dùng thất bại"
    );
  }
};

export const updatePassword = async (data) => {
  try {

    const response = await api.put(`/user/change-password`,data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Cập nhật mật khẩu người dùng thất bại"
    );
  }
};
export const banUser = async (user_id) => {
  try {

    const response = await api.put(`/user/ban/${user_id}}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Khoá tài khoản thất bại"
    );
  }
};

export const deleteUser = async (id) => {
  try {

    const response = await api.delete(`/user/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Xoá thông tin người dùng thất bại"
    );
  }
};
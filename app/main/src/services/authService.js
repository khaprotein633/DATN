import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export const login = async (email, password) => {
  try {
    console.log("data:",{email,
      password})
    const response = await api.post("/user/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đăng nhập thất bại"
    );
  }
};
export const register = async ( name, email, password,role) => {
  try {
    const response = await api.post("/user/add", { name, email, password ,role});
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data.message);
    throw error.response?.data.message || "Đăng ký thất bại";
  }
};
export const logout = async () => {
  try {
    await api.get("/user/logout");
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error.response?.data.message || "đăng xuất thất bại";
  }
};
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("/user/forgot", { email});

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "lỗi khi gửi mail otp"
    );
  }
};
export const verifyOtp = async (email,otp) => {
  try {
    const response = await api.post("/user/verify", { email, otp});

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "xác nhận otp thất bại"
    );
  }
};
export const resetPassword = async (email,newPassword) => {
  try {
    const response = await api.put("/user/reset", { email, newPassword});

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đổi mật khẩu thất bại"
    );
  }
};
export const checkAuth = async () => {
  try {
    const response = await api.get("/user/authcheck", {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch (error) {
    console.warn(" Check auth failed:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error("Lỗi khi kiểm tra trạng thái đăng nhập!");
  }
};

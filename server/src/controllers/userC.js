const userServices = require("../services/userS");
const { generateToken } = require("../middlewares/middlewares")
const User = require("../models/userM")

const getAll = async (req, res) => {
  try {
    const { page = 1,limit = 10, search= ""} = req.query;
    const list = await userServices.getAll(Number(page) ,Number(limit),search);
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await userServices.getById(id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const add = async (req, res) => {
  try {
    console.log("data:",req.body)
    const user = await userServices.add(req.body);

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công",
      data: user
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const update = async (req, res) => {
  try {
    const user = await userServices.update(req.body);

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      data: user
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { user_id, newPassword ,oldPassword} = req.body;
    const user = await userServices.updatePassword(user_id,oldPassword,newPassword);

    res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      user
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
   const user = await userServices.banUser(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);

    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await userServices.remove(id);

    res.status(200).json({
      success: true,
      message: "Xóa thành công"
    });
  } catch (error) {
    console.error("Error:", error);

    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// auth
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userServices.login(email, password);

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      success: true,
      message: "Đăng xuất thành công"
    });

  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const checkAuth = async (req,res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    return res.status(200).json({
      success: true,
      info: user,
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userServices.forgotPassword(email);

    res.status(200).json({
      success: true,
      message:user.message,
      user
    });

  } catch (error) {
    console.error("send email error:", error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userServices.verifyOtp(email, otp);

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("verify error:", error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userServices.resetPassword(email, newPassword);

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("reset password error:", error);

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  getAll,
  getById,
  add,
  update,
  updatePassword,
  banUser,
  remove,
  login,
  logout,
  checkAuth,
  forgotPassword,
  verifyOtp,
  resetPassword
};
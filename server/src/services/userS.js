const User = require("../models/userM");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../services/mailService")


const getAll = async ( page = 1,limit = 10,search = "") => {

  const query = {};

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const total =
    await User.countDocuments(query);

  const users = await User
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getById = async (_id) => {
  const u = await User.findById(_id);

  if (!u) throw new Error("User not found");

  return u;
};

const add = async (data) => {
  const exists = await User.findOne({
    email: data.email,
  });

  if (exists) {
    throw new Error("Email đã được sử dụng");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || "user",
    isActive:true
  });

  return newUser;
};

const login = async (email, password) => {
  const u = await User.findOne({ email });

  if (!u) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }



  const isMatch = await bcrypt.compare(
    password,
    u.password
  );

  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }
  if (!u.isActive) {
    throw new Error("Tài khoản đã bị khóa");
  }
  return u;
};

const update = async (data) => {
  const oldUser = await User.findById(data._id);

  if (!oldUser) {
    throw new Error("User not found");
  }

  oldUser.name = data.name;
  oldUser.email = data.email;
  oldUser.role = data.role;

  await oldUser.save();

  return oldUser;
};

const updatePassword = async (user_id, oldPassword, newPassword) => {
  const user = await User.findById(user_id);

  if (!user) {
    throw new Error("User không tồn tại");
  }

  const isMatch = await bcrypt.compare(
    oldPassword,
    user.password
  );
  console.log("data:", { user_id, oldPassword, newPassword });
  if (!isMatch) {
    throw new Error("Sai mật khẩu hiện tại");
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return {
    message: "Đổi mật khẩu thành công",
  };
};

const remove = async (_id) => {
  const u = await User.findById(_id);

  if (!u) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(_id);

  return {
    message: "User deleted successfully",
  };
};

const banUser = async (id) => {
  const u = await User.findById(id);

  if (!u) {
    throw new Error("User not found");
  }
  u.isActive = !u.isActive;
  await u.save();

  return u;
};

const forgotPassword = async (email) => {

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email chưa được đăng ký");
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.resetOtp = otp;
  user.resetOtpExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  await sendOtpEmail(email, otp);

  return {
    message: "OTP đã được gửi"
  };
};


const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User không tồn tại");
  }

  if (user.resetOtp !== otp) {
    throw new Error("OTP không đúng");
  }

  if (user.resetOtpExpire < Date.now()) {
    throw new Error("OTP đã hết hạn");
  }

  return true;
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User không tồn tại");
  }

  const isMatch = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (isMatch) {
    throw new Error("Mật khẩu giống với mật khẩu cũ");
  }

  const hashedPassword =
    await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  user.resetOtp = null;
  user.resetOtpExpire = null;

  await user.save();

  return {
    message: "Đổi mật khẩu thành công",
  };
};

module.exports = {
  getAll,
  getById,
  add,
  login,
  update,
  updatePassword,
  banUser,
  remove,
  forgotPassword,
  verifyOtp,
  resetPassword
};
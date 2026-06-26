import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import {
  Input,
  Button,
  Alert,
  Typography,
} from "antd";

import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Vui lòng nhập họ và tên");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không đúng định dạng");
      return;
    }

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== passwordC) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      const res = await register(
        name.trim(),
        email.trim(),
        password,
        "student"
      );

      navigate("/auth/login");
      toast.success(res.message)
    } catch (err) {
      console.log("err:", err)
      setError(
        err|| "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Title
          level={2}
          className="!mb-2 !text-slate-800"
        >
          Đăng ký tài khoản
        </Title>

        <Text className="text-slate-500">
          Tạo tài khoản để bắt đầu sử dụng QuizMaster
        </Text>
      </div>

      {/* Error */}
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          className="mb-6"
        />
      )}

      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        {/* Họ tên */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Họ và tên
          </label>

          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="!rounded-xl"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Email
          </label>

          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!rounded-xl"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Mật khẩu
          </label>

          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="!rounded-xl"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Xác nhận mật khẩu
          </label>

          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu"
            value={passwordC}
            onChange={(e) => setPasswordC(e.target.value)}
            className="!rounded-xl"
          />
        </div>

        {/* Submit */}
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          block
          className="
          !h-12
          !rounded-xl
          !font-medium
        "
        >
          Đăng ký
        </Button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="flex-1 h-px bg-slate-200" />

        <span className="px-4 text-sm text-slate-400">
          QuizMaster
        </span>

        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Login */}
      <div className="text-center">
        <span className="text-slate-500">
          Đã có tài khoản?
        </span>

        <Link
          to="/auth/login"
          className="
          ml-2
          font-semibold
          text-indigo-600
          hover:text-indigo-700
        "
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
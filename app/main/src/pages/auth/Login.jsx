
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Input,
  Button,
  Alert,
  Typography,
} from "antd";

import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import { toast } from "react-toastify";

import { login } from "../../services/authService";
import { AuthContext } from "../../contexts/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      loginUser(data.user);

      const role = data?.user?.role;

      toast.success(data.message);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
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
          Đăng nhập
        </Title>

        <Text className="text-slate-500">
          Chào mừng quay trở lại
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

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >
        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700">
            Email
          </label>

          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="Nhập email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="!rounded-xl"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-700">
              Mật khẩu
            </label>

            <Link
              to="/auth/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
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
          Đăng nhập
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

      {/* Register */}
      <div className="text-center">
        <span className="text-slate-500">
          Chưa có tài khoản?
        </span>

        <Link
          to="/auth/register"
          className="
            ml-2
            font-semibold
            text-indigo-600
            hover:text-indigo-700
          "
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

export default Login;


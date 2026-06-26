
import { useEffect, useState } from "react";
import {
  Mail,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, verifyOtp, resetPassword } from "../../services/authService"

import { toast } from "react-toastify";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(0);

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);


  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await forgotPassword(email);

      toast.success(res.message)
      setCountdown(60);
      setStep(2);
    } catch (error) {
      toast.warning(error.message || "Gửi OTP thất bại")

    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await forgotPassword(email);

      toast.success("Đã gửi lại mã OTP");

      setCountdown(60);
    } catch (error) {
      toast.error(
        error.message || "Gửi lại OTP thất bại"
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await verifyOtp(email, otp);

      toast.success(res.message)

      setStep(3);


    } catch (error) {
      toast.error(error.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.warning("Mật khẩu xác nhận không khớp");
    }

    try {
      setLoading(true);

      const res = await resetPassword(email, password);

      toast.success(res.message||"Đổi mật khẩu thành công, hãy quay lại đăng nhập");

      setTimeout(() => {
        navigate("/auth/login");
      }, 5000);
    } catch (error) {
      toast.error(error.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="p-12 flex flex-col justify-center">
      <div className="mb-6">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
          QuizMaster
        </span>
      </div>
      <div className="text mb-8">
        <h1 className="text-3xl font-bold text-600">
          Quên mật khẩu
        </h1>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex justify-between mb-8">
        <div
          className={`flex-1 h-2 rounded ${step >= 1 ? "bg-blue-500" : "bg-gray-200"
            }`}
        />

        <div className="w-2" />

        <div
          className={`flex-1 h-2 rounded ${step >= 2 ? "bg-blue-500" : "bg-gray-200"
            }`}
        />

        <div className="w-2" />

        <div
          className={`flex-1 h-2 rounded ${step >= 3 ? "bg-blue-500" : "bg-gray-200"
            }`}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Nhập email"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Đang gửi..." : "Gửi OTP"}
          </button>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Mã OTP
            </label>

            <div className="relative">
              <ShieldCheck
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value)
                }
                placeholder="Nhập OTP"
                required
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end mt-3">
              {countdown > 0 ? (
                <span className="text-sm text-gray-500">
                  Gửi lại sau {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Gửi lại OTP
                </button>
              )}
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading
              ? "Đang xác thực..."
              : "Xác nhận OTP"}
          </button>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form
          onSubmit={handleResetPassword}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Mật khẩu mới
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                required
                className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Xác nhận mật khẩu
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Nhập lại mật khẩu"
                required
                className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading
              ? "Đang cập nhật..."
              : "Đổi mật khẩu"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          className="text-blue-600 hover:underline"
        >
          Quay lại đăng nhập
        </Link>
      </div>

    </div>
  );
};

export default ForgotPassword;
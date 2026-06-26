import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Tabs,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { Modal, Skeleton } from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";

import { getById, updateUser, updatePassword } from "../../services/userService";
import { logout } from "../../services/authService";
import { toast } from "react-toastify";

import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user, authLoading, loginUser, logoutUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeTab, setActiveTab] = useState("1");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    setName(user.name);
    setEmail(user.email);
  }, [user, authLoading, navigate]);


  const avatarLetter = user?.name
    ?.trim()
    ?.split(" ")
    ?.pop()
    ?.charAt(0)
    ?.toUpperCase();

  const Dangxuat = () => {
    Modal.confirm({
      title: "Đăng xuất",
      content: `Bạn chắc muốn đăng xuất chứ?`,
      okText: "Đăng xuất",
      cancelText: "quay lại",
      onOk() {
        handleLogout();
      },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Đăng xuất thành công");
      logoutUser();
      navigate("/student/home");
    } catch (error) {
      console.log("ERR:", error);
      toast.error(error);
    }

  }

  const Capnhat = () => {
    Modal.confirm({
      title: "Cập nhật thông tin",
      content: "Bạn chắc chắn muốn cập nhật?",
      okText: "Cập nhật",
      cancelText: "Hủy",
      onOk: handleUpdate,
    });
  };

  const handleUpdate = async () => {
    try {
      if (!name.trim()) {
        toast.warning("Vui lòng nhập họ tên");
        return;
      }

      if (name.trim().length < 2) {
        toast.warning("Họ tên quá ngắn");
        return;
      }

      setLoading(true);

      const payload = {
        _id: user._id,
        name: name.trim(),
        email: user.email,
        role: user.role
      };

      const updatedUser = await updateUser(payload);

      toast.success("Cập nhật thành công");

      // cập nhật context
      loginUser(updatedUser);

      // reload để lấy dữ liệu mới nhất
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
        "Cập nhật thất bại"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleChangePassword = async () => {
    try {
      if (!oldPassword) {
        toast.warning("Nhập mật khẩu hiện tại");
        return;
      }

      if (!newPassword) {
        toast.warning("Nhập mật khẩu mới");
        return;
      }

      if (!confirmPassword) {
        toast.warning("Nhập xác nhận mật khẩu");
        return;
      }

      if (newPassword.length < 6) {
        toast.warning(
          "Mật khẩu mới tối thiểu 6 ký tự"
        );
        return;
      }

      if (oldPassword === newPassword) {
        toast.warning(
          "Mật khẩu mới phải khác mật khẩu cũ"
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.warning(
          "Xác nhận mật khẩu không khớp"
        );
        return;
      }

      setLoading(true);
      const user_id = user._id

      console.log("data:",{user_id,
        oldPassword,
        newPassword})
      await updatePassword({
        user_id,
        oldPassword,
        newPassword,
      });

      toast.success(
        "Đổi mật khẩu thành công"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
        "Đổi mật khẩu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const DoiMatKhau = () => {
    Modal.confirm({
      title: "Đổi mật khẩu",
      content: "Bạn chắc chắn muốn đổi mật khẩu?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: handleChangePassword,
    });
  };

  if (authLoading || loading) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <Card>
          <div className="flex items-center gap-4">
            <Skeleton.Avatar active size={80} />

            <div className="flex-1">
              <Skeleton.Input
                active
                style={{ width: 200 }}
              />

              <div className="mt-3">
                <Skeleton.Input
                  active
                  style={{ width: 300 }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <Card className="rounded-2xl shadow-sm">
        <Row gutter={24} align="middle">
          <Col>
            <Avatar
              size={100}
              style={{
                backgroundColor: "#6366f1",
                fontSize: 36,
              }}
            >
              {avatarLetter}
            </Avatar>
          </Col>

          <Col flex={1}>
            <h2 className="text-2xl font-bold mb-2">
              {user.name}
            </h2>

            <p className="text-gray-500 mb-2">
              {user.email}
            </p>

            <Tag color="green">
              {user.role === "admin"
                ? "Admin"
                : "Học viên"}
            </Tag>
          </Col>

          <Col>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={Dangxuat}
            >
              Đăng xuất
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="mt-6 rounded-2xl">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "1",
              label: "Thông tin cá nhân",
              children: (
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Họ tên">
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item label="Email">
                        <Input
                          disabled
                          value={email}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider />

                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    loading={loading}
                    onClick={Capnhat}
                  >
                    Cập nhật thông tin
                  </Button>
                </Form>
              ),
            },

            {
              key: "2",
              label: "Đổi mật khẩu",
              children: (
                <Form layout="vertical">
                  <Form.Item label="Mật khẩu hiện tại">
                    <Input.Password
                      value={oldPassword}
                      onChange={(e) =>
                        setOldPassword(e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Mật khẩu mới">
                    <Input.Password
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Xác nhận mật khẩu">
                    <Input.Password
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    loading={loading}
                    onClick={DoiMatKhau}
                  >
                    Đổi mật khẩu
                  </Button>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default Profile;
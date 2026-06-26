import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Input,
  Space,
  Button,
  Tag,
  Avatar,
  Typography,
  Popconfirm,
  Pagination,
  Form,
  Modal,
  Select,
  Drawer,
  Descriptions,
message
} from "antd";

import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined
} from "@ant-design/icons";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import { getallUser, updateUser, banUser } from "../../services/userService";
import { register } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import UserManagementSkeleton from "./skeleton/UserManagementSkeleton";

const { Title } = Typography;

const UserManagement = () => {

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const [openView, setOpenView] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchUsers();
  }, [currentPage, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      const res = await getallUser(
        currentPage,
        10,
        debouncedSearch
      );

      setUsers(res.users);
      setPagination(res.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUser = async (values) => {
    
    try {
      const res = await register(
        values.name.trim(),
      values.email.trim(),
      values.password,
      values.role
      );
      
      toast.success("Tạo tài khoản mới thành công!")
      form.resetFields();
      setOpenModal(false);
      fetchUsers()
    } catch (err) {
      console.log("err:",err)
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "thất bại"
      );
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await banUser(id);

      message.success(
        "Cập nhật trạng thái thành công"
      );

      fetchUsers();
    } catch (error) {
      message.error(
        "Cập nhật trạng thái thất bại"
      );
    }
  };

  const columns = [
    {
      title: "Người dùng",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {record.name}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="red">Admin</Tag>
        ) : (
          <Tag color="blue">User</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">
            Hoạt động
          </Tag>
        ) : (
          <Tag color="red">
            Đã khóa
          </Tag>
        ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setOpenView(true);
            }}
          >
            Xem
          </Button>


          <Popconfirm
            title={
              record.isActive
                ? "Khóa tài khoản?"
                : "Mở khóa tài khoản?"
            }
            onConfirm={() =>
              handleToggleStatus(record._id)
            }
          >
            <Button
              danger={record.isActive}
              type={
                record.isActive
                  ? "default"
                  : "primary"
              }
            >
              {record.isActive
                ? "Khóa"
                : "Mở khóa"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];
  if (loading) {
    return <UserManagementSkeleton />;
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-5">
          <Title level={3} style={{ margin: 0 }}>
            Quản lý người dùng
          </Title>

          <Space>
            <Input
              allowClear
              placeholder="Tìm tên hoặc email..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpenModal(true)}
            >
              Tạo tài khoản
            </Button>
          </Space>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={users}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
          }}
        />
        {/* <div className="mt-5">
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            showSizeChanger={false}
            onChange={(page) =>
              setCurrentPage(page)
            }
          />
        </div> */}
      </Card>

      {/* xem chi tiết user */}
      <Drawer
        title="Thông tin người dùng"
        width={500}
        open={openView}
        onClose={() => {
          setOpenView(false);
          setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <div className="space-y-5">
            <div className="flex flex-col items-center">
              <Avatar
                size={80}
                icon={<UserOutlined />}
              />

              <h2 className="mt-3 text-xl font-semibold">
                {selectedUser.name}
              </h2>

              <Tag
                color={
                  selectedUser.role === "admin"
                    ? "red"
                    : "blue"
                }
              >
                {selectedUser.role.toUpperCase()}
              </Tag>
            </div>

            <Descriptions
              bordered
              column={1}
              size="middle"
            >
              <Descriptions.Item label="Họ tên">
                {selectedUser.name}
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {selectedUser.email}
              </Descriptions.Item>

              <Descriptions.Item label="Vai trò">
                {selectedUser.role}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {selectedUser.isActive
                  ? "Hoạt động"
                  : "Đã khoá"}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {new Date(
                  selectedUser.createdAt
                ).toLocaleString("vi-VN")}
              </Descriptions.Item>

              <Descriptions.Item label="ID">
                {selectedUser._id}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* tạo tài khoản mới         */}
      <Modal
        title="Tạo tài khoản mới"
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Tạo tài khoản"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ tên",
              },
            ]}
          >
            <Input placeholder="Nhập họ tên..." />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
              {
                min: 6,
                message: "Tối thiểu 6 ký tự",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Form.Item
            label="Quyền"
            name="role"
            initialValue="user"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn quyền",
              },
            ]}
          >
            <Select>
              <Select.Option value="user">
                User
              </Select.Option>

              <Select.Option value="admin">
                Admin
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
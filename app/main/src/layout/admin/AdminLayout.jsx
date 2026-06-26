import React, { useState } from "react";
import { Outlet, useNavigate, useLocation,Navigate } from "react-router-dom";

import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Spin
} from "antd";

import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  BookTwoTone,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import {useAuth} from "../../contexts/AuthContext"

const { Header, Sider, Content } = Layout;
const { Text } = Typography;


const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const { user,authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (authLoading) {
    return <Spin fullscreen />;
  }
  console.log("user:",user);
   if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/student" replace />;
  }
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "/admin/subject",
      icon: <BookTwoTone />,
      label: "Môn học",
    },
    {
      key: "/admin/question",
      icon: <BookOutlined />,
      label: "Câu hỏi",
    },
    {
      key: "/admin/exam",
      icon: <FileTextOutlined />,
      label: "Đề thi",
    }
  ];

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Đăng xuất",
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          {collapsed ? "CMS" : "QuizMaster Admin"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
          />

          <Dropdown menu={userMenu} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <Avatar icon={<UserOutlined />} />
              <Text strong>{user ? user.name : "Admin"}</Text>
            </div>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 20,
            padding: 20,
            background: "#fff",
            borderRadius: 12,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
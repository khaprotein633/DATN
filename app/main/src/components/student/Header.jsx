import {
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  HistoryOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Avatar, Button, Drawer } from "antd";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [open, setOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const menus = [
    {
      name: "Trang chủ",
      path: "/student",
      icon: <HomeOutlined />,
      end: true,
    },
    {
      name: "Luyện tập",
      path: "/student/practice",
      icon: <BookOutlined />,
    },
    {
      name: "Sinh đề",
      path: "/student/create/test",
      icon: <FileTextOutlined />,
    },
    {
      name: "Đánh giá",
      path: "/student/assessment",
      icon: <BarChartOutlined />,
    },
    {
      name: "Lịch sử",
      path: "/student/history",
      icon: <HistoryOutlined />,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <NavLink
            to="/student"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md">
              Q
            </div>

            <div>
              <p className="text-lg font-bold text-slate-800">
                QuizMaster
              </p>
              <p className="text-xs text-slate-500">
                Online Practice
              </p>
            </div>
          </NavLink>

          {/* Desktop */}
          <nav className="hidden items-center gap-2 lg:flex">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 transition ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">

            <Avatar
              size={42}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 transition hover:scale-105"
              onClick={() =>
                navigate(user ? "/student/profile" : "/auth/login")
              }
            >
              {user ? getInitials(user.name) : <UserOutlined />}
            </Avatar>

            <Button
              className="lg:hidden"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setOpen(true)}
            />
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        placement="right"
        open={open}
        width={300}
        title="QuizMaster"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-2">
          {menus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-100"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default Header;
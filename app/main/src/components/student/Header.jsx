import { Menu, Bell, X } from "lucide-react";
import { useState, useContext } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";

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
    },
    {
      name: "Luyện tập",
      path: "/student/practice",
    },
    {
      name: "Sinh đề",
      path: "/student/create/test",
    },
    {
      name: "Đánh giá",
      path: "/student/assessment",
    },
    {
      name: "Lịch sử",
      path: "/student/history",
    }

  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-16 px-4 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <NavLink
            to="/student"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              Q
            </div>

            <span className="font-bold text-slate-800">
              QuizMaster
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-2">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-xl hover:bg-slate-100"
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            

            <div
              onClick={() => {
                if (!user) {
                  navigate("/auth/login");
                } else {
                  navigate("/student/profile");
                }
              }}
              className="cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-center font-semibold">
                {user ? getInitials(user.name) : "?"}
              </div>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition ${open ? "visible" : "invisible"
          }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 ${open ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-[280px] bg-white transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b">
            <span className="font-semibold">
              Menu
            </span>

            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {menus.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-slate-100"
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
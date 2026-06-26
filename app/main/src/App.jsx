
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MainLayout from "./layout/user/MainLayout";
import Home from './pages/user/Home';
import CreateExam from './pages/user/CreateExam';
import Exam from './pages/user/Exam';
import Result from './pages/user//result/Result';
import Profile from './pages/user/Profile';

import AdminLayout from "./layout/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import QuestionManagement from "./pages/admin/QuestionManagement";
import User from "./pages/admin/UserManagement";

import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthLayout from "./layout/auth/AuthLayout";

import { Slide, ToastContainer } from 'react-toastify';
import History from "./pages/user/History";
import Assessment from "./pages/user/Assessment";
import UserManagement from "./pages/admin/UserManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ExamManagement from "./pages/admin/ExamManagement";
import Question from "./pages/admin/Question";

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route path="/student" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="create/test" element={<CreateExam />} />
            <Route path="result/:id" element={<Result />} />
            <Route path="profile" element={<Profile />} />
            <Route path="history" element={<History />} />
            <Route path="assessment" element={<Assessment />} />
          </Route>
          <Route path="/exam/:id" element={<Exam />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="question/:id" element={<QuestionManagement />} />
            <Route path="question" element={<Question />} />
            <Route path="user" element={<UserManagement />} />
            <Route path="subject" element={<SubjectManagement />} />
            <Route path="exam" element={<ExamManagement />} />
          </Route>

        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
    </>
  )
}

export default App

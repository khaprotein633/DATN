
import React from "react";
import { Outlet } from "react-router-dom";
import {
  ReadOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl min-h-[300px] bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-blue-600 p-12 text-white relative overflow-hidden">

          {/* Background circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                <BookOutlined className="text-3xl" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  QuizMaster
                </h1>

                <p className="text-indigo-100">
                  Online Examination System
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-5xl font-bold leading-tight">
                Nâng cao<br />
                 hiệu quả
                
                học tập 
              </h2>

              <p className="mt-6 text-lg text-indigo-100 max-w-lg">
                Hệ thống luyện tập và đánh giá kiến thưc bằng hình thức trắc nghiệm              </p>
            </div>
          </div>

          {/* <div className="relative z-10 grid grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <BookOutlined className="text-2xl mb-2" />
              <div className="text-xl font-bold">1000+</div>
              <div className="text-sm text-indigo-100">
                Câu hỏi
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <FileTextOutlined className="text-2xl mb-2" />
              <div className="text-xl font-bold">500+</div>
              <div className="text-sm text-indigo-100">
                Đề thi
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <TrophyOutlined className="text-2xl mb-2" />
              <div className="text-xl font-bold">99%</div>
              <div className="text-sm text-indigo-100">
                Chính xác
              </div>
            </div>
          </div> */}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-8 md:p-12 bg-white">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;


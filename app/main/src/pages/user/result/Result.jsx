import React from "react";
import { useState, useEffect } from "react";

import {
  Card,
  Statistic,
  Progress,
  Tag,
  Button,
  Divider,
  Skeleton,
  Segmented
} from "antd";

import {
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import { green, red, gray } from "@ant-design/colors";

import { useNavigate, useParams } from "react-router-dom";

import QuestionDetailModal from "../result/QuestionDetailModal";

import { getResultByID } from "../../../services/resultService"

import { useAuth } from "../../../contexts/AuthContext"

const Result = () => {

  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});


  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [openDetailQuestion, setOpenDetailQuestion] = useState(false);

  const [viewMode, setViewMode] = useState("chapter");




  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await getResultByID(id);
        setResult(res.result);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  // câu hỏi đúng sai
  const correctCount = result.correctCount

  const wrongCount = result.wrongCount

  // thống kê, đánh giá
  const phantramtong = [
    {
      name: "Đúng",
      value: result.correctPercentage
    },
    {
      name: "Sai",
      value: result.wrongPercentage
    },
    {
      name: "Bỏ qua",
      value: result.skippedPercentage
    }
  ];
  const COLORS = [
    "#16a34a",
    "#dc2626",
    "#9ca3af"
  ];

  const chunkSize = 20;

  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const colorChunks = chunkArray(COLORS, chunkSize);
  const handleReturnHome = () => {
    navigate("/student/home");
  }
  const handleLamLaiBaiThi = () => {
    navigate(`/exam/${result.exam_id}`)
  }

  // load giao diện
  if (loading || !result) {
    return (
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Kết quả bài thi
            </h1>
            <p className="text-gray-500 mt-1">
              Xem lại kết quả và đánh giá năng lực của bạn
            </p>
          </div>

          <div className="flex gap-3">
            <Button >
              Về trang chủ
            </Button>

            <Button type="primary">
              Làm lại bài thi
            </Button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border"
            >
              <Skeleton active />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 mt-6">

          <div className="col-span-2 bg-white rounded-2xl p-6 border">
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>

        </div>

      </div>
    );
  }
  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Kết quả
            </h1>
            <p className="text-gray-500 mt-1">
              Xem lại kết quả và đánh giá năng lực của bạn
            </p>
          </div>

          <div className="flex gap-3" >
            <Button onClick={handleReturnHome}>
              Về trang chủ
            </Button>

            <Button type="primary" onClick={handleLamLaiBaiThi}>
              Làm lại bài thi
            </Button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <Statistic
              title="Điểm số"
              value={result.score}
              suffix="/10"
              prefix={<TrophyOutlined />}
            />
          </Card>

          <Card>
            <Statistic
              title="Câu đúng"
              value={correctCount}
              prefix={<CheckCircleOutlined />}
            />
          </Card>

          <Card>
            <Statistic
              title="Câu sai"
              value={wrongCount}
              prefix={<CloseCircleOutlined />}
            />
          </Card>

          <Card>
            <Statistic
              title="Thời gian"
              value={result.time}
              suffix="phút"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left */}
          <div className="xl:col-span-2 space-y-6">

            {/* Score */}
            <div>
              <Card title="Tổng quan kết quả">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Chart */}
                  <div className="flex flex-col items-center">

                    <PieChart width={240} height={240}>
                      <Pie
                        data={phantramtong}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {phantramtong.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index]}
                          />
                        ))}
                      </Pie>

                      <text
                        x="50%"
                        y="48%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-4xl font-bold fill-gray-800"
                      >
                        {result.correctPercentage}%
                      </text>

                      <text
                        x="50%"
                        y="60%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm fill-gray-500"
                      >
                        Chính xác
                      </text>
                    </PieChart>

                    <div className="flex gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-600" />
                        <span>{correctCount} đúng</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-600" />
                        <span>{wrongCount} sai</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span>{result.unansweredCount} bỏ qua</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Môn học */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <p className="text-sm text-slate-500">
                          Môn học
                        </p>

                        <p className="mt-3 text-lg font-semibold text-slate-800 leading-7">
                          {result.subject_name}
                        </p>
                      </div>

                      {/* Độ khó */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <p className="text-sm text-slate-500 mb-3">
                          Độ khó
                        </p>

                        {(() => {
                          
                          const difficultyConfig = {
                            easy: { color: "green", label: "Dễ" },
                            medium: { color: "orange", label: "Trung bình" },
                            hard: { color: "red", label: "Khó" },
                            all: { color: "blue", label: "Tất cả" } 
                          };

                         
                          const currentConfig = difficultyConfig[result.difficulty_mode] || { color: "red", label: "Khó" };

                          return (
                            <Tag
                              color={currentConfig.color}
                              style={{
                                fontWeight: 600,
                                padding: "5px 16px",
                                borderRadius: "999px",
                                fontSize: "14px",
                              }}
                            >
                              {currentConfig.label}
                            </Tag>
                          );
                        })()}
                      </div>

                      {/* Tổng số câu */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <p className="text-sm text-slate-500">
                          Tổng số câu
                        </p>

                        <p className="mt-2 text-4xl font-bold text-blue-600">
                          {result.totalQuestions}
                        </p>
                      </div>

                    </div>

                    {/* Nhận xét */}
                    <div className="mt-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-sm text-slate-500">
                        Nhận xét
                      </p>

                      <p className="mt-2 text-base font-medium text-slate-800">
                        {result.description}
                      </p>
                    </div>

                  </div>
                </div>
              </Card>
            </div>

            <Segmented
              options={[
                {
                  label: "Theo chương",
                  value: "chapter",
                },
                {
                  label: "Theo bài học",
                  value: "lesson",
                },
              ]}
              value={viewMode}
              onChange={setViewMode}
              className="mb-5"
            />
            {/* Chapter Analysis */} {/* Đánh giá theo Lesson */}
            {
              viewMode === "chapter" ? (
                <div>
                  <Card title="Thống kê theo chương">
                    <div className="space-y-6">
                      {result.chapter_stats.map((item, index) => {

                        const colors = [
                          ...Array(item.correct).fill(green[5]),
                          ...Array(item.wrong).fill(red[5]),
                          ...Array(item.skipped).fill(gray[4]),
                        ];

                        return (
                          <div key={index}>
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">
                                {item.chapter_name}
                              </span>


                              <div className="flex gap-3 text-sm">
                                <span className="text-green-600">
                                  Đúng: {item.correct}
                                </span>

                                <span className="text-red-600">
                                  Sai: {item.wrong}
                                </span>

                                <span className="text-gray-500">
                                  Bỏ qua: {item.skipped}
                                </span>
                              </div>
                            </div>

                            <Progress
                              percent={Math.round((item.correct / item.total) * 100)}
                              strokeColor={
                                item.correct / item.total >= 0.8
                                  ? "#52c41a"
                                  : item.correct / item.total >= 0.5
                                    ? "#faad14"
                                    : "#ff4d4f"
                              }
                            />

                            <span className="font-semibold text m-3">
                              {item.percentage}%
                            </span>
                            <p
                              className={`mt-2 text-sm 
                            ${item.percentage >= 80 ? "text-green-600" :
                                  item.percentage >= 50
                                    ? "text-orange-500"
                                    : "text-red-500"
                                }`}
                            >
                              {item.percentage >= 80
                                ? "Tốt"
                                : item.percentage >= 50
                                  ? "Trung bình"
                                  : "cần ôn tập"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              ) :

                (
                  <div>
                    <Card title="Thống kê theo bài học">
                      <div className="space-y-6">
                        {result.lesson_stats.map((item, index) => {

                          const colors = [
                            ...Array(item.correct).fill(green[5]),
                            ...Array(item.wrong).fill(red[5]),
                            ...Array(item.skipped).fill(gray[4]),
                          ];

                          return (
                            <div key={index}>
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">
                                  {item.lesson_name}
                                </span>

                                <div className="flex gap-3 text-sm">
                                  <span className="text-green-600">
                                    Đúng: {item.correct}
                                  </span>

                                  <span className="text-red-600">
                                    Sai: {item.wrong}
                                  </span>

                                  <span className="text-gray-500">
                                    Bỏ qua: {item.skipped}
                                  </span>
                                </div>
                              </div>

                              <Progress
                                percent={Math.round((item.correct / item.total) * 100)}
                                strokeColor={
                                  item.correct / item.total >= 0.8
                                    ? "#52c41a"
                                    : item.correct / item.total >= 0.5
                                      ? "#faad14"
                                      : "#ff4d4f"
                                }
                              />
                              <p
                                className={`mt-2 text-sm 
                            ${item.percentage >= 80 ? "text-green-600" :
                                    item.percentage >= 60
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                              >
                                {item.percentage >= 80
                                  ? "Tốt"
                                  : item.percentage >= 60
                                    ? "Khá"
                                    : "cần ôn tập"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                )
            }




          </div>

          {/* Right */}
          <div>
            <Card title="Chi tiết câu hỏi">

              <div className="grid grid-cols-5 gap-3">

                {result.answers.map((answer, index) => (
                  <button
                    key={answer.question_id}
                    onClick={() => setSelectedQuestion(answer)}
                  >
                    <div
                      className={` h-11 w-11 rounded-lg flex items-center justify-center font-semibold transition
                        ${answer.user_answer === "Chưa chọn"
                          ? "bg-gray-100 text-gray-700"
                          : answer.is_correct
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                      {index + 1}
                    </div>
                  </button>
                ))}
              </div>

              <Divider />

              <div className="space-y-3">

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded" />
                  <span>Đúng</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded" />
                  <span>Sai</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>Bỏ qua</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <QuestionDetailModal
        open={!!selectedQuestion}
        question={selectedQuestion}
        onClose={() => { setSelectedQuestion(null) }}
      />
    </div>
  );
};

export default Result;
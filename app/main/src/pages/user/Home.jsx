import React from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Statistic,
  List,
  Progress,
} from "antd";

import {
  PlusOutlined,
  BarChartOutlined,
  HistoryOutlined,
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RobotOutlined,
  RightOutlined,
  CheckCircleOutlined,
  FireTwoTone
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { getAllAndTotal } from "../../services/subjectService";
import { getOverview, getQuickAssessment, getRecentActivities, getSubjectAccuracy } from "../../services/homeService";
import { useState } from "react";
import { useEffect } from "react";


const Home = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [subjects, setSubjects] = useState([]);

  const [overview, setOverview] = useState({});

  const [quickAssessment, setQuickAssessment] = useState(null);

  const [subjectAccuracy, setSubjectAccuracy] = useState([]);

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    // data public
    fetchSubjectTotal();
    fetchOverview();
    // data cá nhân
    if (user) {
      fetchQuickAssessment();
      fetchSubjectAccuracy();
      fetchRecentActivities();
    }
  }, [user, authLoading]);

  const fetchSubjectTotal = async () => {
    try {
      const res = await getAllAndTotal();
      setSubjects(res);
      console.log("data:", res);
    } catch (error) {
      console.log("err:", error);
      toast.error("Lỗi khi lấy danh sách môn học");
    }
  }
  const fetchOverview = async () => {
    try {
      const res = await getOverview();
      setOverview(res);
    } catch (error) {
      console.log("err:", error);
      toast.error("Lỗi khi lấy overview");
    }
  }
  const fetchQuickAssessment = async () => {
    try {
      const res = await getQuickAssessment(user._id);
      setQuickAssessment(res.data);
      //console.log("getQuickAssessment:", res);
    } catch (error) {
      console.log("err:", error);
      toast.error("Lỗi khi lấy QuickAssessment");
    }
  }
  const fetchSubjectAccuracy = async () => {
    try {
      const res = await getSubjectAccuracy(user._id);
      setSubjectAccuracy(res);
      //console.log("SubjectAccuracy:", res);
    } catch (error) {
      console.log("err:", error);
      toast.error("Lỗi khi lấy QuickAssessment");
    }
  }
  const fetchRecentActivities = async () => {
    try {
      const res = await getRecentActivities(user._id);
      setRecentActivities(res.data);
      console.log("RecentActivities:", res);
    } catch (error) {
      console.log("err:", error);
      toast.error("Lỗi khi lấy QuickAssessment");
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-10 text-white shadow-xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold">
            Xin chào {user?.fullName || "bạn"} <FireTwoTone />
          </h1>

          <p className="mt-3 text-lg text-blue-100">
            Tiếp tục hành trình học tập và nâng cao năng lực của bạn.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate("/student/create/test")}
            >
              Làm bài ngay
            </Button>

            <Button
              size="large"
              ghost
              onClick={() => navigate("/student/practice")}
            >
              Luyện tập
            </Button>

            <Button
              size="large"
              ghost
              icon={<BarChartOutlined />}
              onClick={() => navigate("/student/assessment")}
            >
              Đánh giá
            </Button>
          </div>
        </div>
      </div>
      {/* SUBJECT */}
      <div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            Khám phá môn học
          </h2>

          <Button
            type="link"
            onClick={() => navigate("/student/practice")}
          >
            Xem tất cả →
          </Button>
        </div>

        <Row gutter={[20, 20]}>
          {subjects.map((subject) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              xl={6}
              key={subject._id}
            >
              <Card
                hoverable
                className="rounded-3xl h-full border-0 shadow-md hover:shadow-xl transition-all"
                bodyStyle={{ height: "100%" }}
              >
                <div className="flex flex-col h-full">
                  <div className="text-5xl mb-5">
                    {subject.icon}
                  </div>

                  <h3 className="text-xl font-semibold line-clamp-2 min-h-[56px]">
                    {subject.name}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {subject.totalQuestion} câu hỏi
                  </p>

                  <div className="mt-auto pt-5">
                    <Button
                      block
                      type="primary"
                      shape="round"
                      onClick={() => navigate(`/student/practice/subject/${subject._id}`)}
                    >
                      Xem
                    </Button>
                  </div>
                </div>
              </Card>

            </Col>

          ))}
        </Row>

      </div>
     
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Năng lực theo môn"
          >
            {subjectAccuracy?.length ?
              subjectAccuracy.map(item => (
                <div
                  key={item.subject_id}
                  className="mb-5"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">
                      {item.subject_name}
                    </span>
                    
                  </div>
                  <Progress percent={item.accuracy} />
                </div>
              ))
              :
              <p className="text-gray-400">
                Chưa có dữ liệu
              </p>
            }
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Tổng quan cá nhân">
            <Row gutter={[16, 16]}>

              <Col span={12}>
                <Statistic
                  title="Bài đã làm"
                  value={quickAssessment?.totalExam ?? "-"}
                  prefix={<FileTextOutlined style={{ fontSize: 20 }} />}
                  valueStyle={{ fontSize: 24 }}
                />
              </Col>

              <Col span={12}>
                <Statistic
                  title="Điểm TB"
                  value={quickAssessment?.avgScore ?? "-"}
                  prefix={<TrophyOutlined style={{ fontSize: 20 }} />}
                  valueStyle={{ fontSize: 24 }}
                />
              </Col>

              <Col span={12}>
                <Statistic
                  title="Chính xác"
                  value={quickAssessment?.accuracy ?? "-"}
                  suffix="%"
                  prefix={<CheckCircleOutlined style={{ fontSize: 20 }} />}
                  valueStyle={{ fontSize: 24 }}
                />
              </Col>

              <Col span={12}>
                <div>
                  <p className="text-gray-500 mb-2">
                    Môn nổi bật
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOutlined style={{ fontSize: 20 }} />

                    <span
                      className="truncate"
                      title={quickAssessment?.favoriteSubject?.name}
                    >
                      {quickAssessment?.favoriteSubject?.name ?? "-"}
                    </span>
                  </div>
                </div>
              </Col>

            </Row>
          </Card>
        </Col>
      </Row>

     
      <Card
        title="Lịch sử gần đây"
        extra={
          <Button onClick={() => navigate("/student/history")}>
            Xem tất cả →
          </Button>
        }
      >
        <List
          dataSource={recentActivities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span className="font-medium">
                    {item.title}
                  </span>
                }
                description={
                  item.subject
                }
              />
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  {item.score} điểm
                </span>
                <Progress
                  percent={item.score * 10}
                  size="small"
                  showInfo={false}
                  style={{
                    width: 100
                  }}
                />
              </div>
            </List.Item>
          )} />
      </Card>
    </div>
  );
};

export default Home;
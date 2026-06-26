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
  CheckCircleOutlined
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
      <Card
        bordered={false}
        className="overflow-hidden"
        bodyStyle={{
          padding: 0
        }}
      >
        <div className=" p-8 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl " >
          <Row
            align="middle"
            justify="space-between"
            gutter={[32, 32]}
          >
            <Col xs={24} lg={14}>

              <h1 className="text-4xl font-bold mb-3">
                Xin chào 👋
              </h1>
              <p className="text-lg opacity-90">
                Tiếp tục luyện tập và cải thiện
                năng lực học tập của bạn
              </p>

              <div className="mt-6 flex gap-3">
                <Button
                  size="large"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/student/create/test")}
                >
                  Làm bài mới
                </Button>
                <Button
                  size="large"
                  ghost
                  icon={<BarChartOutlined />}
                  onClick={() => navigate("/student/assessment")}
                >
                  Xem đánh giá
                </Button>
              </div>
            </Col>
            <Col xs={24} lg={8}>
              <Card className="shadow-lg" >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Môn học"
                      value={overview.totalSubjects}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Câu hỏi"
                      value={overview.totalQuestions}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Đề thi"
                      value={overview.totalExams}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Lượt làm"
                      value={overview.totalresults}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      {/* SUBJECT */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Môn học
          </h2>
          <Button type="link">
            Xem tất cả →
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {subjects.map(subject => (
            <Col xs={24} sm={12} lg={6} key={subject.name} >
              <Card
                hoverable
                className="text-center h-full"
              >
                <div className="text-4xl mb-3">
                  {subject.icon}
                </div>
                <h3 className="font-semibold text-lg">
                  {subject.name}
                </h3>
                <p className="text-gray-500">
                  {subject.totalQuestion} câu hỏi
                </p>
                <Button
                  type="link"
                  onClick={() => navigate("/student/create/test")}
                >
                  Làm bài →
                </Button>
              </Card>
            </Col>
          ))
          }
        </Row>
      </div>
      {/* STATISTIC */}
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
                    <span>
                      {item.accuracy}%
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
    <Row gutter={[16,16]}>

      <Col span={12}>
        <Statistic
          title="Bài đã làm"
          value={quickAssessment?.totalExam ?? "-"}
          prefix={<FileTextOutlined style={{fontSize:20}} />}
          valueStyle={{fontSize:24}}
        />
      </Col>

      <Col span={12}>
        <Statistic
          title="Điểm TB"
          value={quickAssessment?.avgScore ?? "-"}
          prefix={<TrophyOutlined style={{fontSize:20}} />}
          valueStyle={{fontSize:24}}
        />
      </Col>

      <Col span={12}>
        <Statistic
          title="Chính xác"
          value={quickAssessment?.accuracy ?? "-"}
          suffix="%"
          prefix={<CheckCircleOutlined style={{fontSize:20}} />}
          valueStyle={{fontSize:24}}
        />
      </Col>

      <Col span={12}>
        <div>
          <p className="text-gray-500 mb-2">
            Môn nổi bật
          </p>

          <div className="flex items-center gap-2 text-xl font-medium">
            <BookOutlined style={{fontSize:20}} />

            <span
              className="truncate max-w-[180px]"
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

      {/* RECENT */}
      <Card
        title="Lịch sử gần đây"
        extra={
          <Button  onClick={() => navigate("/student/history")}>
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
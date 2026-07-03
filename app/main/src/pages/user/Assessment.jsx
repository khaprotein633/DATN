import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  Progress,
  Tag,
  Collapse,
  Skeleton,
  List,
  Empty
} from "antd";

import {
  FileDoneOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  BulbOutlined,
} from "@ant-design/icons";


import { getBySubjectId } from "../../services/assessmentService"
import { getall } from "../../services/subjectService";
import AssessmentSkeleton from "../user/skeleton/AssessmentSkeleton"
import ProgressChart from "../user/ProgressChart"
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Assessment = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [data, setData] = useState({
    overview: {},
    progressChart: [],
    strongest: [],
    weaknesses: [],
    chapterStats: [],
    knowledgeStats: {},
    recommendations: [],
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/auth/login");
      return;
    }

    fetchAllSubject();

  }, [user, authLoading]);

  const fetchAllSubject = async () => {
    try {
      setLoading(true)
      const data = await getall();
      setSubjects(data.list || []);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Tạo đề thất bại")
    } finally {
      setLoading(false)
    }
  };
  console.log("data:", data);

  useEffect(() => {
    if (!selectedSubject) return;

    fetchAssessment(user._id, selectedSubject);
  }, [selectedSubject]);

  const fetchAssessment = async (user_id, subject_id) => {
    try {
      setLoading(true);
      const data = await getBySubjectId(user_id, subject_id);
      console.log("dataasse:", data.assessment);
      setData(data.assessment);
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Lấy đánh giá thất bại")
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return <AssessmentSkeleton />;
  }
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Đánh giá năng lực học tập
            </h1>

            <p className="text-slate-500 mt-2">
              Phân tích kết quả từ các kết quả gần nhất
            </p>
          </div>

          <Select
            size="large"
            placeholder="Chọn môn học"
            className="w-full lg:w-80"
            value={selectedSubject || undefined}
            onChange={setSelectedSubject}
            options={subjects.map((s) => ({
              label: s.name,
              value: s._id,
            }))}
          />
        </div>
      </div>

      {/* Overview */}
      <div className="mb-5">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all"
            >
              <Statistic
                title="Đề trắc nghiệm"
                value={data.overview.totalExams}
                prefix={<FileDoneOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all"
            >
              <Statistic
                title="Lượt làm bài"
                value={data.overview.totalAttempts}
                prefix={<FileDoneOutlined />}
              />
            </Card>
          </Col>

          {/* <Col xs={24} md={6}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all"
            >
              <Statistic
                title="Điểm trung bình"
                value={data.overview.avgScore}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col> */}

          <Col xs={24} md={6}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all"
            >
              <Statistic
                title="Điểm cao nhất"
                value={data.overview.bestScore}
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card
              bordered={false}
              className="rounded-2xl shadow-sm hover:shadow-lg transition-all"
            >
              <Statistic
                title="Điểm thấp nhất"
                value={data.overview.worstScore}
                prefix={<FallOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <div className="mb-5">
        <ProgressChart data={data.progressChart} />
      </div>
      {/* Summary */}
      <Card
        bordered={false}
        className="mt-4 rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <BulbOutlined className="text-indigo-600" />
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              Nhận xét tổng quát
            </h2>

            <p className="text-sm text-slate-500">
              Tổng hợp từ các 15 kết quả gần nhất của bạn trong môn học này
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5">
          <p className="leading-8 text-slate-700">
            {data.summary}
          </p>
        </div>
      </Card>

      {/* Strong Weak */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card
            title="Điểm mạnh"
            bordered={false}
            className="rounded-2xl shadow-sm"
          >
            {data.strongest.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.strongest.map((item) => (
                  <Tag
                    color="success"
                    className="px-3 py-1 rounded-full"
                    key={item}
                  >
                    {item}
                  </Tag>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">
                Chưa có chương nào đạt mức thành thạo.
              </p>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Cần cải thiện"
            bordered={false}
            className="rounded-2xl shadow-sm"
          >
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map((item) => (
                <Tag
                  color="error"
                  className="px-3 py-1 rounded-full"
                  key={item}
                >
                  {item}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      <div className="mt-5">
        {/* Chapter */}
        <Card
          title="Kết quả theo chương học"
          extra={
            <span className="text-gray-500 text-sm">
              Nhấn vào chương để xem chi tiết từng bài học
            </span>
          }
          bordered={false}
          className="mt-4 rounded-2xl shadow-sm"
        >
          <Collapse
            ghost
            items={data.chapterStats.map((chapter) => ({
              key: chapter.chapter_id,

              label: (
                <div className="w-full pr-6">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {chapter.chapter_name}
                      </div>

                      <div className="text-xs text-gray-500">
                        Độ chính xác: {chapter.mastery}% • {chapter.total} câu đã làm
                      </div>
                    </div>

                    <div
                      className={`font-semibold ${chapter.mastery >= 80
                        ? "text-green-600"
                        : chapter.mastery >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {chapter.mastery}%
                    </div>
                  </div>

                  <Progress
                    percent={chapter.mastery}
                    showInfo={false}
                    strokeColor={
                      chapter.mastery >= 80
                        ? "#22c55e"
                        : chapter.mastery >= 60
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                  />
                </div>
              ),

              children: (
                <div className="space-y-5">
                  {chapter.lessons.map((lesson) => (
                    <div key={lesson.lesson_name}>
                      <div className="flex justify-between mb-2">

                        <span>Bài {lesson.order}: {lesson.lesson_name}</span>
                        <div className="text-xs text-gray-500">
                          Độ chính xác: {lesson.mastery}% • {lesson.total} câu đã làm
                        </div>

                      </div>

                      <Progress
                        percent={lesson.mastery}
                        strokeColor={
                          lesson.mastery >= 80
                            ? "#22c55e"
                            : lesson.mastery >= 60
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                      />
                    </div>
                  ))}
                </div>
              ),
            }))}
          />
        </Card>
      </div>
      {/* Knowledge + Recommendation */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={12}>
          <Card
            title="Đánh giá kiến thức"
            bordered={false}
            className="rounded-2xl shadow-sm"
          >
            <div className="flex justify-around">
              <div className="text-center">
                <Progress
                  type="circle"
                  width={120}
                  percent={
                    data.knowledgeStats.concept
                  }
                />

                <p className="mt-3 font-medium">
                  Lý thuyết
                </p>
              </div>

              <div className="text-center">
                <Progress
                  type="circle"
                  width={120}
                  percent={
                    data.knowledgeStats.exercise
                  }
                />

                <p className="mt-3 font-medium">
                  Bài tập
                </p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Đánh giá theo độ khó"
            bordered={false}
            className="rounded-2xl shadow-sm"
          >

            <div className="space-y-5">

              <div>
                <div className="flex justify-between mb-2">
                  <span>Câu dễ</span>

                  <span className="font-semibold">
                    {data.difficultyStats?.easy.total || 0} câu
                  </span>
                </div>

                <Progress
                  percent={data.difficultyStats?.easy.mastery || 0}
                />
              </div>


              <div>
                <div className="flex justify-between mb-2">
                  <span>Câu trung bình</span>

                  <span className="font-semibold">
                    {data.difficultyStats?.medium.total || 0} câu
                  </span>
                </div>

                <Progress
                  percent={data.difficultyStats?.medium.mastery || 0}
                />
              </div>


              <div>
                <div className="flex justify-between mb-2">
                  <span>Câu khó</span>

                  <span className="font-semibold">
                    {data.difficultyStats?.hard.total || 0} câu
                  </span>
                </div>

                <Progress
                  percent={data.difficultyStats?.hard.mastery || 0}
                />
              </div>


            </div>

          </Card>
        </Col>
        <Col xs={24} >
          <Card
            title="Khuyến nghị học tập"
            bordered={false}
            className="rounded-2xl shadow-sm"
          >
            <List
              dataSource={data.recommendations}
              renderItem={(item) => (
                <List.Item>
                  <span className="text-slate-700">
                    ✓ {item}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Assessment;
import {
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Drawer,
  Table,
  Tag,
  Select,
  Input,
  Empty,
  Pagination
} from "antd";

import {
  TrophyOutlined,
  FireOutlined,
  BarChartOutlined
} from "@ant-design/icons";

import {
  SearchOutlined,
  HistoryOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import HistorySkeleton from "../user/skeleton/HistorySkeleton";
import { getall } from "../../services/subjectService";
import { getAllByExam, getResultHistoryBySubject, getResultHistoryByUser } from "../../services/resultService";
import { useAuth } from "../../contexts/AuthContext";

const History = () => {

  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("all");
  const [results, setResults] = useState([]);
  const [exam, setExam] = useState({});
  const [keyword, setKeyword] = useState("");

  const [history, setHistory] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const [currentPage, setCurrentPage] =
    useState(1);

  // MOCK SUBJECTS
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    console.log("user:", user);
    fetchAllSubject();
  }, [user]);

  const fetchAllSubject = async () => {
    try {
      const data = await getall();
      setSubjects(data.list || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchHistory();
  }, [currentPage, subject, user]);
  useEffect(() => {
    setCurrentPage(1);
  }, [subject]);

  const fetchHistory = async () => {
    try {
      let res;
      if (subject === "all") {
        res = await getResultHistoryByUser(user._id, currentPage, 10);
      } else {
        res = await getResultHistoryBySubject(user._id, subject, currentPage, 10);
      }
      setHistory(res.data);
      setPagination(res.pagination);


    } catch (error) {
      console.log(error);
    }
  };
  

  const fetchAllResultByExam = async (exam_id) => {
    try {
      const data = await getAllByExam(exam_id);
      setResults(data.list);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLamLai = (exam) => {
    console.log("Làm lại bài thi:", exam.exam_id);
       navigate(`/exam/${exam.exam_id}`);
  }

  const openHistory = (exam) => {
    setExam(exam);
    fetchAllResultByExam(exam.exam_id)
    setOpen(true);
  };

  const detailColumns = [
    {
      title: "Lần làm",
      align: "center",
      render: (_, record, index) => (
        <Tag color="blue">
          #{index + 1}
        </Tag>
      ),
    },

    {
      title: "Ngày làm",
      dataIndex: "createdAt",
      align: "center",
      render: (date) =>
        new Date(date).toLocaleDateString("vi-VN")
    },

    {
      title: "Điểm",
      dataIndex: "score",
      align: "center",

      render: (score) => {
        let color = "red";

        if (score >= 8) color = "green";
        else if (score >= 5) color = "gold";

        return (
          <Tag
            color={color}
            className="px-3 py-1 text-sm font-semibold"
          >
            {score}/10
          </Tag>
        );
      }
    },
  ];

  if (loading) {
    return <HistorySkeleton />;
  }
  return (
    <div className="p-6">
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Lịch sử bài
          </h1>

          <p className="text-gray-500 mt-1">
            Xem lại các bài trắc nghiệm đã thực hiện
            và tiếp tục ôn tập.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={subject}
            onChange={setSubject}
            className="min-w-[260px]"
          >

            <Select.Option value="all">
              Tất cả môn học
            </Select.Option>

            {subjects.map(subject => (

              <Select.Option
                key={subject._id}
                value={subject._id}
              >
                {subject.name}
              </Select.Option>

            ))}

          </Select>
          <Input
            allowClear
            placeholder="Tìm bài thi..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            className="min-w-[260px]"
          />

        </div>
      </div>

      {/* EXAMS */}

      <div className="mt-6 flex flex-col gap-4">
        {history.length === 0 ? (
          <Card>
            <Empty description="Không có dữ liệu" />
          </Card>
        ) : (
          history.map((exam) => (
            <Card
              key={exam.exam_id}
              className="shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag color="cyan">
                      {exam.subject_name}
                    </Tag>
                  </div>

                  <h2 className="text-lg font-semibold">
                    {exam.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Tag color="blue">
                      {exam.total_attempts} lần làm
                    </Tag>

                    <Tag color="green">
                      Cao nhất:{" "}
                      {exam.highest_score}
                    </Tag>

                    <Tag color="orange">
                      Thấp nhất:{" "}
                      {exam.lowest_score}
                    </Tag>


                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    icon={
                      <HistoryOutlined />
                    }
                    onClick={() =>
                      openHistory(exam)
                    }
                  >
                    Xem lịch sử
                  </Button>

                  <Button
                    type="primary"
                    icon={
                      <ReloadOutlined />
                    }
                    onClick={() => handleLamLai(exam)}
                  >
                    Làm lại
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* DRAWER */}

      <Drawer
        title={exam?.title}
        width={800}
        open={open}
        onClose={() => setOpen(false)}
      >
        {exam && (
          <>
            <Row gutter={[15, 15]}>
              <Col span={5}>
                <Card className="bg-blue-50 border-blue-200">
                  <Statistic
                    title="Số lần làm"
                    value={
                      exam.total_attempts
                    }
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </Col>

              <Col span={5}>
                <Card className="bg-green-50 border-green-200">
                  <Statistic
                    title="Cao nhất"
                    value={
                      exam.highest_score
                    }
                    prefix={<TrophyOutlined />}
                    suffix="/10"
                  />
                </Card>
              </Col>

              <Col span={5}>
                <Card className="bg-orange-50 border-orange-200">
                  <Statistic
                    title="Thấp nhất"
                    value={exam.lowest_score}
                    prefix={<FireOutlined />}
                    suffix="/10"
                  />
                </Card>
              </Col>
            </Row>
            <div className="mt-4">
              <Card
                title="Lịch sử các lần thi"

              >
                <Table
                  rowKey="key"
                  columns={detailColumns}
                  dataSource={
                    results
                  }
                  pagination={false}
                />
              </Card>
            </div>
          </>
        )}
      </Drawer>
      <div className="mt-5">
      <Pagination
        current={pagination.page}
        pageSize={pagination.limit}
        total={pagination.total}
        showSizeChanger={false}
        onChange={(page) =>
          setCurrentPage(page)
        }
      />
      </div>
    </div>
  );
};

export default History;
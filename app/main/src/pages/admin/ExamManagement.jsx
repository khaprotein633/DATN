import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Space,
  Button,
  Input,
  Select,
  Tag,
  Drawer,
  Descriptions,
  Collapse,
  List,
  Popconfirm,
  Row,
  Col,
  Statistic,
  message,
} from "antd";

import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  getList
} from "../../services/examService";

const { Title, Paragraph } = Typography;
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ExamManagement = () => {

  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);

  const [totalEasy, setTotalEasy] = useState(0);
  const [totalMedium, setTotalMedium] = useState(0);
  const [totalHard, setTotalHard] = useState(0);
  const [totalExam, setTotalExam] = useState(0);

  const [open, setOpen] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState({});
  //const [selected, setSelectedSubject] = useState({});
  const [loading, setLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchExams();
  }, [currentPage, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchExams();
  }, [currentPage, debouncedSearch]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await getList(currentPage,
        10,
        debouncedSearch, "", "");

      console.log("data:", res);
      setTotalEasy(res.statistics.totalEasy);
      setTotalMedium(res.statistics.totalMedium);
      setTotalHard(res.statistics.totalHard);
      setTotalExam(res.statistics.totalExam);

      setExams(res.exams);
      console.log("exam:", exams);
      setPagination(res.pagination);

    } catch (error) {

      console.log(error);

      message.error("Lỗi tải môn học");

    } finally {

      setLoading(false);

    }

  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "green";
      case "medium":
        return "orange";
      case "hard":
        return "red";
      default:
        return "default";
    }
  };

  const filteredData = exams.filter((item) => {
    const matchSearch = item.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchDifficulty =
      !difficulty ||
      item.difficulty_mode === difficulty;

    return matchSearch && matchDifficulty;
  });

  const columns = [
    {
      title: "Tên đề",
      render: (_, record) => (
        <div>
          <div className="font-semibold">
            {record.title}
          </div>

          <div className="text-gray-400 text-xs">
            {record.description}
          </div>
        </div>
      ),
    },

    {
      title: "Số câu",
      dataIndex: "total_question",
    },

    {
      title: "Thời gian",
      render: (_, record) =>
        `${record.time} phút`,
    },

    {
      title: "Độ khó",
      dataIndex: "difficulty_mode",

      render: (value) => (
        <Tag color={getDifficultyColor(value)}>
          {value.toUpperCase()}
        </Tag>
      ),
    },

    {
      title: "Người tạo",
      dataIndex: "created_by",
      render: (createdBy) => createdBy?.name || "-",
    },

    {
      title: "Ngày tạo",
      render: (_, record) =>
        new Date(
          record.createdAt
        ).toLocaleDateString("vi-VN"),
    },

    {
      title: "Thao tác",
      width: 180,

      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedExam(record);
              setOpen(true);
            }}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Title
          level={3}
          style={{ marginTop: 0 }}
        >
          Quản lý đề thi
        </Title>

        <Row
          gutter={[16, 16]}
          className="mb-5"
        >
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Tổng đề thi"
                value={totalExam}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Easy"
                value={totalEasy}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Medium"
                value={
                  totalMedium
                }
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Hard"
                value={
                  totalHard
                }
              />
            </Card>
          </Col>
        </Row>

        <div className="flex justify-between items-center mb-5">
          <div />

          <Space>
            <Input
              allowClear
              placeholder="Tìm tên đề..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
            />

            <Select
              allowClear
              placeholder="Độ khó"
              style={{ width: 150 }}
              onChange={setDifficulty}
            >
              <Select.Option value="easy">
                Easy
              </Select.Option>

              <Select.Option value="medium">
                Medium
              </Select.Option>

              <Select.Option value="hard">
                Hard
              </Select.Option>
            </Select>
          </Space>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={exams}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>

      <Drawer
        title="Chi tiết đề thi"
        width={1000}
        open={open}
        onClose={() => setOpen(false)}
      >
        {selectedExam && (
          <>
            <Descriptions
              bordered
              column={2}
            >
              <Descriptions.Item label="Tên đề">
                {selectedExam.title}
              </Descriptions.Item>

              <Descriptions.Item label="Môn học">
                {selectedExam.subject_id.name}
              </Descriptions.Item>

              <Descriptions.Item label="Người tạo">
                {selectedExam.created_by.name}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {new Date(
                  selectedExam.createdAt
                ).toLocaleString("vi-VN")}
              </Descriptions.Item>

              <Descriptions.Item label="Số câu">
                {selectedExam.total_question}
              </Descriptions.Item>

              <Descriptions.Item label="Thời gian">
                {selectedExam.time} phút
              </Descriptions.Item>

              <Descriptions.Item label="Độ khó">
                <Tag
                  color={getDifficultyColor(
                    selectedExam.difficulty_mode
                  )}
                >
                  {
                    selectedExam.difficulty_mode
                  }
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card
              title="Mô tả"
              style={{ marginTop: 20 }}
            >
              <Paragraph>
                {selectedExam.description}
              </Paragraph>
            </Card>

            <Row
              gutter={[16, 16]}
              style={{ marginTop: 20 }}
            >
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Easy"
                    value={
                      selectedExam.questions.filter(
                        (q) =>
                          q.difficulty ===
                          "easy"
                      ).length
                    }
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Statistic
                    title="Medium"
                    value={
                      selectedExam.questions.filter(
                        (q) =>
                          q.difficulty ===
                          "medium"
                      ).length
                    }
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <Statistic
                    title="Hard"
                    value={
                      selectedExam.questions.filter(
                        (q) =>
                          q.difficulty ===
                          "hard"
                      ).length
                    }
                  />
                </Card>
              </Col>
            </Row>

            <Card
              title={`Danh sách câu hỏi (${selectedExam.questions.length})`}
              style={{ marginTop: 20 }}
            >
              <Collapse
                items={selectedExam.questions.map(
                  (question, index) => ({
                    key: index,

                    label: `Câu ${index + 1
                      }: ${question.content}`,

                    children: (
                      <>
                        <Space
                          style={{
                            marginBottom: 12,
                          }}
                        >
                          <Tag color="blue">
                            {
                              question.knowledgeType
                            }
                          </Tag>

                          <Tag
                            color={getDifficultyColor(
                              question.difficulty
                            )}
                          >
                            {
                              question.difficulty
                            }
                          </Tag>
                        </Space>

                        <List
                          bordered
                          dataSource={
                            question.options
                          }
                          renderItem={(
                            option
                          ) => (
                            <List.Item>
                              {option.text}

                              {option.isCorrect && (
                                <Tag color="green">
                                  Đáp án đúng
                                </Tag>
                              )}
                            </List.Item>
                          )}
                        />
                      </>
                    ),
                  })
                )}
              />
            </Card>
          </>
        )}
      </Drawer>
    </>
  );
};

export default ExamManagement;
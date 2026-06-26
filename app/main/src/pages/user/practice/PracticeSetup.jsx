import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Collapse,
  Radio,
  Space,
  InputNumber,
  Tag,
  Empty,
  Select,
  message

} from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getSummaryBySubject } from "../../../services/chapterService";
import { getsubjectByid } from "../../../services/subjectService";
const { Title, Text } = Typography;

const PracticeSetup = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [questionNumber, setQuestionNumber] = useState("all");

  useEffect(() => {
    fetchSubjectDetail()
    fetchSummary()
  }, [subjectId]);

  const fetchSubjectDetail = async () => {
    try {
      const res = await getsubjectByid(subjectId);
      console.log("Subject data:", res);
      setSubject(res.list);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin môn học:", error);
    }
  };
  const fetchSummary = async () => {
    try {
      const res = await getSummaryBySubject(subjectId);
      console.log("Summary data:", res);
      setChapters(res);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin môn học:", error);
    }
  };

  const startPractice = () => {
    if (!selectedLesson) {
      message.warning("Vui lòng chọn bài học");
      return;
    }

    if (selectedLesson.totalQuestions === 0) {
      message.warning("Bài này chưa có câu hỏi");
      return;
    }

    const total = questionNumber === "all" ? selectedLesson.totalQuestions : Number(questionNumber);

    if (selectedLesson.totalQuestions < total) {
      message.warning(`Bài này chỉ có ${selectedLesson.totalQuestions} câu hỏi`);
      return;
    }
    navigate(`/student/practice/subject/${subjectId}/lesson/${selectedLesson._id}`,
      {
        state: {
          questionNumber: total,
        },
      }
    );
  };

  if (!subject) {
    return <Empty />;
  }
  return (
    <div>
      <Card
        style={{
          borderRadius: 18,
          marginBottom: 20,
        }}
      >
        <Title level={3}>
          <BookOutlined /> {subject.name}
        </Title>
        <Text type="secondary">
          {subject.description}
        </Text>
      </Card>
      <Row gutter={20}>
        {/* danh sách bài học */}
        <Col xs={24} lg={15}>
          <Card
            title="Chọn bài học luyện tập"
            style={{
              borderRadius: 18,
            }}
          >
            <Collapse>
              {
                chapters.map((chapter) => (
                  <Collapse.Panel
                    key={chapter._id}
                    header={chapter.name}
                  >
                    <Space
                      direction="vertical"
                      style={{
                        width: "100%"
                      }}
                    >
                      {
                        chapter.lessons.map((lesson) => (
                          <Card
                            key={lesson._id}
                            hoverable
                            onClick={() =>
                              setSelectedLesson(lesson)
                            }
                            style={{
                              border:
                                selectedLesson?._id === lesson._id
                                  ?
                                  "2px solid #1677ff"
                                  :
                                  undefined
                            }}
                          >
                            <Space
                              style={{
                                justifyContent: "space-between",
                                width: "100%"
                              }}
                            >
                              <div>
                                <b>{lesson.name} </b>
                                <br />
                                <Tag> {lesson.totalQuestions} câu hỏi</Tag>
                              </div>

                              {selectedLesson?._id === lesson._id &&
                                <Tag color="blue"> Đã chọn</Tag>
                              }
                            </Space>
                          </Card>
                        ))
                      }
                    </Space>
                  </Collapse.Panel>
                ))
              }
            </Collapse>
          </Card>
        </Col>

        {/* cấu hình */}
        <Col xs={24} lg={9}>
          <Card
            title="Thiết lập luyện tập"
            style={{
              borderRadius: 18
            }}
          >
            <Space
              direction="vertical"
              size="large"
              style={{
                width: "100%"
              }}
            >
              <div>
                <Text>Số câu hỏi</Text>
                <br />
                <Select
                  value={questionNumber}
                  onChange={setQuestionNumber}
                  style={{
                    width: "100%",
                  }}
                  options={[
                    {
                      value: "all",
                      label: "Tất cả câu hỏi",
                    },
                    {
                      value: 15,
                      label: "15 câu",
                    },
                    {
                      value: 20,
                      label: "20 câu",
                    },
                    {
                      value: 25,
                      label: "25 câu",
                    },
                    {
                      value: 30,
                      label: "30 câu",
                    },
                  ]}
                />
              </div>
              <Button
                type="primary"
                size="large"
                block
                icon={<PlayCircleOutlined />}
                disabled={!selectedLesson}
                onClick={startPractice}
              >
                Bắt đầu luyện tập
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PracticeSetup;
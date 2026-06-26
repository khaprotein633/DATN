import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Radio,
  Space,
  Button,
  Progress,
  Flex,
  Tag,
  Divider,
  Image
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getAllQuestionByLesson } from "../../../services/questionService";

const { Title, Text, Paragraph } = Typography;

const Practice = () => {

  const { subjectId } = useParams();

  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    questionNumber,
  } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // API:
    // GET /practice/questions?lessonId=&limit=&difficulty=
    fetchQuestions();

  }, [lessonId]);


  const question = questions[current];

  const checkAnswer = () => {
    setChecked(true);

    const answer = question.options.find(
      (item) => item.text === selected
    );

    if (answer?.isCorrect) {
      setScore(score + 1);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await getAllQuestionByLesson(lessonId, questionNumber);
      console.log("Danh sách câu hỏi:", res);
      setQuestions(res);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách câu hỏi:", error);
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setChecked(false);
    } else {
      navigate(`/student/practice/subject/${subjectId}/lesson/${lessonId}/result`, {
        state: {
          total: questions.length,
          score,
        },
      });
    }
  };

  const prevQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
      setChecked(false);
    }
  };
  const handleBack = () => {
    navigate(-1);
  }

  if (!question) return null;

  const isCorrect = question.options.find(
    (item) => item.text === selected
  )?.isCorrect;

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px 0",
      }}
    >
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Title level={3} style={{ margin: 0 }}>
          Luyện tập
        </Title>

        <Button danger onClick={handleBack}>
          Thoát luyện tập
        </Button>
      </Flex>

      {/* Progress */}
      <Progress
        percent={Math.round(
          ((current + 1) / questions.length) * 100
        )}
        style={{ marginTop: 20 }}
      />

      {/* Card */}
      <Card
        style={{
          marginTop: 20,
          borderRadius: 18,
        }}
      >
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Tag color="blue">
            Câu {current + 1}/{questions.length}
          </Tag>

          <Tag color="purple">
            {question.knowledgeType}
          </Tag>
        </Space>

        <Title
          level={4}
          style={{
            marginTop: 20,
          }}
        >
          {question.content}
        </Title>
        {question.image && (
          <div
            style={{
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <Image
              src={question.image}
              alt="Hình minh họa"
              style={{
                maxWidth: "100%",
                maxHeight: 350,
                borderRadius: 8,
              }}
            />
          </div>
        )}
        <Radio.Group
          value={selected}
          onChange={(e) =>
            setSelected(e.target.value)
          }
          disabled={checked}
          style={{
            width: "100%",
          }}
        >
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            {question.options.map((option) => (
              <Radio
                key={option.text}
                value={option.text}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                }}
              >
                {option.text}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        {checked && (
          <Card
            style={{
              marginTop: 24,
              background: "#fafafa",
            }}
          >
            {isCorrect ? (
              <Text type="success">
                <CheckCircleOutlined /> Chính xác
              </Text>
            ) : (
              <Text type="danger">
                <CloseCircleOutlined /> Sai rồi
              </Text>
            )}

            <Divider
              style={{
                margin: "12px 0",
              }}
            />

            <Text strong>Giải thích</Text>

            <Paragraph
              style={{
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {question.explanation}
            </Paragraph>
          </Card>
        )}

        {/* Footer */}
        <Flex
          justify="space-between"
          style={{
            marginTop: 30,
          }}
        >
          <Button
            size="large"
            disabled={current === 0}
            onClick={prevQuestion}
          >
            ← Câu trước
          </Button>

          <Space>
            <Button
              size="large"
              onClick={handleBack}
            >
              Thoát
            </Button>

            <Button
              type="primary"
              size="large"
              disabled={!selected}
              onClick={
                checked
                  ? nextQuestion
                  : checkAnswer
              }
            >
              {checked
                ? current ===
                  questions.length - 1
                  ? "Hoàn thành"
                  : "Câu tiếp →"
                : "Kiểm tra đáp án"}
            </Button>
          </Space>
        </Flex>
      </Card>
    </div>
  );
};

export default Practice;
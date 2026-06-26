import React from "react";
import {
  Card,
  Typography,
  Progress,
  Statistic,
  Row,
  Col,
  Button,
  Space,
} from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const PracticeResult = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const score = state?.score || 0;
  const total = state?.total || 0;

  const percent =
    total === 0
      ? 0
      : Math.round((score / total) * 100);

  const wrong = total - score;

  const getMessage = () => {
    if (percent >= 90)
      return "Xuất sắc! Bạn đã nắm rất chắc kiến thức.";
    if (percent >= 75)
      return "Rất tốt! Bạn chỉ còn một vài lỗi nhỏ.";
    if (percent >= 60)
      return "Khá tốt. Hãy luyện tập thêm để cải thiện.";
    if (percent >= 40)
      return "Bạn nên xem lại bài học và luyện tập thêm.";
    return "Bạn cần ôn tập lại kiến thức trước khi luyện tập tiếp.";
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <Title level={2}>
             Hoàn thành luyện tập
        </Title>

        <Progress
          type="circle"
          percent={percent}
          size={160}
        />

        <Title
          level={3}
          style={{
            marginTop: 24,
          }}
        >
          {score} / {total} câu đúng
        </Title>

        <Row
          gutter={16}
          style={{
            marginTop: 30,
          }}
        >
          <Col span={12}>
            <Statistic
              title="Chính xác"
              value={score}
              prefix={
                <CheckCircleFilled
                  style={{ color: "#52c41a" }}
                />
              }
            />
          </Col>

          <Col span={12}>
            <Statistic
              title="Sai"
              value={wrong}
              prefix={
                <CloseCircleFilled
                  style={{ color: "#ff4d4f" }}
                />
              }
            />
          </Col>
        </Row>

        <Paragraph
          style={{
            marginTop: 30,
            fontSize: 16,
          }}
        >
          <Text strong>{getMessage()}</Text>
        </Paragraph>

        <Space
          size="large"
          style={{
            marginTop: 24,
          }}
        >
          <Button
            size="large"
            onClick={() => navigate(-1)}
          >
            Làm lại
          </Button>

          <Button
            type="primary"
            size="large"
            onClick={() =>
              navigate("/student/practice")
            }
          >
            Quay về luyện tập
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default PracticeResult;
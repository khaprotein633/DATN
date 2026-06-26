import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Statistic,
} from "antd";

import {
  BookOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
} from "@ant-design/icons";

import {
  getAllAndTotal
} from "../../services/subjectService";

import { useNavigate } from "react-router-dom";
import { useState ,useEffect} from "react";

const { Title, Text } = Typography;
import { useAuth } from "../../contexts/AuthContext";


const Question = () => {
  const navigate = useNavigate();
    const { user, authLoading } = useAuth();
  const [subjects,setSubjects] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchSubjects();
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const res = await getAllAndTotal();
      console.log("data:", res);
      setSubjects(res);
    } catch (error) {
      console.log(error);
      message.error("Lỗi tải môn học");
    } 

  };


  return (
    <div>
      <div className="mb-6">
        <Title level={2}>
          Quản lý ngân hàng câu hỏi
        </Title>

        <Text type="secondary">
          Chọn môn học để quản lý câu hỏi
        </Text>
      </div>

      <Row gutter={[20, 20]}>
        {subjects.map((subject) => (
          <Col
            xs={24}
            md={12}
            lg={8}
            key={subject._id}
          >
            <Card
              hoverable
              className="h-full shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <BookOutlined
                    style={{
                      fontSize: 22,
                    }}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-0">
                    {subject.name}
                  </h3>

                  <Text type="secondary">
                    {subject.code}
                  </Text>
                </div>
              </div>

              <Row gutter={[12, 12]}>
                <Col span={12}>
                  <Statistic
                    title="Câu hỏi"
                    value={
                      subject.totalQuestion
                    }
                    prefix={
                      <QuestionCircleOutlined />
                    }
                  />
                </Col>

                <Col span={12}>
                  <Statistic
                    title="Chương"
                    value={
                      subject.totalChapter
                    }
                  />
                </Col>

                {/* <Col span={12}>
                  <Statistic
                    title="Bài học"
                    value={
                      subject.totalLessons
                    }
                    prefix={<ReadOutlined />}
                  />
                </Col> */}
              </Row>

              <div className="mt-6">
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    navigate(
                      `/admin/question/${subject._id}`
                    )
                  }
                >
                  Quản lý
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Question;
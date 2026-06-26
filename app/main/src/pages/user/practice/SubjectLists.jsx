import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Progress,
  Input,
  Space,
  Tag,
  Pagination,
    Skeleton,
} from "antd";
import { useState, useEffect } from "react";
import {
  SearchOutlined,
  BookOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

import {
  getList
} from "../../../services/subjectService";
import {
  useAuth
} from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const SubjectLists = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
    fetchSubjects();
  }, [authLoading, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchSubjects();
  }, [currentPage, debouncedSearch]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await getList(currentPage,
        pagination.limit,
        debouncedSearch);

      setSubjects(res.subjects);
      setPagination(res.pagination);

    } catch (error) {
      console.log(error);
      message.error("Lỗi tải môn học");
    } finally {
      setLoading(false);
    }

  };

  const skeletons = Array.from({ length: pagination.limit || 9 });
  if(loading) {
    return ( 
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Title level={2}>Luyện tập</Title>
      <Paragraph type="secondary">
        Chọn môn học để bắt đầu luyện tập các câu hỏi trắc nghiệm.
      </Paragraph>
      <Input
        size="large"
        placeholder="Tìm kiếm môn học..."
        value={searchText}
        prefix={<SearchOutlined />}
        style={{
          marginBottom: 24,
          maxWidth: 450,
        }}
      /> 
      <Row gutter={[24, 24]}>
      {skeletons.map((_, index) => (
        <Col xs={24} md={12} lg={8} key={index}>
          <Card
            style={{
              borderRadius: 18,
            }}
          >
            <Skeleton.Avatar
              active
              size={48}
              shape="square"
            />

            <Skeleton
              active
              title={{
                width: "70%",
              }}
              paragraph={{
                rows: 2,
              }}
              style={{
                marginTop: 20,
              }}
            />

            <Space
              direction="vertical"
              style={{
                width: "100%",
                marginTop: 10,
              }}
            >
              <Skeleton.Input active size="small" block />
              <Skeleton.Input active size="small" block />
              <Skeleton.Input active size="small" block />
            </Space>

            <Skeleton.Button
              active
              block
              style={{
                marginTop: 20,
                height: 40,
              }}
            />
          </Card>
        </Col>
        
      ))}
      </Row>
      </div>
      )
  }
  return (
    <div
      style={{
        padding: 24,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Title level={2}>Luyện tập</Title>

      <Paragraph type="secondary">
        Chọn môn học để bắt đầu luyện tập các câu hỏi trắc nghiệm.
      </Paragraph>
      <Input
        size="large"
        placeholder="Tìm kiếm môn học..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setCurrentPage(1);
        }}
        prefix={<SearchOutlined />}
        style={{
          marginBottom: 24,
          maxWidth: 450,
        }}
      />

      <Row gutter={[24, 24]}>
        {subjects.map((subject) => (
          <Col xs={24} md={12} lg={8} key={subject._id}>
            <Card
              hoverable
              style={{
                borderRadius: 18,
              }}
            >
              <Space
                align="start"
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: 45,
                  }}
                >
                  <BookOutlined />
                </div>
              </Space>
              <Title
                level={4}
                ellipsis={{
                  rows: 2,
                }}
                style={{
                  marginTop: 20,
                  minHeight: 35,
                }}
              >
                {subject.name}
              </Title>

              <Paragraph
                type="secondary"
                ellipsis={{
                  rows: 2,
                }}
                style={{
                  minHeight: 44,
                }}
              >
                {subject.description}
              </Paragraph>

              <Space
                size="large"
                style={{
                  marginBottom: 15,
                }}
              >
                <Text>
                  <BookOutlined /> {subject.totalChapter} Chương
                </Text>
                <Text>
                  <BookOutlined /> {subject.totalLesson} Bài học
                </Text>

                <Text>{subject.totalQuestion} Câu hỏi</Text>
              </Space>

              <Button
                type="primary"
                block
                size="large"
                icon={<PlayCircleOutlined />}
                style={{
                  marginTop: "auto",
                }}
                onClick={() => {
                  navigate(`/student/practice/subject/${subject._id}`);
                }}
              >
                Practice
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Row justify="center" style={{ marginTop: 30 }}>
        <Pagination
          current={pagination.page}
          pageSize={pagination.limit}
          total={pagination.total}
          showSizeChanger={false}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </Row>
    </div>
  );
};

export default SubjectLists;
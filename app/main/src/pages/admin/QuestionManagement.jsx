
import {
  Card,
  Table,
  Typography,
  Space,
  Button,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Statistic,
  Popconfirm,
  Alert,
  Modal, Form, Radio,
  message,
  Upload,
  Tooltip,
  Divider,
  Image
} from "antd";
import { toast } from "react-toastify";

import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

import {
  getChaperBySubject
} from "../../services/chapterService";
import {
  getLessonByChapter
} from "../../services/lessonService";
import {
  getListQuestion, addQuestion, updateQuestion, removeQuestion, removeMultipleQuestion,
  importQuestionExcel, downloadQuestionTemplate, previewQuestionExcel,

} from "../../services/questionService";

const QuestionManagement = () => {

  const { id } = useParams();
  const { user, authLoading } = useAuth();


  const navigate = useNavigate();

  //
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  //
  const [questions, setQuestions] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [totalEasy, setTotalEasy] = useState(0);
  const [totalMedium, setTotalMedium] = useState(0);
  const [totalHard, setTotalHard] = useState(0);
  //
  const [difficulty, setDifficulty] = useState("");
  const [knowledgeType, setKnowledgeType] = useState("");
  //
  const [subject, setSubject] = useState({});
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  //
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  //
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [isEdit, setIsEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewQuestion, setViewQuestion] = useState(null);
  const [open, setOpen] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    content: "",
    chapter_id: "",
    lesson_id: "",
    knowledgeType: "",
    difficulty: "",
    explanation: "",
    tags: [],
    image: "",
    image_public_id: "",
    options: [
      {
        text: "",
        isCorrect: true,
      },
      {
        text: "",
        isCorrect: false,
      },
      {
        text: "",
        isCorrect: false,
      },
      {
        text: "",
        isCorrect: false,
      },
    ],
  });

  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewData, setPreviewData] = useState(null);

  const [previewFile, setPreviewFile] = useState(null);

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  // load câu hỏi
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchQuestions();
    fetchChapters();
  }, [user, id, currentPage, selectedChapter, selectedLesson, difficulty,knowledgeType, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchQuestions = async () => {
    try {
      const res = await getListQuestion(currentPage, 10, id, selectedChapter, selectedLesson, difficulty, knowledgeType, debouncedSearch);
      setSubject(res.subject)
      setTotalEasy(res.totalEasy)
      setTotalMedium(res.totalMedium)
      setTotalHard(res.totalHard)
      setTotalQuestion(res.totalQuestion)
      setQuestions(res.questions);
      setPagination(res.pagination);

    } catch (error) {
      console.log(error);
      message.error("Lỗi tải môn học");
    }

  };
  //load chương và bài học 
  const fetchChapters = async () => {
    try {
      const res = await getChaperBySubject(id);

      setChapters(res.list);


    } catch (error) {
      console.log(error);
      message.error("Lỗi tải chương");
    }

  };

  useEffect(() => {
    if (!selectedChapter) {
      setLessons([]);
      return;
    }
    fetchLessons();
  }, [selectedChapter]);
  const fetchLessons = async () => {
    try {
      const res = await getLessonByChapter(selectedChapter);
      setLessons(res.list);

    } catch (error) {
      console.log(error);
      message.error("Lỗi tải bài học");
    }

  };

  // hàm xử lý thêm sửa xoá\
  const handleOpenModal = async () => {
    setSelectedChapter(null);
    setSelectedLesson(null);
    setLessons([]);
    setOpen(true);
  }

  const resetForm = () => {

    setIsEdit(false);
    setSelectedChapter(null);
    setSelectedLesson(null);
    setLessons([]);
    setFormData({
      content: "",
      chapter_id: "",
      lesson_id: "",
      knowledgeType: "",
      difficulty: "",
      explanation: "",
      tags: [],
      image: "",
      image_public_id: "",
      options: [
        {
          content: "",
          isCorrect: true,
        },
        {
          content: "",
          isCorrect: false,
        },
        {
          content: "",
          isCorrect: false,
        },
        {
          content: "",
          isCorrect: false,
        },
      ],
    });
    setImageFile(null);
  };

  const handleSelectImage = (file) => {
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      image: previewUrl,
    }));
  };

  const handleEdit = async (question) => {

    setIsEdit(true);
    const chapterId = question.chapter_id?._id;
    const lessonId = question.lesson_id?._id;

    setSelectedChapter(chapterId);

    // load lesson của chapter đó
    const res = await getLessonByChapter(chapterId);

    setLessons(res.list);

    setSelectedLesson(lessonId);

    setFormData({
      _id: question._id,
      content: question.content,
      chapter_id: question.chapter_id?._id,
      lesson_id: question.lesson_id?._id,
      image: question.image || "",
      image_public_id: question.image_public_id || "",
      knowledgeType: question.knowledgeType,
      difficulty: question.difficulty,
      explanation: question.explanation || "",
      tags: question.tags || [],
      options: question.options,
    });

    setOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!formData.chapter_id) {
      return message.warning("Vui lòng chọn chương");
    }

    if (!formData.lesson_id) {
      return message.warning("Vui lòng chọn bài học");
    }

    if (!formData.content.trim()) {
      return message.warning("Vui lòng nhập câu hỏi");
    }
    if (!formData.knowledgeType) {
      return message.warning("Vui lòng chọn Bloom");
    }

    if (!formData.difficulty) {
      return message.warning("Vui lòng chọn độ khó");
    }

    const hasEmptyOption =
      formData.options.some(
        item => !item.text.trim()
      );

    if (hasEmptyOption) {
      return message.warning("Vui lòng nhập đầy đủ đáp án");
    }
    const optionTexts = formData.options.map(
      item => item.text.trim().toLowerCase()
    );
    const hasDuplicateOption = new Set(optionTexts).size !== optionTexts.length;
    if (hasDuplicateOption) {
      return message.warning("Các đáp án không được trùng nhau");
    }
    if (!formData.explanation.trim()) {
      return message.warning("Vui lòng nhập giải thích");
    }
    try {
      setSaving(true);
      // let imageData = {
      //   image: formData.image,
      //   image_public_id: formData.image_public_id
      // };
      // if (imageFile) {
      //   try {
      //     const res = await uploadImage(imageFile);

      //     imageData = {
      //       image: res.url,
      //       image_public_id: res.public_id
      //     };

      //   } catch (error) {
      //     message.error("Upload ảnh thất bại");
      //     return;
      //   }
      // }
      const payload = {
        ...formData,
        image: imageFile,
        subject_id: id,
        createdBy: user._id,
      };

      if (isEdit) {
        await updateQuestion(payload);
        message.success("Cập nhật câu hỏi thành công");
      } else {
        await addQuestion(payload);
        message.success("Tạo câu hỏi thành công");
      }
      resetForm();
      setOpen(false);
      fetchQuestions()
    } catch (err) {

      console.log("ERR:", err);

      if (err?.duplicated) {

        Modal.warning({
          title: "Nội dung câu hỏi đã tồn tại",
          content: (
            <div>
              <p>
                <b>Nội dung:</b>
              </p>
              <p>{err.question.content}</p>
              <p>
                <b>Chương:</b>{" "}
                {err.question.chapter_id?.name}
              </p>

              <p>
                <b>Bài học:</b>{" "}
                {err.question.lesson_id?.name}
              </p>
            </div>
          ),
        });
        return;
      }
      toast.error(
        err.message || "Thất bại"
      );

    } finally { setSaving(false) }
  };

  const handleDelete = async (id) => {
    try {

      await removeQuestion(id);
      message.success("Xóa thành công");
      if (
        questions.length === 1 &&
        currentPage > 1
      ) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchQuestions();
      }

    } catch (error) {

      console.log(error);

      message.error(
        error?.message ||
        "Xóa thất bại"
      );
    }
  };

  const handleView = (question) => {
    setViewQuestion(question);
    setOpenView(true);
  };
  // xoá nhiều câu hỏi
  const rowSelection = {
    selectedRowKeys,

    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };
  const handleDeleteSelected = async () => {
    try {

      await removeMultipleQuestion(
        selectedRowKeys
      );

      message.success(
        `Đã xóa ${selectedRowKeys.length} câu hỏi`
      );

      setSelectedRowKeys([]);

      fetchQuestions();

    } catch (error) {

      console.log(error);

      message.error(
        error?.message ||
        "Xóa thất bại"
      );

    }
  };

  const handleImportExcel = async (file) => {
    try {
      const result = await previewQuestionExcel(file, id);
      setPreviewFile(file);
      setPreviewData(result);
      setPreviewOpen(true);
    } catch (error) {
      message.error( error.message);
    }
    return false;
  };

  const handleConfirmImport = async () => {
    try {
      setConfirmLoading(true);
      const result =await importQuestionExcel( previewFile,id );
      console.log("data:", result)
      message.success(`Đã tạo ${result.total} câu hỏi`);
      setPreviewOpen(false);
      setPreviewData(null);
      fetchQuestions();
    } catch (error) {
      message.error(error?.message ||"Import thất bại");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {

    try {
      const blob = await downloadQuestionTemplate(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "question-template.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      message.success("Tải file mẫu thành công");

    } catch (error) {

      console.log(error);

      message.error(error?.message || "Tải file thất bại");

    }
  };

  const getDifficultyColor = (
    difficulty
  ) => {
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

  const columns = [
    {
      title: "Câu hỏi",

      dataIndex: "content",

      ellipsis: true,
    },

    {
      title: "Chương",

      dataIndex: "chapter_id",
      render: (value) => (
        value.code
      )
    },

    {
      title: "Bài học",

      dataIndex: "lesson_id",
      render: (value) => (
        value.code
      )
    },

    {
      title: "Bloom",

      dataIndex: "knowledgeType",

      render: (value) => (
        <Tag color="blue">
          {value}
        </Tag>
      ),
    },

    {
      title: "Độ khó",

      dataIndex: "difficulty",

      render: (value) => (
        <Tag
          color={getDifficultyColor(value)}
        >
          {value.toUpperCase()}
        </Tag>
      ),
    },

    {
      title: "Thao tác",

      width: 220,

      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >

          </Button>

          <Button
            icon={<EditOutlined />}
            type="primary"
            ghost
            onClick={() => handleEdit(record)}
          >

          </Button>

          <Popconfirm
            title="Xóa câu hỏi?"
            description="Bạn có chắc muốn xóa câu hỏi này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() =>
              handleDelete(record._id)
            }
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Title level={2}>
          Ngân hàng câu hỏi - DSA
        </Title>
      </div>

      {/* Statistics */}
      <Row
        gutter={[16, 16]}
        className="mb-5"
      >
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng câu hỏi"
              value={totalQuestion}
              prefix={
                <QuestionCircleOutlined />
              }
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
              value={totalMedium}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Hard"
              value={totalHard}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Card */}
      <Card>
        <div className="mb-5 space-y-4">
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-3">
            <Input
              allowClear
              placeholder="Tìm câu hỏi..."
              value={searchText}
              style={{ width: 280 }}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Select
              allowClear
              placeholder="Chương"
              style={{ width: 220 }}
              value={selectedChapter}
              onChange={(value) => {
                setSelectedChapter(value);
                setSelectedLesson(null);
              }}
            >
              {chapters.map((chapter) => (
                <Select.Option
                  key={chapter._id}
                  value={chapter._id}
                >
                  {chapter.name}
                </Select.Option>
              ))}
            </Select>

            <Select
              allowClear
              placeholder="Bài học"
              style={{ width: 220 }}
              value={selectedLesson}
              onChange={(value) => {
                setSelectedLesson(value);
              }}
            >
              {lessons.map((lesson) => (
                <Select.Option
                  key={lesson._id}
                  value={lesson._id}
                >
                  {lesson.name}
                </Select.Option>
              ))}
            </Select>
              <Select
              allowClear
              placeholder="Loại kiên thức"
              style={{ width: 160 }}
              value={ knowledgeType|| undefined}
              onChange={(value) => {
                setKnowledgeType(value || "");
                setCurrentPage(1);
              }}
            >
              <Select.Option value="concept">
                Concept
              </Select.Option>

              <Select.Option value="exercise">
                Exercise
              </Select.Option>
            </Select>

            <Select
              allowClear
              placeholder="Độ khó"
              style={{ width: 160 }}
              value={difficulty || undefined}
              onChange={(value) => {
                setDifficulty(value || "");
                setCurrentPage(1);
              }}
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
          </div>

          {/* Các thao tác */}
          <div className="flex justify gap-3">
            <Tooltip title="Tải file Excel mẫu để nhập nhiều câu hỏi cùng lúc">
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadTemplate}
              >
                Tải file mẫu
              </Button>
            </Tooltip>
            <Tooltip title="Upload file Excel đã điền để tạo hàng loạt câu hỏi">
              <Upload
                accept=".xlsx,.xls"
                showUploadList={false}
                beforeUpload={handleImportExcel}
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                >
                  Import Excel
                </Button>
              </Upload>
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
            >
              Thêm câu hỏi
            </Button>

            <Popconfirm
              title={`Xóa ${selectedRowKeys.length} câu hỏi ?`}
              description="Hành động này không thể hoàn tác"
              onConfirm={handleDeleteSelected}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                danger
                disabled={!selectedRowKeys.length}
              >
                Xóa đã chọn
              </Button>
            </Popconfirm>

          </div>
        </div>

        {selectedRowKeys.length > 0 && (
          <Alert
            showIcon
            type="info"
            className="mb-4"
            message={`Đã chọn ${selectedRowKeys.length} câu hỏi`}
          />
        )}

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={questions}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      </Card>

      {/* tạo câu hỏi mới hoặc sửa câu hỏi */}
      <Modal
        title={
          <div>
            <Typography.Title
              level={4}
              style={{ margin: 0 }}
            >
              {isEdit ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
            </Typography.Title>
            <Typography.Text type="secondary">
              {subject?.name}
            </Typography.Text>
          </div>
        }
        open={open}
        centered
        width={850}
        bodyStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "20px"
        }}
        onCancel={() => {
          if (!saving) {
            setOpen(false);
            resetForm();
          }
        }}
        onOk={handleSaveQuestion}
        confirmLoading={saving}
        okText={saving ? (isEdit ? "Đang cập nhật..." : "Đang tạo...") : (isEdit ? "Cập nhật" : "Tạo câu hỏi")}
        cancelText="Hủy"
        okButtonProps={{
          size: "large",
          style: {
            minWidth: 140,
            height: 42,
            borderRadius: 8
          }
        }}
        cancelButtonProps={{
          size: "large",
          style: {
            minWidth: 100,
            height: 42,
            borderRadius: 8
          }
        }}
      >
        <Form layout="vertical">
          {/* THÔNG TIN CƠ BẢN */}
          <Card
            title="Thông tin câu hỏi"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12
            }}
          >
            <Form.Item label="Chương" required>
              <Select
                size="large"
                placeholder="Chọn chương"
                value={selectedChapter}
                onChange={(value) => {
                  setSelectedChapter(value);
                  setSelectedLesson(null);
                  setFormData(prev => ({
                    ...prev,
                    chapter_id: value,
                    lesson_id: ""
                  }));
                }}
                options={
                  chapters.map(item => ({
                    value: item._id,
                    label: item.name
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="Bài học" required>
              <Select
                size="large"
                placeholder="Chọn bài học"
                disabled={!selectedChapter}
                value={selectedLesson}
                onChange={(value) => {
                  setSelectedLesson(value);
                  setFormData(prev => ({
                    ...prev,
                    lesson_id: value
                  }));
                }}
                options={
                  lessons.map(item => ({
                    value: item._id,
                    label: item.name
                  }))
                }
              />
            </Form.Item>
            <Form.Item label="Nội dung câu hỏi" required>
              <Input.TextArea
                rows={4}
                placeholder="Nhập nội dung câu hỏi..."
                value={formData.content}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    content: e.target.value
                  }))
                }
              />
            </Form.Item>
          </Card>
          {/* ẢNH */}
          <Card
            title="Hình ảnh câu hỏi"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12,
            }}
          >
            <Space>
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handleSelectImage(file);
                  return false;
                }}
              >
                <Button size="large">
                  {formData.image
                    ? "Đổi ảnh"
                    : "Chọn ảnh"}
                </Button>
              </Upload>

              {formData.image && (
                <Button
                  danger
                  size="large"
                  onClick={() => {

                    setImageFile(null);

                    setFormData(prev => ({
                      ...prev,
                      image: "",
                      image_public_id: "",
                    }));

                  }}
                >
                  Xóa ảnh
                </Button>
              )}
            </Space>

            {formData.image && (
              <div style={{ marginTop: 15 }}>
                <Image
                  src={formData.image}
                  width={300}
                  style={{
                    borderRadius: 10,
                  }}
                />
              </div>
            )}
          </Card>
          {/* PHÂN LOẠI */}
          <Card
            title="Phân loại kiến thức"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12
            }}
          >
            <Form.Item label="Bloom" required>
              <Select
                size="large"
                value={formData.knowledgeType}
                onChange={(value) =>
                  setFormData(prev => ({
                    ...prev,
                    knowledgeType: value
                  }))
                }
                options={[
                  {
                    value: "concept",
                    label: "Lý thuyết"
                  },
                  {
                    value: "exercise",
                    label: "Bài tập"
                  }
                ]}
              />
            </Form.Item>

            <Form.Item label="Độ khó" required>
              <Select
                size="large"
                value={formData.difficulty}
                onChange={(value) =>
                  setFormData(prev => ({
                    ...prev,
                    difficulty: value
                  }))
                }
                options={[
                  {
                    value: "easy",
                    label: "Easy"
                  },
                  {
                    value: "medium",
                    label: "Medium"
                  },
                  {
                    value: "hard",
                    label: "Hard"
                  }
                ]}
              />
            </Form.Item>
          </Card>
          {/* ĐÁP ÁN */}
          <Card
            title="Danh sách đáp án"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12
            }}
          >
            {formData.options.map((option, index) => (
              <Card
                key={index}
                size="small"
                style={{
                  marginBottom: 12,
                  background: option.isCorrect ? "#f6ffed" : "#fafafa"
                }}
              >
                <Input
                  placeholder={`Đáp án ${index + 1}`}
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [
                      ...formData.options
                    ];
                    newOptions[index].text =
                      e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      options: newOptions
                    }));
                  }}
                />
                <Radio
                  style={{
                    marginTop: 10
                  }}
                  checked={option.isCorrect}
                  onChange={() => {
                    const newOptions =
                      formData.options.map(
                        (item, i) => ({
                          ...item,
                          isCorrect: i === index
                        })
                      );
                    setFormData(prev => ({
                      ...prev,
                      options: newOptions
                    }));
                  }}
                >
                  Đáp án đúng
                </Radio>
              </Card>
            ))
            }
          </Card>
          {/* GIẢI THÍCH */}
          <Card
            title="Giải thích"
            bordered={false}
            style={{
              marginBottom: 16,
              borderRadius: 12
            }}
          >
            <Form.Item required>
              <Input.TextArea
                rows={3}
                placeholder="Giải thích đáp án..."
                value={formData.explanation}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    explanation: e.target.value
                  }))
                }
              />
            </Form.Item>
          </Card>
          <Card
            title="Tags"
            bordered={false}
            style={{
              borderRadius: 12
            }}
          >
            <Select
              mode="tags"
              size="large"
              style={{ width: "100%" }}
              value={formData.tags}
              onChange={(value) =>
                setFormData(prev => ({
                  ...prev,
                  tags: value
                }))
              }
            />
          </Card>
        </Form>
      </Modal>

      {/* xem chi tiết câu hỏi */}
      <Modal
        title={
          <div>
            <Typography.Title
              level={4}
              style={{ margin: 0 }}
            >
              {isEdit ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi mới"}
            </Typography.Title>
            <Typography.Text type="secondary">
              {subject?.name}
            </Typography.Text>
          </div>
        }
        open={openView}
        footer={[
          <Button
            key="close"
            onClick={() => setOpenView(false)}
          >
            Đóng
          </Button>
        ]}
        centered
        onCancel={() => setOpenView(false)}
        width={800}
        bodyStyle={{
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "20px"
        }}
      >
        {viewQuestion && (
          <div className="space-y-4">

            <div>
              <strong>Chương:</strong>{" "}
              {viewQuestion.chapter_id?.name}
            </div>

            <div>
              <strong>Bài học:</strong>{" "}
              {viewQuestion.lesson_id?.name}
            </div>

            <div>
              <strong>Bloom:</strong>{" "}
              <Tag color="blue">
                {viewQuestion.knowledgeType}
              </Tag>
            </div>

            <div>
              <strong>Độ khó:</strong>{" "}
              <Tag
                color={getDifficultyColor(
                  viewQuestion.difficulty
                )}
              >
                {viewQuestion.difficulty.toUpperCase()}
              </Tag>
            </div>

            <div>
              <strong>Nội dung:</strong>

              <Card className="mt-2">
                <p className="whitespace-pre-wrap">{viewQuestion?.content}</p>

                {viewQuestion?.image && (
                  <Image
                    src={viewQuestion.image}
                    width={300}
                    style={{
                      borderRadius: 10
                    }}
                  />
                )}

              </Card>
            </div>

            <div>
              <strong>Đáp án:</strong>

              <div className="mt-2 space-y-2">
                {viewQuestion.options?.map(
                  (option, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        border: option.isCorrect
                          ? "2px solid green"
                          : undefined,
                      }}
                    >
                      <div className="flex justify-between">
                        <span>
                          {String.fromCharCode(
                            65 + index
                          )}
                          . {option.text}
                        </span>

                        {option.isCorrect && (
                          <Tag color="green">
                            Đáp án đúng
                          </Tag>
                        )}
                      </div>
                    </Card>
                  )
                )}
              </div>
            </div>

            {viewQuestion.explanation && (
              <div>
                <strong>Giải thích:</strong>

                <Card className="mt-2">
                  {viewQuestion.explanation}
                </Card>
              </div>
            )}

            {viewQuestion.tags?.length > 0 && (
              <div>
                <strong>Tags:</strong>

                <div className="mt-2">
                  {viewQuestion.tags.map(
                    (tag) => (
                      <Tag key={tag}>
                        {tag}
                      </Tag>
                    )
                  )}
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>
      {/* xem previewFile */}
      <Modal
        open={previewOpen}
        title="Xem trước import câu hỏi"
        width={900}
        onCancel={() => {
          setPreviewOpen(false);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() =>
              setPreviewOpen(false)
            }
          >
            Hủy
          </Button>,

          <Button
            key="import"
            type="primary"
            loading={confirmLoading}
            disabled={
              previewData?.invalid > 0
            }
            onClick={handleConfirmImport}
          >
            Tạo {previewData?.valid || 0} câu hỏi
          </Button>,
        ]}
      >
        {previewData && (
          <>
            {previewData.invalid > 0 ? (
              <Alert
                className="mb-4"
                message="File Excel có lỗi"
                description="Vui lòng sửa tất cả lỗi trước khi tạo câu hỏi."
                type="error"
                showIcon
              />
            ) : (
              <Alert
                className="mb-4"
                message="File hợp lệ"
                description="Bạn có thể tạo câu hỏi từ dữ liệu bên dưới."
                type="success"
                showIcon
              />
            )}

            <Row gutter={16} className="mb-4">
              <Col span={8}>
                <Statistic
                  title="Tổng số câu hỏi"
                  value={previewData.total}
                />
              </Col>

              <Col span={8}>
                <Statistic
                  title="Hợp lệ"
                  value={previewData.valid}
                  valueStyle={{
                    color: "#3f8600",
                  }}
                />
              </Col>

              <Col span={8}>
                <Statistic
                  title="Lỗi"
                  value={previewData.invalid}
                  valueStyle={{
                    color: "#cf1322",
                  }}
                />
              </Col>
            </Row>

            {previewData.errors?.length >
              0 && (
                <>
                  <Divider>
                    Danh sách lỗi
                  </Divider>

                  <div
                    style={{
                      maxHeight: 220,
                      overflowY: "auto",
                    }}
                  >
                    {previewData.errors.map(
                      (err, index) => (
                        <Alert
                          key={index}
                          type="error"
                          showIcon
                          className="mb-2"
                          message={`Dòng ${err.row}`}
                          description={
                            err.message
                          }
                        />
                      )
                    )}
                  </div>
                </>
              )}

            <Divider>
              Xem trước dữ liệu
            </Divider>

            <Table
              size="small"
              rowKey={(_, i) => i}
              pagination={false}
              scroll={{
                y: 300,
              }}
              dataSource={
                previewData.questions || []
              }
              columns={[
                {
                  title: "Nội dung",
                  dataIndex: "content",
                },
                {
                  title: "Độ khó",
                  dataIndex: "difficulty",
                  render: (value) => (
                    <Tag
                      color={
                        value === "easy"
                          ? "green"
                          : value === "medium"
                            ? "orange"
                            : "red"
                      }
                    >
                      {value}
                    </Tag>
                  ),
                },
                {
                  title: "Chapter",
                  dataIndex:
                    "chapter_code",
                },
                {
                  title: "Lesson",
                  dataIndex:
                    "lesson_code",
                },
              ]}
            />
          </>
        )}
      </Modal>

    </div>
  );
};

export default QuestionManagement;
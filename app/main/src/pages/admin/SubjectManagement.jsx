
import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Drawer,
  Form,
  Input,
  Popconfirm,
  message,
  Empty,
  Skeleton
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  ReadOutlined,
  FileTextOutlined,
  SearchOutlined
} from "@ant-design/icons";

import {
  getList,
  getall,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subjectService";

import {
  getChaperBySubject,
  getAllChapter,
  addChapter,
  updateChapter,
  deleteChapter,
} from "../../services/chapterService";

import {
  getLessonByChapter,
  getAllLesson,
  addLesson,
  updateLesson,
  deleteLesson,
} from "../../services/lessonService";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SubjectManagement = () => {

  // =========================
  // STATE
  // =========================
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totalSubjects, setTotalSubjects] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  const [totalloading, setTotalLoading] = useState(false);

  const [chapterLoading, setChapterLoading] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const [openChapterModal, setOpenChapterModal] = useState(false);
  const [openLessonDrawer, setOpenLessonDrawer] = useState(false);
  const [openSubjectModal, setOpenSubjectModal] = useState(false);

  const [openAddChapterModal, setOpenAddChapterModal] = useState(false);
  const [openAddLessonModal, setOpenAddLessonModal] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const [subjectForm] = Form.useForm();
  const [chapterForm] = Form.useForm();
  const [lessonForm] = Form.useForm();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  // phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [currentPage, setCurrentPage] = useState(1);

  // =========================
  // FETCH
  // =========================

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchSubjects();
  }, [currentPage, user]);

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
        10,
        debouncedSearch);

      setTotalLessons(res.totalLesson)
      setTotalChapters(res.totalChapter)
      setTotalSubjects(res.totalSubject)

      setSubjects(res.subjects);
      setPagination(res.pagination);

    } catch (error) {

      console.log(error);

      message.error("Lỗi tải môn học");

    } finally {

      setLoading(false);

    }

  };

  const fetchChapters = async (subject) => {

    try {

      setSelectedSubject(subject);

      setChapterLoading(true);

      const res = await getChaperBySubject(subject._id);
      console.log("res:", res);
      setChapters(res.list);

      setOpenChapterModal(true);

    } catch (error) {

      console.log(error);

      message.error("Lỗi tải chương");

    } finally {

      setChapterLoading(false);

    }

  };

  const fetchLessons = async (chapter) => {

    try {

      setSelectedChapter(chapter);

      setLessonLoading(true);

      const res = await getLessonByChapter(chapter._id);

      setLessons(res.list);

      setOpenLessonDrawer(true);

    } catch (error) {

      console.log(error);

      message.error("Lỗi tải bài học");

    } finally {

      setLessonLoading(false);

    }

  };

  // =========================
  // SUBJECT CRUD
  // =========================

  const handleOpenAddSubject = () => {

    setEditingSubject(null);

    subjectForm.resetFields();

    setOpenSubjectModal(true);

  };

  const handleEditSubject = (subject) => {

    setEditingSubject(subject);

    subjectForm.setFieldsValue({
      name: subject.name,
      code: subject.code,
      description: subject.description,
    });

    setOpenSubjectModal(true);

  };

  const handleSubmitSubject = async () => {

    try {

      const values =
        await subjectForm.validateFields();

      if (editingSubject) {

        const hasChanged =
          values.name !== editingSubject.name ||
          values.code !== editingSubject.code ||
          values.description !== editingSubject.description;

        if (!hasChanged) {

          message.warning(
            "Bạn chưa thay đổi thông tin nào"
          );

          return;
        }

        await updateSubject({
          subject_id: editingSubject._id,
          ...values,
        });

        message.success(
          "Cập nhật môn học thành công"
        );

      } else {

        await addSubject(values);

        message.success(
          "Thêm môn học thành công"
        );

      }

      setOpenSubjectModal(false);

      setEditingSubject(null);

      subjectForm.resetFields();

      fetchSubjects();

    } catch (err) {
      console.log("ERROR:", err);
      message.error(err.message || "Có lỗi xảy ra");
    }

  };

  const handleDeleteSubject = async (id) => {

    try {

      await deleteSubject(id);

      message.success("Xóa môn học thành công");

      fetchSubjects();

    } catch (err) {

      console.log(err);

      message.error(err.message || "Có lỗi xảy ra");

    }

  };

  // =========================
  // CHAPTER CRUD
  // =========================

  const handleOpenAddChapter = () => {

    setEditingChapter(null);

    chapterForm.resetFields();

    setOpenAddChapterModal(true);

  };

  const handleEditChapter = (chapter) => {

    setEditingChapter(chapter);

    chapterForm.setFieldsValue({
      name: chapter.name,
      code: chapter.code,
      description: chapter.description,
    });

    setOpenAddChapterModal(true);

  };

  const handleSubmitChapter = async () => {

    try {

      const values =
        await chapterForm.validateFields();

      if (editingChapter) {

        const hasChanged =
          values.name !== editingChapter.name ||
          values.code !== editingChapter.code ||
          values.description !== editingChapter.description;

        if (!hasChanged) {

          message.warning(
            "Bạn chưa thay đổi thông tin nào"
          );

          return;
        }

        await updateChapter({
          subject_id: selectedSubject._id,
          chapter_id: editingChapter._id,
          ...values,
        });

        message.success(
          "Cập nhật chương thành công"
        );

      } else {

        await addChapter({
          subject_id: selectedSubject._id,
          ...values,
        });

        message.success(
          "Thêm chương thành công"
        );

      }

      setOpenAddChapterModal(false);

      setEditingChapter(null);

      chapterForm.resetFields();

      fetchChapters(selectedSubject);

    } catch (error) {

      console.log(error);

      message.error(
        error.message
      );

    }

  };

  const handleDeleteChapter = async (id) => {

    try {

      await deleteChapter(id);

      message.success("Xóa chương thành công");

      fetchChapters(selectedSubject);

    } catch (error) {

      console.log(error);
      message.error(
        error.message
      );

    }

  };

  // =========================
  // LESSON CRUD
  // =========================

  const handleOpenAddLesson = () => {

    setEditingLesson(null);

    lessonForm.resetFields();

    setOpenAddLessonModal(true);

  };

  const handleEditLesson = (lesson) => {

    setEditingLesson(lesson);

    lessonForm.setFieldsValue({
      name: lesson.name,
      code: lesson.code,
      description: lesson.description,
    });

    setOpenAddLessonModal(true);

  };

  const handleSubmitLesson = async () => {

    try {

      const values =
        await lessonForm.validateFields();

      if (editingLesson) {

        const hasChanged =
          values.name !== editingLesson.name ||
          values.code !== editingLesson.code ||
          values.description !== editingLesson.description;

        if (!hasChanged) {

          message.warning(
            "Bạn chưa thay đổi thông tin nào"
          );

          return;
        }

        await updateLesson({
          chapter_id: selectedChapter._id,
          lesson_id: editingLesson._id,
          ...values,
        });

        message.success(
          "Cập nhật bài học thành công"
        );

      } else {

        await addLesson({
          chapter_id: selectedChapter._id,
          ...values,
        });

        message.success(
          "Thêm bài học thành công"
        );

      }

      setOpenAddLessonModal(false);

      setEditingLesson(null);

      lessonForm.resetFields();

      fetchLessons(selectedChapter);

    } catch (error) {

      console.log(error);

      message.error(
        error.message || "Có lỗi xảy ra"
      );

    }

  };

  const handleDeleteLesson = async (id) => {

    try {

      await deleteLesson(id);

      message.success("Xóa bài học thành công");

      fetchLessons(selectedChapter);

    } catch (error) {

      console.log(error);
      message.error(
        error.message || "Có lỗi xảy ra"
      );
    }

  };

  // =========================
  // TABLE
  // =========================

  const subjectColumns = [
    {
      title: "Tên môn học",
      dataIndex: "name",
    },
    {
      title: "Mã",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Hành động",
      width: 260,
      render: (_, record) => (
        <Space>

          <Button
            type="primary"
            icon={<BookOutlined />}
            onClick={() => fetchChapters(record)}
          >
            Quản lý
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditSubject(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa môn học?"
            onConfirm={() => handleDeleteSubject(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  const chapterColumns = [
    {
      title: "Tên chương",
      dataIndex: "name",
    },
    {
      title: "Mã",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Hành động",
      width: 260,
      render: (_, record) => (
        <Space>

          <Button
            type="primary"
            icon={<ReadOutlined />}
            onClick={() => fetchLessons(record)}
          >
            Bài học
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditChapter(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa chương?"
            onConfirm={() => handleDeleteChapter(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  const lessonColumns = [
    {
      title: "Tên bài học",
      dataIndex: "name",
    },
    {
      title: "Mã",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Hành động",
      width: 180,
      render: (_, record) => (
        <Space>

          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditLesson(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa bài học?"
            onConfirm={() => handleDeleteLesson(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];


  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý môn học
          </h1>

          <p className="text-gray-500 mt-1">
            Quản lý môn học, chương và bài học
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Tổng môn học
              </p>

              <h2 className="text-3xl font-bold text-blue-600 mt-2">
                {totalSubjects}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <BookOutlined className="text-2xl text-blue-600" />

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Chương hiện tại
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {totalChapters}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">

              <ReadOutlined className="text-2xl text-green-600" />

            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500 text-sm">
                Bài học hiện tại
              </p>

              <h2 className="text-3xl font-bold text-orange-600 mt-2">
                {totalLessons}
              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

              <FileTextOutlined className="text-2xl text-orange-600" />

            </div>

          </div>

        </div>

      </div>

      {/* MAIN TABLE */}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Danh sách môn học
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Quản lý tất cả môn học trong hệ thống
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="relative">

              <Input
                allowClear
                placeholder="Tìm kiếm môn học..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPageSubject(1);
                }}
                className="!h-11!w-80!rounded-xl !pl-10!border-gray-200 hover:!border-blue-400focus:!border-blue-500"
              />

            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenAddSubject}
              className="
      !h-10
      !rounded-xl
      !px-4
      !font-medium
      !shadow-sm
      hover:!shadow-md
      transition-all
    "
            >
              Thêm môn học
            </Button>

          </div>
        </div>

        <div className="p-4">

          <Table
            rowKey="_id"
            loading={loading}
            dataSource={subjects}
            columns={subjectColumns}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              onChange: (page) => setCurrentPage(page),
            }}
          />

        </div>

      </div>

      {/* CHAPTER MODAL */}

      <Modal
        title={null}
        open={openChapterModal}
        onCancel={() => setOpenChapterModal(false)}
        footer={null}
        width={1100}
        className="subject-modal"
      >

        <div className="mb-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                {selectedSubject?.name}
              </h2>

              <p className="text-gray-500 mt-1">
                Quản lý chương học
              </p>

            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              className="!rounded-xl !h-11"
              onClick={handleOpenAddChapter}
            >
              Thêm chương
            </Button>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">

          <Table
            rowKey="_id"
            loading={chapterLoading}
            dataSource={chapters}
            columns={chapterColumns}
            pagination={{
              pageSize: 5,
            }}
            locale={{
              emptyText: (
                <Empty description="Chưa có chương học" />
              ),
            }}
          />

        </div>

      </Modal>

      {/* LESSON DRAWER */}

      <Drawer
        title={null}
        open={openLessonDrawer}
        onClose={() => setOpenLessonDrawer(false)}
        width={850}
      >

        <div className="h-full flex flex-col">

          <div className="mb-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedChapter?.name}
                </h2>

                <p className="text-gray-500 mt-1">
                  Quản lý bài học
                </p>

              </div>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="!rounded-xl !h-11"
                onClick={handleOpenAddLesson}
              >
                Thêm bài học
              </Button>

            </div>

          </div>

          <div className="flex-1 rounded-2xl border border-gray-100 overflow-hidden">

            <Table
              rowKey="_id"
              loading={lessonLoading}
              dataSource={lessons}
              columns={lessonColumns}
              pagination={{
                pageSize: 6,
              }}
              locale={{
                emptyText: (
                  <Empty description="Chưa có bài học" />
                ),
              }}
            />

          </div>

        </div>

      </Drawer>

      {/* modal thêm sửa subject */}
      <Modal
        open={openSubjectModal}
        footer={null}
        centered
        width={700}
        onCancel={() => {
          setOpenSubjectModal(false);
          setEditingSubject(null);
          subjectForm.resetFields();
        }}
      >
        <div className="mb-6">

          <div className="flex items-center gap-4">

            <div
              className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ${editingSubject
                  ? "bg-amber-100"
                  : "bg-blue-100"
                }
        `}
            >
              {
                editingSubject
                  ? (
                    <EditOutlined className="text-xl text-amber-600" />
                  )
                  : (
                    <BookOutlined className="text-xl text-blue-600" />
                  )
              }
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                {
                  editingSubject
                    ? "Cập nhật môn học"
                    : "Thêm môn học mới"
                }

              </h2>

              <p className="text-gray-500">

                {
                  editingSubject
                    ? "Chỉnh sửa thông tin môn học"
                    : "Tạo môn học mới trong hệ thống"
                }

              </p>

            </div>

          </div>

        </div>

        <Form
          form={subjectForm}
          layout="vertical"
        >

          <Form.Item
            label="Tên môn học"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên môn học"
              }
            ]}
          >
            <Input
              size="large"
              placeholder="Ví dụ: Cấu trúc dữ liệu và giải thuật"
              className="!rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label="Mã môn học"
            name="code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã môn học"
              }
            ]}
          >
            <Input
              size="large"
              placeholder="Ví dụ: DSA001"
              className="!rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả"
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập mô tả môn học..."
              className="!rounded-xl"
            />
          </Form.Item>

        </Form>

        <div className="flex justify-end gap-3 mt-8">

          <Button
            size="large"
            className="!rounded-xl"
            onClick={() => {
              setOpenSubjectModal(false);
              setEditingSubject(null);
              subjectForm.resetFields();
            }}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            size="large"
            icon={
              editingSubject
                ? <EditOutlined />
                : <PlusOutlined />
            }
            className="
        !rounded-xl
        !px-6
      "
            onClick={handleSubmitSubject}
          >
            {
              editingSubject
                ? "Cập nhật"
                : "Thêm mới"
            }
          </Button>

        </div>

      </Modal>

      {/* modal thêm sửa xoá chapter */}
      <Modal
        open={openAddChapterModal}
        footer={null}
        width={700}
        centered
        onCancel={() => {

          setOpenAddChapterModal(false);

          setEditingChapter(null);

          chapterForm.resetFields();

        }}
      >

        <div className="mb-6">

          <div className="flex items-center gap-4">

            <div
              className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ${editingChapter
                  ? "bg-amber-100"
                  : "bg-green-100"
                }
        `}
            >

              {
                editingChapter
                  ? (
                    <EditOutlined className="text-xl text-amber-600" />
                  )
                  : (
                    <ReadOutlined className="text-xl text-green-600" />
                  )
              }

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                {
                  editingChapter
                    ? "Cập nhật chương"
                    : "Thêm chương mới"
                }

              </h2>

              <p className="text-gray-500">

                {
                  editingChapter
                    ? "Chỉnh sửa thông tin chương học"
                    : "Tạo chương mới cho môn học"
                }

              </p>

            </div>

          </div>

        </div>

        <div className="mb-4">

          <Tag color="blue">
            Môn học: {selectedSubject?.name}
          </Tag>

        </div>

        <Form
          form={chapterForm}
          layout="vertical"
        >

          <Form.Item
            label="Tên chương"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chương"
              }
            ]}
          >
            <Input
              size="large"
              className="!rounded-xl"
              placeholder="Ví dụ: Đệ quy"
            />
          </Form.Item>

          <Form.Item
            label="Mã chương"
            name="code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã chương"
              }
            ]}
          >
            <Input
              size="large"
              className="!rounded-xl"
              placeholder="Ví dụ: CH01"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả"
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              className="!rounded-xl"
              placeholder="Nhập mô tả chương học..."
            />
          </Form.Item>

        </Form>

        <div className="flex justify-end gap-3 mt-8">

          <Button
            size="large"
            className="!rounded-xl"
            onClick={() => {

              setOpenAddChapterModal(false);

              setEditingChapter(null);

              chapterForm.resetFields();

            }}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            size="large"
            icon={
              editingChapter
                ? <EditOutlined />
                : <PlusOutlined />
            }
            className="
        !rounded-xl
        !px-6
      "
            onClick={handleSubmitChapter}
          >
            {
              editingChapter
                ? "Cập nhật"
                : "Thêm mới"
            }
          </Button>

        </div>

      </Modal>

      {/* modal thêm sửa xoá lesson */}
      <Drawer
        open={openAddLessonModal}
        width={700}
        destroyOnClose
        onClose={() => {

          setOpenAddLessonModal(false);

          setEditingLesson(null);

          lessonForm.resetFields();

        }}
      >

        <div className="mb-6">

          <div className="flex items-center gap-4">

            <div
              className={`
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          ${editingLesson
                  ? "bg-amber-100"
                  : "bg-orange-100"
                }
        `}
            >

              {
                editingLesson
                  ? (
                    <EditOutlined className="text-xl text-amber-600" />
                  )
                  : (
                    <FileTextOutlined className="text-xl text-orange-600" />
                  )
              }

            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">

                {
                  editingLesson
                    ? "Cập nhật bài học"
                    : "Thêm bài học mới"
                }

              </h2>

              <p className="text-gray-500">

                {
                  editingLesson
                    ? "Chỉnh sửa thông tin bài học"
                    : "Tạo bài học mới cho chương"
                }

              </p>

            </div>

          </div>

        </div>

        <div className="mb-5">

          <Tag color="green">
            Chương: {selectedChapter?.name}
          </Tag>

        </div>

        <Form
          form={lessonForm}
          layout="vertical"
        >

          <Form.Item
            label="Tên bài học"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên bài học"
              }
            ]}
          >
            <Input
              size="large"
              className="!rounded-xl"
              placeholder="Ví dụ: Big O"
            />
          </Form.Item>

          <Form.Item
            label="Mã bài học"
            name="code"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã bài học"
              }
            ]}
          >
            <Input
              size="large"
              className="!rounded-xl"
              placeholder="Ví dụ: LS01"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả"
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              className="!rounded-xl"
              placeholder="Nhập mô tả bài học..."
            />
          </Form.Item>

        </Form>

        <div className="flex justify-end gap-3 mt-8">

          <Button
            size="large"
            className="!rounded-xl"
            onClick={() => {

              setOpenAddLessonModal(false);

              setEditingLesson(null);

              lessonForm.resetFields();

            }}
          >
            Hủy
          </Button>

          <Button
            type="primary"
            size="large"
            icon={
              editingLesson
                ? <EditOutlined />
                : <PlusOutlined />
            }
            className="
        !rounded-xl
        !px-6
      "
            onClick={handleSubmitLesson}
          >
            {
              editingLesson
                ? "Cập nhật"
                : "Thêm mới"
            }
          </Button>

        </div>

      </Drawer>
    </div>
  );


};

export default SubjectManagement;


import { useEffect, useState } from 'react'

import {
    Card,
    Typography,
    Collapse,
    Button,
    Empty,
    Layout,
    Tree,
    Tag,
    Divider,
    Spin,
    Image
} from "antd";
import {
    ArrowLeftOutlined,
    BookOutlined,
    ReadOutlined,
    BulbOutlined,
    CheckCircleFilled,
} from "@ant-design/icons";
import { toast } from "react-toastify";
const { Sider, Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

import { useNavigate, useParams } from "react-router-dom";
import { getSummaryBySubject } from "../../../services/chapterService";
import { getsubjectByid } from "../../../services/subjectService";
import { getAllQuestionByLesson } from "../../../services/questionService";

const Question_Answers = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        fetchSubjectDetail()
        fetchSummary()
    }, [subjectId]);

    useEffect(() => {
        if (selectedLesson) {
            fetchQuestions();
        }
    }, [selectedLesson]);

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

    const fetchQuestions = async () => {
        if (!selectedLesson) return;

        try {
            const res = await getAllQuestionByLesson(
                selectedLesson._id,
                selectedLesson.totalQuestions
            );

            setQuestions(res);
        } catch (err) {
            console.log(err);
            toast.error("Lỗi khi lấy danh sách câu hỏi");
        }
    };


    const handleBack = () => {
        navigate(-1);
    }

    if (!subject) {
        return <Empty />;
    }
    return (
        <div>
            <Layout
                style={{
                    background: "#fff",
                    borderRadius: 12,
                    minHeight: "80vh",
                }}
            >
                <Sider
                    width={320}
                    theme="light"
                    style={{
                        background: "#f8fafc",
                        padding: 20,
                        position: "sticky",
                        top: 20,
                        height: "calc(100vh - 40px)",
                        overflow: "auto",
                        borderRadius: 20,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    }}
                >
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        type="text"
                        style={{
                            marginBottom: 24,
                            fontWeight: 600,
                        }}
                    >
                        Quay lại
                    </Button>

                    <div
                        style={{
                            marginBottom: 24,
                            padding: 18,
                            borderRadius: 16,
                            background:
                                "linear-gradient(135deg,#1677ff,#69b1ff)",
                            color: "#fff",
                        }}
                    >
                        <Title
                            level={4}
                            style={{
                                color: "#fff",
                                marginBottom: 4,
                            }}
                        >
                            Danh sách bài học
                        </Title>

                        <Text style={{ color: "rgba(255,255,255,.85)" }}>
                            {chapters.length} chương
                        </Text>
                    </div>

                    <Collapse
                        accordion
                        ghost
                        expandIconPosition="end"
                    >
                        {chapters.map((chapter) => (
                            <Panel
                                key={chapter._id}
                                header={
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            fontWeight: 600,
                                        }}
                                    >
                                        <BookOutlined
                                            style={{ color: "#1677ff" }}
                                        />
                                        <span>
                                            {chapter.code}. {chapter.name}
                                        </span>
                                    </div>
                                }
                            >
                                {chapter.lessons.map((lesson) => {
                                    const active =
                                        selectedLesson?._id === lesson._id;

                                    return (
                                        <div
                                            key={lesson._id}
                                            onClick={() =>
                                                setSelectedLesson(lesson)
                                            }
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "12px 14px",
                                                marginBottom: 10,
                                                borderRadius: 12,
                                                cursor: "pointer",
                                                transition: ".25s",
                                                border: active
                                                    ? "1px solid #1677ff"
                                                    : "1px solid #f0f0f0",
                                                background: active
                                                    ? "#e6f4ff"
                                                    : "#fff",
                                                boxShadow: active
                                                    ? "0 4px 12px rgba(22,119,255,.18)"
                                                    : "0 2px 8px rgba(0,0,0,.04)",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.background =
                                                        "#fafafa";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!active) {
                                                    e.currentTarget.style.background =
                                                        "#fff";
                                                }
                                            }}
                                        >
                                            <ReadOutlined
                                                style={{
                                                    color: active
                                                        ? "#1677ff"
                                                        : "#999",
                                                    fontSize: 18,
                                                }}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <Text
                                                    strong={active}
                                                    style={{
                                                        color: active
                                                            ? "#1677ff"
                                                            : "#333",
                                                    }}
                                                >
                                                    {lesson.name}
                                                </Text>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Panel>
                        ))}
                    </Collapse>
                </Sider>

                <Content
                    style={{
                        padding: 24,
                        overflow: "auto",
                    }}
                >
                    {/* Danh sách câu hỏi */}
                    <Title level={3}>
                        {selectedLesson?.name}
                    </Title>

                    <Text type="secondary">
                        Có {questions.length} câu hỏi
                    </Text>

                    <Divider />
                    {questions.map((item, index) => (
                        <Card
                            key={item._id}
                            style={{
                                marginBottom: 20,
                                borderRadius: 12
                            }}
                        >
                            <Title className='whitespace-pre-wrap' level={5}>
                                Câu {index + 1}. {item.content}
                            </Title>
                            {item.image && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        margin: "20px 0",
                                    }}
                                >
                                    <Image
                                        src={item.image}
                                        alt="Hình minh họa"
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: 300,
                                            borderRadius: 4,
                                        }}
                                    />
                                </div>
                            )}
                            {item.options.map((op, i) => (
                                <div key={i} style={{ padding: "8px 0" }}>
                                    {String.fromCharCode(65 + i)}. {op.text}
                                </div>
                            ))
                            }
                            <Collapse
                                ghost
                                className="mt-4 rounded-xl bg-white"
                                items={[
                                    {
                                        key: "1",
                                        label: (
                                            <div className="flex items-center gap-2 font-semibold text-blue-600">
                                                <BulbOutlined />
                                                <span>Xem đáp án & giải thích</span>
                                            </div>
                                        ),
                                        children: (
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 border border-green-200">
                                                    <CheckCircleFilled className="text-green-600" />
                                                    <span className="font-medium">
                                                        Đáp án đúng:
                                                    </span>
                                                    <Tag color="success" className="m-0">
                                                        {item.options.find(option => option.isCorrect)?.text}
                                                    </Tag>
                                                </div>

                                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                                    <p className="mb-2 font-semibold text-gray-700">
                                                        Giải thích
                                                    </p>

                                                    <Paragraph className="!mb-0 text-gray-600">
                                                        {item.explanation}
                                                    </Paragraph>
                                                </div>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    ))
                    }
                </Content>
            </Layout>
        </div>
    )
}

export default Question_Answers

import {useEffect, useState} from 'react'

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
} from "antd";
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
                    width={300}
                    theme="light"
                    style={{
                        borderRight: "1px solid #f0f0f0",
                        padding: 20,
                        position: "sticky",
                        top: 20,
                        height: "calc(100vh - 20px)",
                        overflow: "auto",
                    }}
                >
                    {/* Danh sách chương - bài */}
                    <Title level={4}>
                        Danh sách bài học
                    </Title>

                    <Collapse
                        accordion
                        ghost
                    >

                        {
                            chapters.map(chapter => (
                                <Panel
                                    header={`${chapter.code}. ${chapter.name}`}
                                    key={chapter._id}
                                >

                                    {
                                        chapter.lessons.map(lesson => (

                                            <div
                                                key={lesson._id}
                                                style={{
                                                    padding: "10px 12px",
                                                    cursor: "pointer",
                                                    borderRadius: 8,
                                                    marginBottom: 8,
                                                    background: selectedLesson?._id === lesson._id ? "#e6f4ff" : ""
                                                }}
                                                onClick={() => setSelectedLesson(lesson)}
                                            >

                                                <Text strong>
                                                 {lesson.name}
                                                </Text>

                                                <br />

                                                {/* <Text type="secondary">
                                                    {lesson.totalQuestions} câu hỏi
                                                </Text> */}

                                            </div>

                                        ))
                                    }

                                </Panel>
                            ))
                        }
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
                    {
                        questions.map((item, index) => (

                            <Card
                                key={item._id}
                                style={{
                                    marginBottom: 20,
                                    borderRadius: 12
                                }}
                            >

                                <Title level={5}>
                                    Câu {index + 1}. {item.content}
                                </Title>

                                {
                                    item.options.map((op, i) => (

                                        <div
                                            key={i}
                                            style={{
                                                padding: "8px 0"
                                            }}
                                        >

                                            {String.fromCharCode(65 + i)}. {op.content}

                                        </div>

                                    ))
                                }

                                <Collapse
                                    ghost
                                    style={{ marginTop: 15 }}
                                >

                                    <Panel
                                        header={
                                            <Button type="link">
                                                Xem đáp án & giải thích
                                            </Button>
                                        }
                                        key="1"
                                    >

                                        <Tag color="green">
                                            Đáp án đúng:
                                            {" "}
                                            {item.correctAnswer}
                                        </Tag>

                                        <Paragraph
                                            style={{
                                                marginTop: 15
                                            }}
                                        >

                                            {item.explanation}

                                        </Paragraph>

                                    </Panel>

                                </Collapse>

                            </Card>

                        ))
                    }
                </Content>
            </Layout>
        </div>
    )
}

export default Question_Answers

import { FileText, Clock, Target, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getall } from "../../services/subjectService";

import { getChaperBySubject } from "../../services/chapterService";

import { getLessonByChapter } from "../../services/lessonService";

import { add } from "../../services/examService";

import { useAuth } from "../../contexts/AuthContext";



const CreateExam = () => {

    const navigate = useNavigate();
    const { user, authLoading } = useAuth();
    const [loading, setLoading] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [lessons, setLessons] = useState({});

    const [difficulty, setDifficulty] = useState("");
    const [questionCount, setQuestionCount] = useState();
    const [duration, setDuration] = useState();

    const MIN_QUESTION_PER_LESSON = 3;

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/auth/login");
            return;
        }
        //console.log("user:", user);
        fetchAllSubject();
    }, [user]);


    const [form, setForm] = useState({
        user: user,
        subject: "",
        chapters: [],
        lessons: [],
        difficulty: "medium",
        questionCount: 20,
        duration: 15,
    });

    const fetchAllSubject = async () => {
        try {
            const data = await getall();
            setSubjects(data.list || []);
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Lấy danh sách môn học thất bại");
        }
    };

    const fetchChapters = async (subjectId) => {
        try {
            const data = await getChaperBySubject(subjectId);
            console.log("Chapters:", data.list || []);
            setChapters(data.list || []);
        } catch (err) {
            console.log(err);
            toast.error(err.message || "Lấy danh sách chương thất bại");
        }
    };

    const loadLessons = async (chapterId) => {
        if (lessons[chapterId]) return lessons[chapterId];

        const data = await getLessonByChapter(chapterId);

        setLessons(prev => ({
            ...prev,
            [chapterId]: data.list || [],
        }));

        return data.list || [];
    };
    
    const handleChapterChange = async (chapter, checked) => {
        if (checked) {
            const lessonList = await loadLessons(chapter._id);

            setForm(prev => ({
                ...prev,
                chapters: [...prev.chapters, chapter._id],
                lessons: [
                    ...new Set([
                        ...prev.lessons,
                        ...lessonList.map(l => l._id),
                    ]),
                ],
            }));
        } else {
            const lessonIds =
                lessons[chapter._id]?.map(l => l._id) || [];

            setForm(prev => ({
                ...prev,
                chapters: prev.chapters.filter(id => id !== chapter._id),
                lessons: prev.lessons.filter(id => !lessonIds.includes(id)),
            }));
        }
    };

    const handleSelectAll = async () => {
        const allChapterIds = chapters.map(c => c._id);

        let allLessons = [];
        let lessonMap = {};

        for (const chapter of chapters) {
            const lessonList = await loadLessons(chapter._id);

            lessonMap[chapter._id] = lessonList;

            allLessons.push(...lessonList.map(l => l._id));
        }

        setLessons(prev => ({
            ...prev,
            ...lessonMap,
        }));

        setForm(prev => ({
            ...prev,
            chapters: allChapterIds,
            lessons: allLessons,
        }));
    };

    const totalQuestion = Object.values(lessons)
        .flat()
        .filter((lesson) => form.lessons.includes(lesson._id))
        .reduce((sum, lesson) => sum + (lesson.questionCount || 0), 0);

    const questionOptions = [20, 30, 40, 50].filter(
        (item) => item <= totalQuestion
    );
    useEffect(() => {
        if (
            questionOptions.length > 0 &&
            !questionOptions.includes(form.questionCount)
        ) {
            handleChange("questionCount", questionOptions[0]);
        }
    }, [totalQuestion]);

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!form.subject) { toast.error("Vui lòng chọn môn học"); return; }

        if (form.lessons.length === 0) { toast.error("Vui lòng chọn ít nhất 1 bài học"); return; }

        try {
            setLoading(true);
            const data = await add(form);
            //SaveTest(data.test);
            toast.success(data.message)
            navigate(`/exam/${data.test._id}`)

        } catch (error) {
            console.log(error);
            toast.error(error.message || "Tạo đề thất bại")
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">
                    Tạo bài kiểm tra
                </h1>

                <p className="text-slate-500 mt-2">
                    Tạo đề thi ngẫu nhiên từ ngân hàng câu hỏi
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h2 className="font-semibold text-lg mb-6">
                        Cấu hình đề kiểm tra
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Môn học */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Môn học
                            </label>

                            <select
                                className="w-full border border-slate-200 rounded-xl px-4 py-3"
                                //value={form.subject}
                                onChange={(e) => {

                                    const subjectId = e.target.value;
                                    setLessons({});

                                    setForm((prev) => ({
                                        ...prev,
                                        user: user,
                                        subject: subjectId,
                                        chapters: [],
                                        lessons: [],
                                    })
                                    );

                                    fetchChapters(subjectId);
                                }}>
                                <option value="123">
                                    -- Chọn môn học --
                                </option>
                                {subjects.map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Chương */}
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-sm font-medium">
                                    Chương & Bài học
                                </label>
                                <button
                                    type="button"
                                    className="text-sm bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl hover:bg-indigo-200"
                                    onClick={handleSelectAll}
                                // onClick={async () => {

                                //     const allChapterIds = chapters.map(c => c._id);

                                //     let allLessons = [];

                                //     for (const chapter of chapters) {

                                //         const data = await getLessonByChapter(chapter._id);

                                //         setLessons((prev) => ({
                                //             ...prev,
                                //             [chapter._id]: data.list || [],
                                //         }));

                                //         allLessons.push(
                                //             ...(data.list || []).map(l => l._id)
                                //         );
                                //     }

                                //     setForm((prev) => ({
                                //         ...prev,
                                //         chapters: allChapterIds,
                                //         lessons: allLessons,
                                //     }));
                                // }}
                                >
                                    Chọn tất cả
                                </button>
                            </div>

                            <div className="space-y-4">
                                {chapters.map((chapter) => (
                                    <div
                                        key={chapter._id}
                                        className="border border-slate-200 rounded-2xl p-4"
                                    >
                                        {/* Chapter */}
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.chapters.includes(chapter._id)}
                                                onChange={(e) =>
                                                    handleChapterChange(chapter, e.target.checked)
                                                }
                                            // onChange={async (e) => {

                                            //     if (e.target.checked) {

                                            //         const data = await getLessonByChapter(chapter._id);
                                            //         const lessonList = data.list || [];
                                            //         setLessons((prev) => ({
                                            //             ...prev,
                                            //             [chapter._id]: lessonList,
                                            //         }));

                                            //         setForm((prev) => ({

                                            //             ...prev,

                                            //             chapters: [
                                            //                 ...prev.chapters,
                                            //                 chapter._id
                                            //             ],

                                            //             lessons: [
                                            //                 ...new Set([
                                            //                     ...prev.lessons,
                                            //                     ...lessonList.map(l => l._id)
                                            //                 ])
                                            //             ]
                                            //         }));

                                            //     } else {

                                            //         const lessonIds =
                                            //             lessons[chapter._id]?.map(
                                            //                 l => l._id
                                            //             ) || [];

                                            //         setForm((prev) => ({

                                            //             ...prev,

                                            //             chapters:
                                            //                 prev.chapters.filter(
                                            //                     c => c !== chapter._id
                                            //                 ),

                                            //             lessons:
                                            //                 prev.lessons.filter(
                                            //                     l => !lessonIds.includes(l)
                                            //                 )
                                            //         }));
                                            //     }
                                            // }}
                                            />

                                            <span className="font-medium text-slate-700">
                                                {chapter.name}
                                            </span>
                                        </label>

                                        {/* Lessons */}
                                        {form.chapters.includes(chapter._id) && (
                                            <div className="mt-4 ml-6 grid md:grid-cols-2 gap-3">
                                                {lessons[chapter._id]?.map((lesson) => (
                                                    <label
                                                        key={lesson._id}
                                                        className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-100"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={form.lessons.includes(lesson._id)}
                                                            onChange={(e) => {

                                                                if (e.target.checked) {

                                                                    setForm((prev) => ({
                                                                        ...prev,
                                                                        lessons: [
                                                                            ...prev.lessons,
                                                                            lesson._id,
                                                                        ],
                                                                    }));

                                                                } else {

                                                                    setForm((prev) => ({
                                                                        ...prev,
                                                                        lessons:
                                                                            prev.lessons.filter(
                                                                                (id) =>
                                                                                    id !== lesson._id
                                                                            ),
                                                                    }));
                                                                }
                                                            }}
                                                        />

                                                        <span className="text-sm">
                                                            {lesson.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Độ khó */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Độ khó
                            </label>

                            <select
                                value={form.difficulty}
                                onChange={(e) =>
                                    handleChange("difficulty", e.target.value)
                                }
                                className="w-full border border-slate-200 rounded-xl px-4 py-3"
                            >
                                <option value={"easy"}>Dễ</option>
                                <option value={"medium"}>Trung bình</option>
                                <option value={"hard"}>Khó</option>
                            </select>
                        </div>

                        {/* Số câu */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Số câu hỏi
                            </label>

                            <select
                                value={form.questionCount}
                                onChange={(e) =>
                                    handleChange("questionCount", Number(e.target.value))
                                }
                                className="w-full border border-slate-200 rounded-xl px-4 py-3"
                            >
                                {questionOptions.length > 0 ? (
                                    questionOptions.map((item) => (
                                        <option key={item} value={item}>
                                            {item} câu
                                        </option>
                                    ))
                                ) : (
                                    <option value="">
                                        - -
                                    </option>
                                )}
                            </select>
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Bài học đã chọn
                                    </span>

                                    <span className="font-medium">
                                        {form.lessons.length}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Tổng số câu hỏi
                                    </span>

                                    <span className="font-medium text-indigo-600">
                                        {totalQuestion} câu
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">
                                        Có thể tạo tối đa
                                    </span>

                                    <span className="font-medium text-green-600">
                                        {questionOptions.length > 0
                                            ? `${Math.max(...questionOptions)} câu`
                                            : "0 câu"}
                                    </span>
                                </div>

                                {totalQuestion < 20 && (
                                    <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                                        Ngân hàng hiện có {totalQuestion} câu hỏi. Cần tối thiểu 20 câu để tạo đề.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thời gian */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Thời gian làm bài
                            </label>

                            <select
                                value={form.duration}
                                onChange={(e) =>
                                    handleChange(
                                        "duration",
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full border border-slate-200 rounded-xl px-4 py-3"
                            >
                                <option value={15}>15 phút</option>
                                <option value={30}>30 phút</option>
                                <option value={45}>45 phút</option>
                                <option value={60}>60 phút</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition"
                            onClick={handleCreate}
                        >
                            {loading ? "Đang tạo..." : "Tạo"}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
                    <h2 className="font-semibold text-lg mb-6">
                        Thông tin đề thi
                    </h2>

                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <BookOpen
                                size={18}
                                className="text-indigo-600"
                            />
                            <div>
                                <p className="text-xs text-slate-500">
                                    Môn học
                                </p>
                                <p className="font-medium">
                                    {subjects.find(s => s._id === form.subject)?.name || "Chưa chọn"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <FileText
                                size={18}
                                className="text-green-600"
                            />
                            <div>
                                <p className="text-xs text-slate-500">
                                    Số câu hỏi
                                </p>
                                <p className="font-medium">
                                    {form.questionCount} câu
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock
                                size={18}
                                className="text-orange-500"
                            />
                            <div>
                                <p className="text-xs text-slate-500">
                                    Thời gian
                                </p>
                                <p className="font-medium">
                                    {form.duration} phút
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Target
                                size={18}
                                className="text-red-500"
                            />
                            <div>
                                <p className="text-xs text-slate-500">
                                    Độ khó
                                </p>
                                <p className="font-medium">
                                    {
                                        {
                                            easy: "Dễ",
                                            medium: "Trung bình",
                                            hard: "Khó"
                                        }[form.difficulty]
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                        <p className="text-sm text-slate-600">
                            Hệ thống sẽ tạo đề thi ngẫu nhiên từ ngân hàng câu hỏi phù hợp với các tiêu chí đã chọn.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CreateExam;
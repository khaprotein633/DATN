import { Clock3, Flag, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getByID, removeExam } from "../../services/examService";
import { add } from "../../services/resultService";
import { useAuth } from "../../contexts/AuthContext";
import { Modal, Image } from "antd";
import ExamSkeleton from "../user/skeleton/ExamSkeleton";

const Exam = () => {
  const { user, authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [examLoading, setExamLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth/login");
      return;
    }
    fetchExam();
  }, [user]);


  const fetchExam = async () => {
    try {
      setExamLoading(true);
      const data = await getByID(id);
      console.log("data:", data);
      setExam(data.test);

      if (data.test?.time) {
        setTimeLeft(Number(data.test.time) * 60);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Tải đề thất bại");
    } finally {
      setExamLoading(false);
    }
  };

  const handleSubmit = async () => {
    const result = {
      user_id: user?._id,
      exam_id: id,
      answers: answers,
    };

    try {
      setLoading(true);
      const data = await add(result);
      console.log("data:", data.result._id);
      toast.success(data.message || "Nộp bài thành công!");

      navigate(`/student/result/${data.result._id}`);
    } catch (error) {
      toast.error(error.message || "Nộp bài thất bại");
      setLoading(false);
    }
  };

  useEffect(() => {

    if (examLoading || timeLeft === null) return;

    if (timeLeft === 0) {
      Modal.warning({
        title: "Hết giờ làm bài",
        content: "Hệ thống tự động nộp bài!"
      });
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft, examLoading]);

  if (!user || examLoading || !exam) {
    return (
      <ExamSkeleton />
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  // Format định dạng hiển thị thời gian trực quan (00:00)
  const formatTime = () => {
    if (timeLeft === null) return "--:--";
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const unansweredCount = exam.questions.filter((q) => !answers[q.question_id]).length;
  console.log("currentQuestion:", currentQuestion);

  const modalchualamxong = () => {
    Modal.confirm({
      title: "Nộp bài thi",
      content: `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn vẫn muốn nộp bài?`,
      okText: "Nộp bài",
      cancelText: "Tiếp tục làm bài",
      onOk() {
        handleSubmit();
      },
    });
  };

  const modalamxong = () => {
    Modal.confirm({
      title: "Nộp bài thi",
      content: "Bạn có chắc chắn muốn nộp bài?",
      okText: "Nộp bài",
      cancelText: "Hủy",
      onOk() {
        handleSubmit();
      },
    });
  };

  const checknopbai = () => {
    if (unansweredCount > 0) {
      modalchualamxong();
    } else {
      modalamxong();
    }
  };

  const handleExit = async () => {
    Modal.confirm({
      title: "Thoát bài thi",
      content: "Nếu thoát bây giờ, các câu trả lời chưa nộp sẽ bị mất. Bạn có chắc chắn muốn thoát?",
      okText: "Thoát",
      cancelText: "Ở lại",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await removeExam(id);
          navigate("/student/create/test");
        } catch (error) {
          message.error("Thoát bài thi thất bại");
        }
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 px-6 py-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900" onClick={handleExit}>
          <ArrowLeft size={18} />
          Thoát bài thi
        </button>

        <h1 className="font-semibold text-slate-800">{exam.title}</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-red-500 font-semibold">
            <Clock3 size={18} />
            <div className="w-[50px] text-center tabular-nums">
              {formatTime()}
            </div>
          </div>

          <button
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
            onClick={checknopbai}
          >
            {!loading ? "Nộp bài" : "Đang nộp bài..."}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-indigo-600 font-medium">
                Câu {currentQuestionIndex + 1} / {exam.questions.length}
              </p>

              <button
                className={`flex items-center gap-2 ${markedQuestions.includes(currentQuestion?.question_id)
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-slate-500 hover:text-slate-700"
                  }`}
                onClick={() => {
                  const qId = currentQuestion.question_id;
                  setMarkedQuestions((prev) =>
                    prev.includes(qId) ? prev.filter((q) => q !== qId) : [...prev, qId]
                  );
                }}
              >
                <Flag
                  size={16}
                  fill={markedQuestions.includes(currentQuestion?.question_id) ? "currentColor" : "none"}
                />
                Đánh dấu
              </button>
            </div>

            <h2 className="text-lg font-medium text-slate-800 leading-relaxed mb-8">
              {currentQuestion?.content}
            </h2>
            {currentQuestion.image && (
              <div
                style={{
                  textAlign: "center",
                  margin: "20px 0",
                }}
              >
                <Image
                  src={currentQuestion.image}
                  alt="Hình minh họa"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 350,
                    borderRadius: 8,
                  }}
                />
              </div>
            )}
            <div className="space-y-4">
              {currentQuestion?.options.map((answer, index) => {
                const option = String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion.question_id] === option;

                return (
                  <label
                    key={option}
                    className={`block border rounded-2xl p-4 cursor-pointer transition ${isSelected ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.question_id}`}
                      value={option}
                      checked={isSelected}
                      onChange={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentQuestion.question_id]: option,
                        }))
                      }
                      className="hidden"
                    />

                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-sm ${isSelected ? "bg-indigo-600 text-white border-indigo-600" : ""
                          }`}
                      >
                        {option}
                      </div>
                      <span>{answer.text}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              <button
                disabled={currentQuestionIndex === 0}
                className="px-5 py-3 border rounded-xl hover:bg-slate-50 disabled:opacity-50"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              >
                ← Câu trước
              </button>

              <button
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, exam.questions.length - 1))}
              >
                Câu tiếp →
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sticky top-24">
            <h3 className="font-semibold mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {exam.questions.map((question, index) => {
                const isCurrent = index === currentQuestionIndex;
                const isAnswered = !!answers[question.question_id];
                const isMarked = markedQuestions.includes(question.question_id);

                return (
                  <button
                    key={question.question_id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`h-10 rounded-lg text-sm font-medium transition ${isCurrent
                      ? "bg-indigo-600 text-white"
                      : isMarked
                        ? "bg-yellow-300 text-yellow-800"
                        : isAnswered
                          ? "bg-green-300 text-green-800"
                          : "bg-slate-200 hover:bg-slate-300"
                      }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <hr className="my-5" />
            <h3 className="font-semibold mb-4">Thông tin bài thi</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Số câu hỏi</span>
                <span>{exam.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian</span>
                <span>{exam.time} phút</span>
              </div>
              <div className="flex justify-between">
                <span>Độ khó</span>
                <span>Trung bình</span>
              </div>
              <div className="flex justify-between">
                <span>Chương</span>
                <span>OOP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
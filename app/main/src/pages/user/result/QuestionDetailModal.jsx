import { Modal, Tag } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";

const QuestionDetailModal = ({
  open,
  onClose,
  question,
}) => {
  if (!question) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      title="Chi tiết câu hỏi"
    >
      <div className="space-y-5">

        {/* Tags */}
        <div className="flex flex-wrap gap-2">

          <Tag color="blue">
            {question.chapter_name}
          </Tag>

          <Tag color="purple">
            {question.lesson_name}
          </Tag>

          <Tag color="gold">
            {question.difficulty}
          </Tag>

          <Tag color="cyan">
            {question.knowledgeType === "concept"
              ? "Lý thuyết"
              : "Bài tập"}
          </Tag>

        </div>

        {/* Question */}
        <div className="p-4 rounded-xl bg-slate-50">
          <h3 className="text-lg font-semibold">
            {question.content}
          </h3>
        </div>

        {/* User Answer */}
        <div
          className={`
            p-4 rounded-xl border

            ${question.is_correct
              ? "border-green-300 bg-green-50"
              : "border-red-300 bg-red-50"
            }
          `}
        >
          <div className="flex justify-between items-center mb-2">

            <span className="font-semibold">
              Câu trả lời của bạn
            </span>

            {question.is_correct ? (
              <CheckCircleFilled
                className="text-green-600 text-lg"
              />
            ) : (
              <CloseCircleFilled
                className="text-red-600 text-lg"
              />
            )}
          </div>

          <p>
            <strong>
              {question.user_answer}
            </strong>
            {" - "}
            {question.user_answer_content || "Chưa chọn"}
          </p>
        </div>

        {/* Correct Answer */}
        <div className="p-4 rounded-xl border border-green-300 bg-green-50">

          <div className="flex justify-between items-center mb-2">

            <span className="font-semibold">
              Đáp án đúng
            </span>

            <CheckCircleFilled
              className="text-green-600 text-lg"
            />
          </div>

          <p>
            <strong>
              {question.correct_answer}
            </strong>
            {" - "}
            {question.correct_answer_content}
          </p>

        </div>

        {/* Result */}
        <div
          className={`
            rounded-xl p-4 text-center font-semibold

            ${question.is_correct
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
            }
          `}
        >
          {question.is_correct
            ? "✓ Bạn đã trả lời đúng"
            : "✗ Bạn đã trả lời sai"}
        </div>

      </div>
    </Modal>
  );
};

export default QuestionDetailModal;
require("dotenv").config();

const subjectS = require("../services/subjectS");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY,
});

let subjectNames = "";

const initSubjects = async () => {
    const subjects = await subjectS.getAll();

    subjectNames = subjects.map((item) => item.name).join(", ");

    console.log("AI Subjects:", subjectNames);
};

const chat = async (message, history = []) => {
    if (!subjectNames) {
        await initSubjects();
    }
    const recentHistory = history.slice(-5);;

    const historyText = recentHistory.map((msg) => `${msg.role === "user" ? "Người dùng" : "Trợ lý"}: ${msg.content}`).join("\n");

    const prompt = `
Bạn là trợ lý học tập cho hệ thống trắc nghiệm và đánh giá người dùng.

Các môn học hiện có:
${subjectNames}

Quy tắc:
- Chỉ hỗ trợ các câu hỏi liên quan đến học tập và các môn học trong hệ thống.
- Có thể trả lời các câu giao tiếp cơ bản hoặc các chia sẻ liên quan đến việc học.
- Từ chối các câu hỏi ngoài phạm vi học tập hãy trả lời "Tôi không được cho phép trả lời các câu hỏi ngoài chủ đề của hệ thống."
- Nếu câu hỏi hiện tại là câu hỏi tiếp nối, hãy sử dụng lịch sử hội thoại để hiểu ngữ cảnh.
Ví dụ:
+ "giải thích kỹ hơn"
+ "ví dụ đi"
+ "nó hoạt động như nào"
+ "O(n log n) là gì"

=> cần hiểu theo chủ đề đang được hỏi trước đó.

- Không nhắc lại toàn bộ nội dung cũ nếu không cần thiết.
- Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.

Lịch sử hội thoại:
${historyText}

Câu hỏi hiện tại:
${message}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
};

module.exports = {
    chat,
};

// chạy lấy data các môn học
initSubjects().catch(console.error);
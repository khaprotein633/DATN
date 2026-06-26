const chapterM = require("../models/chapterM");
const subjectM = require("../models/subjectM");
const lessonM = require("../models/lessonM");
const examM = require("../models/examM");
const resultM = require("../models/resultM");

const getBySubjectId = async (subject_id, user_id) => {
    //lấy danh sách bài thi ra
   

    //lấy danh sách kết quả ra
    const allResults = await resultM.find({
        user_id: user_id,
        subject_id: subject_id
    }).sort({ createdAt: -1 });

    if (allResults.length === 0) {
        return {
            overview: {
                totalAttempts: 0,
                avgScore: 0,
                bestScore: 0,
                worstScore: 0,
            },
            summary: "Bạn chưa thực hiện bài thi nào cho môn học này.",
            strongest: [],
            weaknesses: [],
            chapterStats: [],
            knowledgeStats: {},
            recommendations: [
                "Hãy làm ít nhất một bài thi để hệ thống đánh giá."
            ]
        };
    }
    // lọc các bài làm rác
    const validResults = allResults.filter(result => {
        const answeredCount = result.answers.filter(
            answer => answer.selected !== "Chưa chọn"
        ).length;
        if (answeredCount >= 5) {
            return true;
        }
        return false;
    });
    const assessmentResults = validResults.slice(0, 15);
    const historyResults = validResults;



    // Thống kê tổng thể theo môn học
    const totalExams = await examM.countDocuments({
        created_by: user_id, subject_id: subject_id
    });
    const totalAttempts = historyResults.length;
    const scores = historyResults.map(r => r.score);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / totalAttempts;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    // lấy lịch sử làm bài 
    const progressChart = historyResults
        .slice() // copy
        .reverse() // cũ -> mới
        .map((result, index) => ({
            attempt: index + 1,
            score: result.score,
            date: result.createdAt
        }));

    const chapters = await chapterM.find({ subject_id }).sort({ order: 1 });;

    const chapterNameMap = {};
    //  const chapterCodeMap = {};
    const chapterOrderMap = {};
    chapters.forEach(chapter => {
        chapterNameMap[chapter._id] = chapter.name;
        // chapterCodeMap[chapter._id] = chapter.code;
        chapterOrderMap[chapter._id] = chapter.order;
    });

    const chapterIds = chapters.map(ch => ch._id);
    const lessons = await lessonM.find({ chapter_id: { $in: chapterIds } }).sort({ chapter_id: 1, order: 1 });

    const lessonNameMap = {};
    const lessonOrderMap = {};
    lessons.forEach(lesson => {
        lessonNameMap[lesson._id] = lesson.name;
        lessonOrderMap[lesson._id] = lesson.order;
    });

    // thực hiện tính toán đánh giá dựa trên kết quả 10 bài thi gần nhất
    const allAnswers = assessmentResults.flatMap(r => r.answers);
    const chapterMap = {};
    allAnswers.forEach(answer => {

        if (!chapterMap[answer.chapter_id]) {
            chapterMap[answer.chapter_id] = {
                total: 0,
                correct: 0,
                lessons: {}
            };
        }

        chapterMap[answer.chapter_id].total++;

        if (answer.isCorrect) {
            chapterMap[answer.chapter_id].correct++;
        }

        const lessonId = answer.lesson_id;

        if (!chapterMap[answer.chapter_id].lessons[lessonId]) {
            chapterMap[answer.chapter_id].lessons[lessonId] = {
                total: 0,
                correct: 0
            };
        }

        chapterMap[answer.chapter_id].lessons[lessonId].total++;

        if (answer.isCorrect) {
            chapterMap[answer.chapter_id].lessons[lessonId].correct++;
        }

    });

    const chapterStats = Object.entries(chapterMap).map(
        ([chapter_id, chapterData]) => {

            const mastery = Math.round((chapterData.correct / chapterData.total) * 100);

            const lessons = Object.entries(chapterData.lessons)
                .map(
                    ([lesson_id, lessonData]) => ({
                        lesson_id,
                        lesson_name: lessonNameMap[lesson_id] || "Không xác định",
                        order: lessonOrderMap[lesson_id] || 999,
                        total: lessonData.total,
                        mastery: Math.round(
                            (lessonData.correct / lessonData.total) * 100
                        )
                    })
                ).sort((a, b) => a.order - b.order);

            return {
                chapter_id,
                
                total: chapterData.total,
                chapter_name: chapterNameMap[chapter_id] || "Không xác định",
                mastery,
                order: chapterOrderMap[chapter_id],
                lessons
            };
        }
    );

    
    chapterStats.sort((a, b) => a.order - b.order);
    const knowledgeMap = {};

    allAnswers.forEach(answer => {

        if (!knowledgeMap[answer.knowledgeType]) {
            knowledgeMap[answer.knowledgeType] = {
                total: 0,
                correct: 0
            };
        }

        knowledgeMap[answer.knowledgeType].total++;

        if (answer.isCorrect) {
            knowledgeMap[answer.knowledgeType].correct++;
        }

    });
    const knowledgeStats = {};
    Object.entries(knowledgeMap).forEach(
        ([key, value]) => {

            knowledgeStats[key] = Math.round(
                (value.correct / value.total) * 100
            );

        }
    );

    const sorted = [...chapterStats].sort((a, b) => b.mastery - a.mastery);
    const strongest = sorted.filter(c => c.mastery >= 75).map(c => c.chapter_name);
    const weaknesses = sorted.filter(c => c.mastery < 60).map(c => c.chapter_name);


    const recommendations = [];

    chapterStats.forEach(chapter => {

        const weakLessons = chapter.lessons.filter(
            lesson => lesson.mastery < 60
        );

        if (weakLessons.length > 0) {

            const lessonNames = weakLessons.map(
                lesson => lesson.lesson_name
            );

            recommendations.push(
                `${chapter.chapter_name}: cần ôn tập các bài ${lessonNames.join(", ")}`
            );
        }

    });

    const strongCount = strongest.length;
    const weakCount = weaknesses.length;
    let summary = "";

    if (weakCount === 0) {
        summary =
            "Bạn đang có mức độ thành thạo tốt ở hầu hết các chương kiến thức trong môn học.";
    }
    else if (weakCount <= 2) {
        summary =
            "Bạn có nền tảng kiến thức khá tốt nhưng vẫn còn một số nội dung cần được củng cố thêm.";
    }
    else {
        summary =
            "Bạn cần dành thêm thời gian ôn tập các chương kiến thức trọng tâm để cải thiện kết quả học tập.";
    }

    return {
        overview: {
            totalExams,
            totalAttempts,
            avgScore,
            bestScore,
            worstScore,
        },

        summary,
        progressChart,
        strongest,
        weaknesses,
        chapterStats,
        knowledgeStats,
        recommendations,
    };

};


module.exports = {
    getBySubjectId
}
const chapterM = require("../models/chapterM");
const subjectM = require("../models/subjectM");
const lessonM = require("../models/lessonM");
const examM = require("../models/examM");
const resultM = require("../models/resultM");

const getBySubjectId = async (subject_id, user_id) => {
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

    // thống kê tổng thể theo môn học
    const totalExams = await examM.countDocuments({ created_by: user_id, subject_id: subject_id });
    const totalAttempts = historyResults.length;
    const scores = historyResults.map(r => r.score);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / totalAttempts;
    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);
    // lấy lịch sử làm bài 
    const progressChart = historyResults.slice().reverse().map((result, index) => ({
        attempt: index + 1,
        score: result.score,
        date: result.createdAt
    }));

    // Lấy danh sách chương và bài học để ánh xạ tên
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

    // thực hiện tính toán đánh giá dựa trên kết quả 15 bài thi gần nhất
    const allAnswers = assessmentResults.flatMap(r => r.answers);
    // thống kê theo chương và bài học
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
                .map(([lesson_id, lessonData]) => {
                    const mastery = Math.round((lessonData.correct / lessonData.total) * 100);
                    return {
                        lesson_id: lesson_id,
                        lesson_name: lessonNameMap[lesson_id],
                        order: lessonOrderMap[lesson_id],
                        total: lessonData.total,
                        mastery: mastery
                    };
                });

            lessons.sort((a, b) => {
                return a.order - b.order;
            });

            return {
                chapter_id,
                total: chapterData.total,
                chapter_name: chapterNameMap[chapter_id],
                mastery,
                order: chapterOrderMap[chapter_id],
                lessons
            };
        }
    );
    chapterStats.sort((a, b) => a.order - b.order);

    //thống kê theo mức độ khó và loại kiến thức
    const difficultyStats = {};
    allAnswers.forEach(answer => {
        const difficulty = answer.difficulty;
        if (!difficultyStats[difficulty]) {
            difficultyStats[difficulty] = {
                total: 0,
                correct: 0
            };
        }
        difficultyStats[difficulty].total++;
        if (answer.isCorrect) {
            difficultyStats[difficulty].correct++;
        }
    });

    Object.keys(difficultyStats).forEach(difficulty => {
        const item = difficultyStats[difficulty];
        item.mastery = Math.round(
            item.correct / item.total * 100
        );

    });

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

    //const strongCount = strongest.length;
    //const weakCount = weaknesses.length;

    let summary = "";

    const recentResults = historyResults.slice(0, 5);
    const recentScores = recentResults.map(r => r.score);
    const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentResults.length;

    if (historyResults.length > recentResults.length) {
        // Lấy các bài cũ hơn trước đó
        const olderResults = historyResults.slice(recentResults.length);
        const olderScores = olderResults.map(r => r.score);
        const olderAvg = olderScores.reduce((sum, s) => sum + s, 0) / olderResults.length;

        // Định nghĩa biên độ tiến bộ (ví dụ: điểm gần đây cao hơn điểm cũ từ 1 điểm trở lên)
        const improvementThreshold = 1.0;

        if (recentAvg - olderAvg >= improvementThreshold) {
            summary = `Bạn đang có sự tiến bộ vượt bậc! Dù giai đoạn đầu gặp khó khăn, phong độ gần đây của bạn (Trung bình ${recentAvg.toFixed(1)} điểm) đang tăng trưởng rất tốt. Hãy tiếp tục duy trì đà này nhé!`;
        } else if (olderAvg - recentAvg >= improvementThreshold) {
            summary = `Phong độ gần đây của bạn đang có dấu hiệu sụt giảm so với giai đoạn đầu. Hãy xem lại các đề xuất ôn tập bên dưới để lấy lại phong độ nhé.`;
        }
    }

    if (!summary) {
        if (recentAvg >= 7.5) {
            summary = "Bạn đang giữ vững phong độ học tập tốt, các bài thi gần đây cho thấy bạn nắm rất chắc kiến thức.";
        } else if (recentAvg >= 6.5) {
            summary = "Kết quả các bài thi gần đây của bạn ở mức khá. Chỉ cần tập trung củng cố thêm vài lỗ hổng là có thể bứt phá lên điểm giỏi.";
        } else if (recentAvg >= 5) {
            summary = "Phong độ hiện tại của bạn đang ở mức trung bình. Bạn cần kiên trì luyện tập và bám sát các chương chưa đạt để cải thiện điểm số.";
        } else {
            summary = "Kết quả các bài làm gần đây còn hạn chế. Bạn nên tạm dừng làm đề mới và dành thời gian đọc lại lý thuyết các phần cốt lõi.";
        }
    }

    // if (avgScore >= 7.5) {
    //     summary = "Bạn đang có kết quả học tập tốt, cho thấy khả năng nắm vững kiến thức trong môn học.";
    // }
    // else if (avgScore >= 6.5) {
    //     summary = "Bạn có kết quả học tập khá, tuy nhiên vẫn cần củng cố thêm một số kiến thức để nâng cao kết quả.";
    // }
    // else if (avgScore >= 5) {
    //     summary = "Kết quả học tập của bạn đang ở mức trung bình, cần tiếp tục ôn tập để cải thiện khả năng nắm bắt kiến thức.";
    // }
    // else {
    //     summary = "Kết quả học tập của bạn còn hạn chế, cần tập trung củng cố lại các kiến thức nền tảng.";
    // }

    return {
        overview: {
            totalExams,
            totalAttempts,
            avgScore,
            bestScore,
            worstScore,
        },
        difficultyStats,
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
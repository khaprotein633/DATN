const subjectM = require("../models/subjectM");
const lessonM = require("../models/lessonM");
const examM = require("../models/examM");
const resultM = require("../models/resultM");
const chapterM = require("../models/chapterM");
const questionM = require("../models/questionM");

const getOverview = async () => {
    const totalSubjects = await subjectM.countDocuments();
    const totalExams = await examM.countDocuments();
    const totalresults = await resultM.countDocuments();
    const totalQuestions = await questionM.countDocuments();
    return {
        totalSubjects, totalExams, totalresults, totalQuestions
    }
};

const getSubjectAccuracy = async (user_id) => {

    const results = await resultM.aggregate([

        {
            $match: {
                user_id
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $group: {
                _id: "$subject_id",
                results: {
                    $push: "$$ROOT"
                }
            }
        },

        {
            $project: {
                subject_id: "$_id",
                results: {
                    $slice: [
                        "$results",
                        10
                    ]
                }
            }
        },

        {
            $lookup: {
                from: "subjects",
                localField: "subject_id",
                foreignField: "_id",
                as: "subject"
            }
        },

        {
            $unwind: {
                path: "$subject",
                preserveNullAndEmptyArrays: true
            }
        }

    ]);



    return results.map(subject => {

        let totalQuestion = 0;
        let correctQuestion = 0;


        subject.results.forEach(result => {

            result.answers.forEach(answer => {

                totalQuestion++;

                if (answer.isCorrect) {
                    correctQuestion++;
                }

            });

        });


        return {

            subject_id: subject.subject_id,

            subject_name: subject.subject?.name || "Không xác định",

            totalQuestion,

            correctQuestion,

            accuracy:
                totalQuestion === 0
                    ? 0
                    :
                    Number(
                        (
                            correctQuestion / totalQuestion * 100
                        )
                            .toFixed(2)
                    )

        };

    });

};

const getQuickAssessment = async (user_id) => {
    // 1. Tổng lượt làm + điểm trung bình
    const overview = await resultM.aggregate([
        { $match: { user_id } },
        {
            $group: {
                _id: null,

                totalExam: {
                    $sum: 1
                },
                avgScore: {
                    $avg: "$score"
                }
            }
        }
    ]);
    // 2. Độ chính xác
    const accuracyData = await resultM.aggregate([
        { $match: { user_id } },
        { $unwind: "$answers" },
        {
            $group: {
                _id: null,
                totalQuestion: { $sum: 1 },
                correctAnswer: {
                    $sum: { $cond: ["$answers.isCorrect", 1, 0] }
                }
            }
        }

    ]);

    // 3. Môn làm nhiều nhất
    const favoriteSubject = await resultM.aggregate([
        { $match: { user_id } },
        { $group: { _id: "$subject_id", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: "subjects",
                localField: "_id",
                foreignField: "_id",
                as: "subject"
            }
        },
        { $unwind: "$subject" },
        {
            $project: {
                _id: 0,
                subject_id: "$_id",
                name: "$subject.name",
                total: 1
            }
        }

    ]);
    return {
        totalExam: overview.length ? overview[0].totalExam : 0,
        avgScore: overview.length ? Number(overview[0].avgScore.toFixed(2)) : 0,
        accuracy: accuracyData.length ? Number((
            accuracyData[0].correctAnswer / accuracyData[0].totalQuestion * 100
        ).toFixed(2)) : 0,
        favoriteSubject: favoriteSubject.length ? favoriteSubject[0] : null
    };
};

const getRecentActivities = async (user_id) => {

    const results = await resultM.aggregate([
        {
            $match: {
                user_id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "subjects",
                localField: "subject_id",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $unwind: {
                path: "$subject",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "exams",
                localField: "exam_id",
                foreignField: "_id",
                as: "exam"
            }
        },
        {
            $unwind: {
                path: "$exam",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                title: {
                    $ifNull: [
                        "$exam.title",
                        "Bài kiểm tra"
                    ]
                },
                subject: {
                    $ifNull: [
                        "$subject.name",
                        "Không xác định"
                    ]
                },
                score: 1,
                createdAt: 1
            }
        }
    ]);

    return results;
};


module.exports = {
    getOverview, getSubjectAccuracy, getQuickAssessment, getRecentActivities
};
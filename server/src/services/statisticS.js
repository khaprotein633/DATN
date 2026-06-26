const chapterM = require("../models/chapterM");
const subjectM = require("../models/subjectM");
const lessonM = require("../models/lessonM");
const examM = require("../models/examM");
const resultM = require("../models/resultM");
const userM = require("../models/userM");
const questionM = require("../models/questionM");


const getStatistic = async () => {
    const [
        totalSubjects,
        totalUsers,
        totalQuestions,
        totalExams,
        totalResults,
        recentUsers,
    ] = await Promise.all([
        subjectM.countDocuments(),
        userM.countDocuments(),
        questionM.countDocuments(),
        examM.countDocuments(),
        resultM.countDocuments(),
        userM
            .find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("fullName email createdAt"),
    ]);

    return {
        totalSubjects,
        totalUsers,
        totalQuestions,
        totalExams,
        totalResults,
        recentUsers,
    };
};

module.exports = {
  
   getStatistic
}
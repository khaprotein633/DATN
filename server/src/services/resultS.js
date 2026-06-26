const resultM = require("../models/resultM");
const questionM = require("../models/questionM")
const examM = require("../models/examM")
const subjectM = require("../models/subjectM")
const chapterM = require("../models/chapterM")
const lessonM = require("../models/lessonM")

const getAll = async () => {
  return await resultM.find();
};

const getAllHistoryByUser = async (user_id, page = 1, limit = 10) => {

  const subjects = await subjectM.find().lean();

  const subjectMap = {};

  subjects.forEach(subject => { subjectMap[subject._id] = subject.name });

  const exams = await examM.find({ created_by: user_id }).lean();

  const examMap = {};

  exams.forEach(exam => {

    examMap[exam._id.toString()] = {

      exam_id: exam._id,

      subject_id: exam.subject_id,

      subject_name: subjectMap[exam.subject_id] || "Unknown",

      title: exam.title,

      total_attempts: 0,

      highest_score: 0,

      lowest_score: 0,

      last_attempt: null,

      createdAt: exam.createdAt
    };

  });

  const examIds = exams.map(exam => exam._id.toString());

  const results = await resultM.find({ exam_id: { $in: examIds } }).lean();

  results.forEach(result => {

    const exam = examMap[result.exam_id];

    if (!exam) return;

    exam.total_attempts++;

    if (exam.total_attempts === 1) {

      exam.highest_score = result.score;
      exam.lowest_score = result.score;
      exam.last_attempt = result.createdAt;

    } else {

      exam.highest_score = Math.max(exam.highest_score, result.score);
      exam.lowest_score = Math.min(exam.lowest_score, result.score);

      if (new Date(result.createdAt) > new Date(exam.last_attempt)) {
        exam.last_attempt = result.createdAt;
      }
    }

  });

  // convert array
  const histories = Object.values(examMap);

  // sort mới nhất
  histories.sort((a, b) => new Date(b.last_attempt || b.createdAt) - new Date(a.last_attempt || a.createdAt));

  // pagination
  const total = histories.length;

  const start = (page - 1) * limit;

  const paginatedData = histories.slice(start, start + limit);

  return {
    data: paginatedData,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };

};

const getHistoryBySubject = async (
  user_id,
  subject_id, page = 1,limit = 10
) => {

  // lấy môn học
  const subject = await subjectM
    .findById(subject_id)
    .lean();

  // lấy đề user tự tạo theo môn
  const exams = await examM.find({
    created_by: user_id,
    subject_id
  }).lean();

  // map exam
  const examMap = {};

  exams.forEach(exam => {

    examMap[exam._id.toString()] = {

      exam_id: exam._id,

      subject_id,

      subject_name: subject?.name || "Unknown",

      title: exam.title,

      total_attempts: 0,

      highest_score: 0,

      lowest_score: 0,

      last_attempt: null,

      createdAt: exam.createdAt
    };

  });

  // danh sách exam id
  const examIds = exams.map(
    exam => exam._id.toString()
  );

  // lấy kết quả làm bài
  const results = await resultM.find({
    exam_id: { $in: examIds }
  }).lean();

  // thống kê
  results.forEach(result => {

    const exam = examMap[result.exam_id];

    if (!exam) return;

    exam.total_attempts++;

    // lần đầu
    if (exam.total_attempts === 1) {

      exam.highest_score = result.score;

      exam.lowest_score = result.score;

      exam.last_attempt = result.createdAt;

    } else {

      exam.highest_score = Math.max(
        exam.highest_score,
        result.score
      );

      exam.lowest_score = Math.min(
        exam.lowest_score,
        result.score
      );

      // lần làm gần nhất
      if (
        new Date(result.createdAt) >
        new Date(exam.last_attempt)
      ) {

        exam.last_attempt = result.createdAt;

      }

    }

  });

  // convert array
  const histories = Object.values(examMap);

  // sort theo lần làm gần nhất
  histories.sort(
    (a, b) =>
      new Date(b.last_attempt || b.createdAt) -
      new Date(a.last_attempt || a.createdAt)
  );

  // pagination
  const total = histories.length;

  const start = (page - 1) * limit;

  const paginatedData = histories.slice(
    start,
    start + limit
  );

  return {

    data: paginatedData,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

  };

};

const getAllByExam = async (exam_id)=>{
  return results = await resultM.find({exam_id})
   
}

const getById = async (id) => {
  const result = await resultM.findById(id);
  if (!result) throw new Error("Result not found");
  const exam = await examM.findById(result.exam_id);
  if (!exam) throw new Error("Exam not found");
  const subject = await subjectM.findById(exam.subject_id);
  if (!subject) throw new Error("subject not found");

  const questionMap = new Map(exam.questions.map((q) => [q.question_id.toString(), q]));

  const chapterIds = [
    ...new Set(
      exam.questions.map(q => q.chapter_id)
    )
  ];

  const lessonIds = [
    ...new Set(
      exam.questions.map(q => q.lesson_id)
    )
  ];

  const chapters = await chapterM.find({ _id: { $in: chapterIds } });

  const lessons = await lessonM.find({ _id: { $in: lessonIds } });

  const chapterMap = new Map(chapters.map(c => [c._id.toString(), c.name]));

  const lessonMap = new Map(lessons.map(l => [l._id.toString(), l.name]));

  const answerIndexMap = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
  };

  const answerDetails = result.answers.map((answer) => {
    const question = questionMap.get(answer.question_id.toString());

    const chaptername = chapterMap.get(question.chapter_id)
    const lessonname = lessonMap.get(question.lesson_id)


    const selectedOption = answer.selected === "Chưa chọn"
      ? null
      : question.options[answerIndexMap[answer.selected]];

    const answerStatus =
      answer.selected === "Chưa chọn"
        ? "skipped"
        : answer.isCorrect
          ? "correct"
          : "wrong";
    const correctIndex = question.options.findIndex((option) => option.isCorrect);
    const correctAnswerLetter = String.fromCharCode(65 + correctIndex);
    const correctOption = question.options.find((option) => option.isCorrect);

    return {
      question_id: answer.question_id,

      content: question.content,

      chapter_id: question.chapter_id,
      chapter_name: chaptername,

      lesson_id: question.lesson_id,
      lesson_name: lessonname,

      knowledgeType: question.knowledgeType,

      user_answer: answer.selected,
      user_answer_content: selectedOption?.text || null,

      correct_answer: correctAnswerLetter,
      correct_answer_content: correctOption?.text || null,

      difficulty: question.difficulty,

      answerStatus,

      is_correct: answer.isCorrect,
    };

  });

  const totalQuestions = answerDetails.length;

  const correctCount = answerDetails.filter(
    item => item.answerStatus === "correct"
  ).length;

  const unansweredCount = answerDetails.filter(
    item => item.answerStatus === "skipped"
  ).length;

  const wrongCount = answerDetails.filter(
    item => item.answerStatus === "wrong"
  ).length;

  const correctPercentage = Math.round(
    (correctCount / totalQuestions) * 100
  );

  const wrongPercentage = Math.round(
    (wrongCount / totalQuestions) * 100
  );

  const skippedPercentage = Math.round(
    (unansweredCount / totalQuestions) * 100
  );

  // tính tổng hợp để đưa ra kết quả 
  //đánh giá theo chương
  const chapterStats = {};
  answerDetails.forEach((item) => {
    if (!chapterStats[item.chapter_name]) {
      chapterStats[item.chapter_name] = {
        chapter_name: item.chapter_name,
        total: 0,
        wrong: 0,
        skipped: 0,
        correct: 0,
      };
    }
    chapterStats[item.chapter_name].total++;
    if (item.answerStatus === "correct") {
      chapterStats[item.chapter_name].correct++;
    } else if (item.answerStatus === "wrong") {
      chapterStats[item.chapter_name].wrong++;
    } else {
      chapterStats[item.chapter_name].skipped++;
    }
  });
  const chapterStatsArray = Object.values(chapterStats)
    .map((item) => ({
      ...item,
      percentage: Math.round(
        (item.correct / item.total) * 100
      ),
    }));

  /// đánh giá theo bài
  const lessonStats = {};
  answerDetails.forEach((item) => {
    if (!lessonStats[item.lesson_name]) {
      lessonStats[item.lesson_name] = {
        lesson_name: item.lesson_name,
        total: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,

      };
    }
    lessonStats[item.lesson_name].total++;
    if (item.is_correct) {
      lessonStats[item.lesson_name].correct++;
    } else if (item.answerStatus === "wrong") {
      lessonStats[item.lesson_name].wrong++;
    } else {
      lessonStats[item.lesson_name].skipped++;
    }
  });
  const lessonStatsArray = Object.values(lessonStats)
    .map((item) => ({
      ...item,
      percentage: Math.round(
        (item.correct / item.total) * 100
      ),
    }));

  //// đánh giá kiến thưc 
  const knowledgeStats = {};
  answerDetails.forEach((item) => {
    if (!knowledgeStats[item.knowledgeType]) {
      knowledgeStats[item.knowledgeType] = {
        knowledgeType: item.knowledgeType,
        total: 0,
        correct: 0,
      };
    }
    knowledgeStats[item.knowledgeType].total++;
    if (item.is_correct) {
      knowledgeStats[item.knowledgeType].correct++;
    }
  });
  const knowledgeStatsArray = Object.values(knowledgeStats)
    .map((item) => ({
      ...item,
      percentage: Math.round(
        (item.correct / item.total) * 100
      ),
    }));

  return {
    ...result.toObject(),
    time: exam.time,
    totalQuestions,
    unansweredCount,
    skippedPercentage,
    correctCount,
    correctPercentage,
    wrongCount,
    wrongPercentage,
    subject_name: subject.name,
    difficulty_mode: exam.
      difficulty_mode,
    chapter_stats: chapterStatsArray,
    lesson_stats: lessonStatsArray,
    knowledge_stats: knowledgeStatsArray,
    answers: answerDetails,
  };
}

const add = async (data) => {
  //console.log("data:", data);
  const answers = data.answers;

  const exam_id = data.exam_id
  const exam = await examM.findById(exam_id);

  const resultAnswers = [];
  let correctCount = 0;

  for (const question of exam.questions) {
    const userAnswer = answers[question.question_id];
    // tìm vị trí đáp án đúng
    const correctIndex = question.options.findIndex(option => option.isCorrect);
    // convert index -> A B C D
    const correctAnswer = String.fromCharCode(65 + correctIndex);
    // kiểm tra đúng sai
    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) { correctCount++ }
    const ans = {
      question_id: question.question_id,
      lesson_id: question.lesson_id,
      chapter_id: question.chapter_id,
      subject_id: question.subject_id,
      knowledgeType: question.knowledgeType,
      difficulty: question.difficulty,
      selected: userAnswer || "Chưa chọn",
      isCorrect: isCorrect,
    }

    resultAnswers.push(ans);
  }

  const score = ((correctCount / exam.total_question) * 10).toFixed(1);

  let description = "";
  if (score >= 8) {
    description = "Bạn có kiến thức tốt.";
  }
  else if (score >= 5) {
    description = "Bạn cần luyện tập thêm.";

  } else {
    description = "Bạn nên ôn tập lại kiến thức.";
  }
  const newResult = await resultM.create({
    user_id: data.user_id,
    exam_id: exam_id,
    subject_id: exam.subject_id,
    answers: resultAnswers,
    score: score,
    description: description
  });

  return newResult;
};

const update = async (data) => {
  const exists = await result.findOne({
    where: { name: data.newName },
  });
  if (exists) throw new Error("Subject name already in use");

  const sub = await subject.findByPk(data.id);
  if (!sub) throw new Error("Subject not found");

  sub.name = data.newName;
  await sub.save();
  return sub;
};

const remove = async (id) => {
  const sub = await subject.findById(id);
  if (!sub) throw new Error("Subject not found");
  await sub.destroy();
  return { message: "Subject deleted successfully" };
};

module.exports = {
  getAll,
  getById,
  getAllByExam,
  getAllHistoryByUser,
  getHistoryBySubject,
  add,
  update,
  remove,
};
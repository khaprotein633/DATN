const Question = require("../models/questionM");
const Lesson = require("../models/lessonM");
const Chapter = require("../models/chapterM");

const questionS = require("../services/questionS");
const examM = require("../models/examM");
const subjectM = require("../models/subjectM");


const getAll = async () => {
  return await examM.find();
};


const getList = async (
  page = 1,
  limit = 10,
  search = "",
  subject_id = "",
  created_by = ""
) => {
  const query = {};

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (subject_id) {
    query.subject_id = subject_id;
  }

  if (created_by) {
    query.created_by = created_by;
  }

  const [
    totalEasy,
    totalMedium,
    totalHard,
    totalExam,
    total,
    exams,
  ] = await Promise.all([
    examM.countDocuments({
      difficulty_mode: "easy",
    }),

    examM.countDocuments({
      difficulty_mode: "medium",
    }),

    examM.countDocuments({
      difficulty_mode: "hard",
    }),

    examM.countDocuments(),

    examM.countDocuments(query),

    examM
      .find(query)
      .populate("subject_id", "name")
      .populate("created_by", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  return {
    statistics: {
      totalExam,
      totalEasy,
      totalMedium,
      totalHard,
    },
    exams,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  const exam = await examM.findById(id).populate("subject_id", "name");
  if (!exam) throw new Error("exam not found");
  return exam;
};

const getByUserId = async (user_id) => {
  const chap = await examM.findById(user_id);
  if (!chap) throw new Error("exam not found");
  return chap;
};


// logic tạo đề thi tự động chia câu hỏi trước rồi lấy câu theo độ khó sau
const add = async (data) => {

  const name_subject = await subjectM.findById(data.subject);
  // Kiểm tra tổng số câu hiện có
  const totalAvailable = await Question.countDocuments({
    lesson_id: { $in: data.lessons }
  });

  if (data.questionCount > totalAvailable) {
    throw new Error(`Ngân hàng hiện chỉ có ${totalAvailable} câu hỏi, không thể tạo đề ${data.questionCount} câu`);
  }

  // Chia số câu theo lesson
  const lessonCount = data.lessons.length;
  const baseQuestion = Math.floor(data.questionCount / lessonCount);
  const remainQuestion = data.questionCount % lessonCount;

  // Difficulty config
  const difficultyConfig = {
    all: {
      easy: 0.4,
      medium: 0.3,
      hard: 0.3,
    },
    easy: {
      easy: 0.6,
      medium: 0.3,
      hard: 0.1,
    },

    medium: {
      easy: 0.3,
      medium: 0.5,
      hard: 0.2,
    },

    hard: {
      easy: 0.1,
      medium: 0.4,
      hard: 0.5,
    },
  };

  // difficulty user chọn
  const selectedDifficulty = difficultyConfig[data.difficulty];

  let finalQuestions = [];
  // Loop từng lesson
  for (let i = 0; i < data.lessons.length; i++) {

    const lessonId = data.lessons[i];

    // chia đều số câu
    const lessonQuestionCount = i < remainQuestion ? baseQuestion + 1 : baseQuestion;

    // Tính số câu theo difficulty
    let easyCount = Math.round(lessonQuestionCount * selectedDifficulty.easy);
    let mediumCount = Math.round(lessonQuestionCount * selectedDifficulty.medium);
    let hardCount = lessonQuestionCount - easyCount - mediumCount;

    // lấy toàn bộ question 
    const questions = await Question.find({ lesson_id: lessonId });
    //console.log("questions", questions);
    if (questions.length < lessonQuestionCount) {
      throw new Error(`Lesson ${lessonId} không đủ câu hỏi`);
    }

    let easyQuestions = questions.filter(q => q.difficulty === "easy");
    let mediumQuestions = questions.filter(q => q.difficulty === "medium");
    let hardQuestions = questions.filter(q => q.difficulty === "hard");

    easyQuestions = easyQuestions.sort(() => Math.random() - 0.5);
    mediumQuestions = mediumQuestions.sort(() => Math.random() - 0.5);
    hardQuestions = hardQuestions.sort(() => Math.random() - 0.5);

    if (hardQuestions.length < hardCount) {
      const missing = hardCount - hardQuestions.length;
      hardCount = hardQuestions.length; mediumCount += missing;
    }

    if (mediumQuestions.length < mediumCount) {
      const missing = mediumCount - mediumQuestions.length;
      mediumCount = mediumQuestions.length; easyCount += missing;
    }

    if (easyQuestions.length < easyCount) {
      easyCount = easyQuestions.length;
      throw new Error(`Câu hỏi không đủ để tạo đề ở lesson: ${lessonId}`);
    }

    // lấy question cuối cùng
    const selectedQuestions = [
      ...easyQuestions.slice(0, easyCount),
      ...mediumQuestions.slice(0, mediumCount),
      ...hardQuestions.slice(0, hardCount)
    ];

    // random đáp án từng question
    const shuffledQuestions =
      selectedQuestions.map(question => ({
        ...question.toObject(),

        options:
          question.options.sort(
            () => Math.random() - 0.5
          )
      }));

    // push vào đề
    finalQuestions.push(
      ...shuffledQuestions
    );

  }
  // Trộn đề lần cuối
  finalQuestions =
    finalQuestions.sort(
      () => Math.random() - 0.5
    );

  const newtitle = "Đề trắc nghiệm môn: " + name_subject.name;

  const newExam = await examM.create({

    title: newtitle,

    subject_id: data.subject,

    questions: finalQuestions.map((q) => ({
      question_id: q._id,
      image: q.image,
      lesson_id: q.lesson_id,
      chapter_id: q.chapter_id,
      subject_id: q.subject_id,
      knowledgeType: q.knowledgeType,
      content: q.content,
      difficulty: q.difficulty,
      options: q.options

    })),

    time: data.duration,

    description: "Đề sinh tự động",

    total_question: finalQuestions.length,

    difficulty_mode: data.difficulty,
    created_by: data.user._id
  });

  return newExam;

};

// logic chia câu hỏi theo độ khó trước rồi lấy câu theo lesson sau
// const add = async (data) => {

//   const name_subject = await subjectM.findById(data.subject);


//   // kiểm tra tổng số câu
//   const totalAvailable = await Question.countDocuments({
//     lesson_id: { $in: data.lessons }
//   });


//   if (data.questionCount > totalAvailable) {
//     throw new Error(
//       `Ngân hàng hiện chỉ có ${totalAvailable} câu hỏi, không thể tạo đề ${data.questionCount} câu`
//     );
//   }

//   const difficultyConfig = {
//     easy:{
//       easy:0.6,
//       medium:0.3,
//       hard:0.1
//     },
//     medium:{
//       easy:0.3,
//       medium:0.5,
//       hard:0.2
//     },
//     hard:{
//       easy:0.1,
//       medium:0.4,
//       hard:0.5
//     }

//   };

//   const selectedDifficulty =difficultyConfig[data.difficulty];

//   // chia số lượng câu theo độ khó trước
//   let easyCount = Math.round(
//     data.questionCount * selectedDifficulty.easy
//   );
//   let mediumCount = Math.round(
//     data.questionCount * selectedDifficulty.medium
//   );
//   let hardCount =data.questionCount - easyCount - mediumCount;

//   // lấy toàn bộ câu trong các lesson đã chọn
//   const questions = await Question.find({lesson_id:{$in:data.lessons}});

//   let easyQuestions =questions.filter(q=>q.difficulty==="easy");
//   let mediumQuestions =questions.filter(q=>q.difficulty==="medium");
//   let hardQuestions =questions.filter(q=>q.difficulty==="hard");

//   // random câu hỏi
//   const shuffle = (arr)=>{
//     return arr.sort(
//       ()=>Math.random()-0.5
//     );
//   };

//   easyQuestions = shuffle(easyQuestions);
//   mediumQuestions = shuffle(mediumQuestions);
//   hardQuestions = shuffle(hardQuestions);

//   // nếu thiếu câu khó thì bù câu trung bình
//   if(hardQuestions.length < hardCount){
//     const missing =
//       hardCount - hardQuestions.length;
//     hardCount = hardQuestions.length;
//     mediumCount += missing;
//   }

//   // nếu thiếu câu trung bình thì bù câu dễ
//   if(mediumQuestions.length < mediumCount){
//     const missing =
//       mediumCount - mediumQuestions.length;
//     mediumCount = mediumQuestions.length;
//     easyCount += missing;
//   }

//   // nếu vẫn thiếu câu dễ thì không đủ dữ liệu
//   if(easyQuestions.length < easyCount){
//     throw new Error("Không đủ câu hỏi để tạo đề");
//   }
//   // lấy câu cuối cùng
//   let finalQuestions = [
//     ...easyQuestions.slice(0,easyCount),
//     ...mediumQuestions.slice(0,mediumCount),
//     ...hardQuestions.slice(0,hardCount)
//   ];

//   // random đáp án
//   finalQuestions = finalQuestions.map(question=>({
//     ...question.toObject(),
//     options:shuffle(
//       question.options
//     )
//   }));

//   // random thứ tự câu
//   finalQuestions = shuffle(finalQuestions);
//   const newExam = await examM.create({
//     title:
//       "Đề thi môn: " + name_subject.name,
//     subject_id:data.subject,
//     questions:finalQuestions.map(q=>({
//       question_id:q._id,
//       image:q.image,
//       lesson_id:q.lesson_id,
//       chapter_id:q.chapter_id,
//       subject_id:q.subject_id,
//       knowledgeType:q.knowledgeType,
//       content:q.content,
//       difficulty:q.difficulty,
//       options:q.options
//     })),
//     time:data.duration,
//     description:
//       "Đề sinh tự động",
//     total_question:
//       finalQuestions.length,
//     difficulty_mode:
//       data.difficulty,
//     created_by:
//       data.user._id
//   });
//   return newExam;
// };

const update = async (data) => {
  //   const exists = await exam.findOne({
  //     where: { name: data.newName , chapter_id: data.chapter_id},
  //   });
  //   if (exists) throw new Error("exam name already in use");

  //   const chap = await exam.findByPk(data.id);
  //   if (!chap) throw new Error("Subject not found");

  //   chap.name = data.newName;
  //   await chap.save();
  //   return chap;
};

const remove = async (id) => {
  const chap = await examM.findById(id);
  if (!chap) throw new Error("exam not found");
  await examM.findByIdAndDelete(id);
  return { message: "exam deleted successfully" };
};

module.exports = {
  getAll,
  getById,
  getList,
  add,
  update,
  remove,
};
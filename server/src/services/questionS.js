const questionM = require("../models/questionM");
const subjectM = require("../models/subjectM");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");
const chapterM = require("../models/chapterM");
const lessonM = require("../models/lessonM");
const XLSX = require("xlsx");

const getAll = async () => {
  return await questionM.find();
};

const getList = async (
  page = 1,
  limit = 10,
  subject_id = "",
  chapter_id = "",
  lesson_id = "",
  difficulty = "",
  knowledgeType = "",

  search = ""
) => {
  const query = {};
  let subject = {};

  if (search) {
    query.content = {
      $regex: search,
      $options: "i",
    };
  }
  if (difficulty) {
    query.difficulty = difficulty;
  }
  if (subject_id) {
    query.subject_id = subject_id;
    subject = await subjectM.findById(subject_id);
  }
  if (knowledgeType) {
    query.knowledgeType = knowledgeType;
  }

  if (chapter_id) {
    query.chapter_id = chapter_id;
  }

  if (lesson_id) {
    query.lesson_id = lesson_id;
  }

  const [
    totalQuestion,
    totalEasy,
    totalMedium,
    totalHard,
    total,
  ] = await Promise.all([
    questionM.countDocuments({
      subject_id: subject_id
    }),

    questionM.countDocuments({
      subject_id: subject_id,
      difficulty: "easy",
    }),

    questionM.countDocuments({
      subject_id: subject_id,
      difficulty: "medium",
    }),

    questionM.countDocuments({
      subject_id: subject_id,
      difficulty: "hard",
    }),

    questionM.countDocuments(query),
  ]);

  const questions = await questionM
    .find(query)
    .populate("subject_id", "name code")
    .populate("chapter_id", "name code")
    .populate("lesson_id", "name code")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    totalQuestion,
    totalEasy,
    totalMedium,
    totalHard,
    questions,
    subject,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  const list = await questionM.findById(id);
  if (!list) throw new Error("question not found");
  return list;
};

const getByLessonId = async (lesson_id, total) => {
  const list = await questionM.find({ lesson_id });

console.log(list.length);
  return await questionM.aggregate([
    {
      $match: {
        lesson_id: new mongoose.Types.ObjectId(lesson_id),
      },
    },
    {
      $sample: {
        size: Number(total),
      },
    },
  ]);
};

const getByChapterId = async (chapter_id) => {
  const list = await questionM.find({ chapter_id });
  if (!list) throw new Error("question not found");
  return list;
};

const add = async (data) => {
  const {
    content,
    options,
    subject_id,
    chapter_id,
    lesson_id,
    image,
    image_public_id,
    knowledgeType,
    difficulty,
    explanation,
    tags,
    createdBy,
  } = data;
  if (!image) {

    const exists = await questionM.findOne({
      lesson_id,
      content: {
        $regex: `^${content.trim()}$`,
        $options: "i",
      },
    }).populate("chapter_id", "name").populate("lesson_id", "name");
    if (exists) {
      return { duplicated: true, question: exists, };
    }
  }
  // Ít nhất 1 đáp án đúng
  const correctAnswers = options.filter(
    (option) => option.isCorrect
  );
  if (correctAnswers.length !== 1) {
    throw new Error("Câu hỏi phải có đúng 1 đáp án đúng");
  }

  const question = await questionM.create({
    content,
    options,
    subject_id,
    chapter_id,
    lesson_id,
    image,
    image_public_id,
    knowledgeType,
    difficulty,
    explanation,
    tags,
    createdBy,
  });

  return question;
};

const update = async (data) => {

  const {
    _id,
    content,
    options,
    subject_id,
    chapter_id,
    lesson_id,
    knowledgeType,
    difficulty,
    explanation,
    tags,
    createdBy,
    image,
    image_public_id,

  } = data;

  const oldQuestion = await questionM.findById(_id);

  if (!oldQuestion) {
    throw new Error("Không tìm thấy câu hỏi");
  }

  // Nếu có ảnh cũ và user upload ảnh mới
  if (oldQuestion.image_public_id && oldQuestion.image_public_id !== image_public_id
  ) {
    await cloudinary.uploader.destroy(oldQuestion.image_public_id);
  }

  // Chỉ check trùng khi KHÔNG có ảnh
  if (!image) {

    const exists = await questionM.findOne({
      _id: { $ne: _id },
      subject_id,
      chapter_id,
      lesson_id,
      content: {
        $regex: `^${content.trim()}$`,
        $options: "i",
      },
    });

    if (exists) {
      throw new Error("Nội dung câu hỏi đã tồn tại");
    }
  }
  const correctAnswers = options.filter((option) => option.isCorrect);

  if (correctAnswers.length !== 1) {
    throw new Error(
      "Câu hỏi phải có đúng 1 đáp án đúng"
    );
  }

  return await questionM.findByIdAndUpdate(_id,
    {
      content,
      options,
      image,
      image_public_id,
      subject_id,
      chapter_id,
      lesson_id,
      knowledgeType,
      difficulty,
      explanation,
      tags,
      createdBy,
    },
    {
      new: true,
      runValidators: true,
    }

  );

};

const remove = async (id) => {


  const question = await questionM.findById(id);
  if (!question) {
    throw new Error("Không tìm thấy câu hỏi");
  }
  // nếu câu hỏi có ảnh
  if (question.image_public_id) {
    await cloudinary.uploader.destroy(question.image_public_id);
  }
  await questionM.findByIdAndDelete(id);
  return true;

};

const removeMutil = async (ids) => {
  const questions = await questionM.find({
    _id: {
      $in: ids
    }
  });

  for (const q of questions) {
    if (q.image_public_id) {
      await cloudinary.uploader.destroy(
        q.image_public_id
      );
    }
  }
  await questionM.deleteMany({
    _id: {
      $in: ids
    }
  });
  return { message: "questions deleted successfully" };
};

const downloadTemplate = async (subjectId) => {

  const chapters = await chapterM.find({ subject_id: subjectId, });
  const chapterIds = chapters.map(
    chapter => chapter._id
  );
  const lessons = await lessonM.find({
    chapter_id: {
      $in: chapterIds,
    },
  }).populate("chapter_id");

  const workbook = XLSX.utils.book_new();

  // Sheet Questions

  const questionSheet = XLSX.utils.json_to_sheet([
    {
      chapter_code: "STACK",
      lesson_code: "STACK_INTRO",

      knowledgeType: "concept",
      difficulty: "easy",

      content: "Stack là gì?",

      optionA: "LIFO",
      optionB: "FIFO",
      optionC: "Tree",
      optionD: "Graph",

      correct: "A",

      explanation: "Stack là LIFO",

      tags: "stack,cautrucdulieu"
    },
  ]);

  XLSX.utils.book_append_sheet(
    workbook,
    questionSheet,
    "Questions"
  );

  // Sheet Chapter

  const chapterSheet =
    XLSX.utils.json_to_sheet(
      chapters.map(c => ({
        chapter_code: c.code,
        chapter_name: c.name,
      }))
    );

  XLSX.utils.book_append_sheet(
    workbook,
    chapterSheet,
    "Chapters"
  );

  // Sheet Lesson
  const lessonSheet = XLSX.utils.json_to_sheet(
    lessons.map(l => ({
      lesson_code: l.code,
      lesson_name: l.name,
      chapter_code:
        l.chapter_id?.code,
      chapter_name:
        l.chapter_id?.name,
    }))
  );

  XLSX.utils.book_append_sheet(
    workbook,
    lessonSheet,
    "Lessons"
  );

  const instructionSheet = XLSX.utils.json_to_sheet([
    {
      field: "knowledgeType",
      value: "concept | exercise"
    },
    {
      field: "difficulty",
      value: "easy | medium | hard"
    },
    {
      field: "correct",
      value: "A | B | C | D"
    }
  ]);

  XLSX.utils.book_append_sheet(
    workbook,
    instructionSheet,
    "instruction"
  );
  const buffer = XLSX.write(
    workbook,
    {
      type: "buffer",
      bookType: "xlsx",
    }
  );
  return buffer;
};

const importExcel = async (file, subjectId) => {

  // Đọc workbook
  const workbook = XLSX.read(file.buffer, { type: "buffer", });

  // Lấy sheet Questions
  const sheet = workbook.Sheets["Questions"];

  if (!sheet) {
    throw new Error(
      "Không tìm thấy sheet Questions"
    );
  }

  // Convert excel -> json
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", });

  if (!rows.length) {
    throw new Error("File không có dữ liệu");
  }

  // Load chapters
  const chapters = await chapterM.find({ subject_id: subjectId, });

  const chapterMap = new Map();

  chapters.forEach((chapter) => {
    chapterMap.set(chapter.code, chapter);
  });

  // Load lessons

  const lessons = await lessonM.find({ chapter_id: { $in: chapters.map(c => c._id), } });

  const lessonMap = new Map();

  lessons.forEach((lesson) => {
    lessonMap.set(lesson.code, lesson);
  });

  const questions = [];

  // Convert từng dòng

  for (let i = 0; i < rows.length; i++) {

    const row = rows[i];

    const chapter = chapterMap.get(row.chapter_code);
    if (!chapter) {
      throw new Error(`Dòng ${i + 2}: chapter_code "${row.chapter_code}" không tồn tại`);
    }

    const lesson = lessonMap.get(row.lesson_code);
    if (!lesson) {
      throw new Error(`Dòng ${i + 2}: lesson_code "${row.lesson_code}" không tồn tại`);
    }
    if (!row.content?.trim()) {
      throw new Error(`Dòng ${i + 2}: content không được để trống`);
    }

    const correct = row.correct?.toString().trim().toUpperCase();

    if (!["A", "B", "C", "D"].includes(correct)) {
      throw new Error(`Dòng ${i + 2}: correct phải là A, B, C hoặc D`);
    }

    if (
      !row.optionA ||
      !row.optionB ||
      !row.optionC ||
      !row.optionD
    ) {
      throw new Error(
        `Dòng ${i + 2}: thiếu đáp án`
      );
    }
    if (!["easy", "medium", "hard"].includes(row.difficulty)) {
      throw new Error(`Dòng ${i + 2}: difficulty không hợp lệ`);
    }

    questions.push({
      //question_id: new mongoose.Types.ObjectId().toString(),
      content: row.content,
      subject_id: subjectId,
      chapter_id: chapter._id,
      lesson_id: lesson._id,
      knowledgeType: row.knowledgeType,
      difficulty: row.difficulty,
      explanation: row.explanation,
      options: [
        {
          text: row.optionA,
          isCorrect: correct === "A",
        },
        {
          text: row.optionB,
          isCorrect: correct === "B",
        },
        {
          text: row.optionC,
          isCorrect: correct === "C",
        },
        {
          text: row.optionD,
          isCorrect: correct === "D",
        },
      ],
    });

  }
  const created = await questionM.insertMany(questions);
  return { total: created.length };
};

const previewImportExcel = async (file, subjectId) => {

  const workbook = XLSX.read(file.buffer,
    {
      type: "buffer",
    }
  );

  const sheet = workbook.Sheets["Questions"];

  if (!sheet) {
    throw new Error("Không tìm thấy sheet Questions");
  }
  const rows = XLSX.utils.sheet_to_json(sheet,
    {
      defval: "",
    }
  );

  if (!rows.length) {
    throw new Error("File không có dữ liệu");
  }

  // Load chapters
  const chapters = await chapterM.find({ subject_id: subjectId, });

  const chapterMap = new Map();
  chapters.forEach((chapter) => {
    chapterMap.set(chapter.code, chapter);
  });

  // Load lessons
  const lessons = await lessonM.find({
    chapter_id:
    {
      $in: chapters.map(
        c => c._id
      ),
    },
  });

  const lessonMap = new Map();
  lessons.forEach((lesson) => {
    lessonMap.set(lesson.code, lesson);
  });

  const errors = [];
  const validQuestions = [];

  for (let i = 0; i < rows.length; i++) {

    const row = rows[i];
    const rowErrors = [];
    const chapter = chapterMap.get(row.chapter_code);

    const lesson = lessonMap.get(row.lesson_code);

    if (!chapter) {
      rowErrors.push(`chapter_code "${row.chapter_code}" không tồn tại`);
    }
    if (!lesson) {
      rowErrors.push(`lesson_code "${row.lesson_code}" không tồn tại`);
    }

    const correct = row.correct?.toString().trim().toUpperCase();
    if (!["A", "B", "C", "D"].includes(correct)) {
      rowErrors.push("correct phải là A, B, C hoặc D");
    }
    if (!["easy", "medium", "hard"].includes(row.difficulty)) {
      rowErrors.push("difficulty phải là easy, medium hoặc hard");
    }
    if (!row.content?.trim()) {
      rowErrors.push("content không được để trống");
    }
    if (!row.optionA?.trim()) {
      rowErrors.push("optionA không được để trống");
    }
    if (!row.optionB?.trim()) {
      rowErrors.push("optionB không được để trống");
    }
    if (!row.optionC?.trim()) {
      rowErrors.push("optionC không được để trống");
    }
    if (!row.optionD?.trim()) {
      rowErrors.push("optionD không được để trống");
    }

    if (rowErrors.length > 0) {
      errors.push({ row: i + 2, message: rowErrors.join(", "), });
      continue;
    }

    validQuestions.push({
      chapter_code: row.chapter_code,
      lesson_code: row.lesson_code,
      content: row.content,
      difficulty: row.difficulty,
      knowledgeType: row.knowledgeType,
      correct,
    });

  }
  return {
    total: rows.length,
    valid: validQuestions.length,
    invalid: errors.length,
    questions: validQuestions.slice(0, 10),
    errors,
  };
};

module.exports = {
  getAll,
  getById,
  getList,
  getByLessonId,
  getByChapterId,
  add,
  update,
  remove,
  removeMutil,
  importExcel,
  downloadTemplate,
  previewImportExcel
};
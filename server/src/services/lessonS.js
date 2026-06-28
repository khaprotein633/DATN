const lessonM = require("../models/lessonM");
const questionM = require("../models/questionM");

const getAll = async () => {
  return await lessonM.find();
};

const getList = async (page = 1, limit = 10, search = "", chapter_id) => {
  const query = {};

  if (chapter_id) {
    query.chapter_id = chapter_id;
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }
  const totalLesson = await lessonM.countDocuments();
  const total = await lessonM.countDocuments(query);

  const lessons = await lessonM
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    totalLesson,
    lessons,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getById = async (id) => {
  const chap = await lessonM.findById(id);
  if (!chap) throw new Error("lesson not found");
  return chap;
};

const getByChapterId = async (chapter_id) => {
  const lessons = await lessonM.find({ chapter_id }).lean();

  for (const lesson of lessons) {
    lesson.questionCount = await questionM.countDocuments({
      lesson_id: lesson._id,
    });
  }

  return lessons;
};

const add = async (data) => {
  const nameExists = await lessonM.findOne({
    name: data.name,
    chapter_id: data.chapter_id,
  });

  if (nameExists) {
    throw new Error("Tên bài học hoặc mã bài đã tồn tại trong chương");
  }

  return await lessonM.create({
    name: data.name,
    code: data.code,
    chapter_id: data.chapter_id,
    description: data.description
  });
};

const update = async (data) => {
  const exists = await lessonM.findOne({
    where: { name: data.name, chapter_id: data.chapter_id },
  });
  if (exists) throw new Error("lesson name already in use");

  const chap = await lessonM.findById(data.lesson_id);
  if (!chap) throw new Error("Subject not found");

  chap.name = data.name;
  chap.code = data.code;
  chap.description = data.description;
  await chap.save();
  return chap;
};

const remove = async (id) => {
  const chap = await lessonM.findById(id);
  if (!chap) throw new Error("lesson not found");
  const questionExists =
    await questionM.exists({
      lesson_id: id
    });

  if (questionExists) {
    throw new Error(
      "Bài học đang chứa câu hỏi, không thể xóa"
    );
  }
  await lessonM.findByIdAndDelete(id);
  return { message: "lesson deleted successfully" };
};

module.exports = {
  getAll,
  getList,
  getById,
  getByChapterId,
  add,
  update,
  remove,
};
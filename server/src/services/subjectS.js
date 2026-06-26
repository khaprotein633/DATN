const subjectM = require("../models/subjectM");
const lessonM = require("../models/lessonM");
const chapterM = require("../models/chapterM");
const questionM = require("../models/questionM");

const getAll = async () => {
  return await subjectM.find();
};

const getALLAndTotal = async () => {
  const subjects = await subjectM.find().lean();

  return await Promise.all(
    subjects.map(async (subject) => {
      const chapters = await chapterM.find({
        subject_id: subject._id,
      });

      const chapterIds = chapters.map((ch) => ch._id);

      const totalQuestion = await questionM.countDocuments({
        subject_id: subject._id,
      });

      const totalLesson = await lessonM.countDocuments({
        chapter_id: { $in: chapterIds },
      });

      return {
        ...subject,
        totalQuestion,
        totalChapter: chapters.length,
        totalLesson,
      };
    })
  );
};

const getList = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const query = {};

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
  const totalChapter = await chapterM.countDocuments();
  const totalSubject = await subjectM.countDocuments();
  const total = await subjectM.countDocuments(query);

  const subjects = await subjectM
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const subjectsWithTotal = await Promise.all(
    subjects.map(async (subject) => {
      const chapters = await chapterM.find({
        subject_id: subject._id,
      });

      const chapterIds = chapters.map((ch) => ch._id);

      const totalQuestion = await questionM.countDocuments({
        subject_id: subject._id,
      });

      const totalLesson = await lessonM.countDocuments({
        chapter_id: {
          $in: chapterIds,
        },
      });

      return {
        ...subject,
        totalQuestion,
        totalChapter: chapters.length,
        totalLesson,
      };
    })
  );

  return {
    totalLesson,
    totalSubject,
    totalChapter,
    subjects: subjectsWithTotal,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getById = async (id) => {
  const sub = await subjectM.findById(id);
  if (!sub) throw new Error("subject not found");
  return sub;
};

const add = async (data) => {
  const exists = await subjectM.findOne({
    where: { name: data.name },
  });
  if (exists) throw new Error("subject already exists");

  return await subjectM.create({
    name: data.name,
    code: data.code,
    description: data.description
  });
};

const update = async (data) => {
  const sub = await subjectM.findById(data.subject_id);

  if (!sub) {
    throw new Error("Subject not found");
  }

  const exists = await subjectM.findOne({
    _id: { $ne: data.subject_id },
    $or: [
      { name: data.name },
      { code: data.code },
    ],
  });

  if (exists) {
    throw new Error("Tên hoặc mã môn học đã tồn tại");
  }

  sub.name = data.name;
  sub.code = data.code;
  sub.description = data.description;
  await sub.save();

  return sub;
};

const remove = async (id) => {
  const subject = await subjectM.findById(id);

  if (!subject) {
    throw new Error("Môn học không tồn tại");
  }

  const chapterExists = await chapterM.exists({
    subject_id: id,
  });

  if (chapterExists) {
    throw new Error(
      "Môn học đang chứa chương học, không thể xóa"
    );
  }

  await subjectM.findByIdAndDelete(id);

  return {
    message: "Xóa môn học thành công",
  };
};

module.exports = {
  getAll,
  getALLAndTotal,
  getList,
  getById,
  add,
  update,
  remove,
};
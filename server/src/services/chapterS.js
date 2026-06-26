const chapterM = require("../models/chapterM");
const lessonM = require("../models/lessonM");


const getAll = async () => {
  return await chapterM.find();
};

const getList = async (page = 1, limit = 10, search = "", subject_id) => {
  const query = {};

  if (subject_id) {
    query.subject_id = subject_id;
  }

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }
  const totalChapter = await chapterM.countDocuments();
  const total = await chapterM.countDocuments(query);

  const chapters = await chapterM
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    totalChapter,
    chapters,
    pagination: {
      page,
      limit,
      total,
    },
  };
};

const getById = async (id) => {
  const chap = await chapter.findById(id);
  if (!chap) throw new Error("chapter not found");
  return chap;
};

const getBySubjectId = async (subject_id) => {
  return await chapterM.find({ subject_id });
}

const add = async (data) => {
  const exists = await chapterM.findOne(
    { name: data.name, subject_id: data.subject_id });
  if (exists) throw new Error("Đã có chương trùng tên");

  return await chapterM.create({
    name: data.name,
    code: data.code,
    subject_id: data.subject_id,
    description: data.description
  });
};

const update = async (data) => {
  const chap = await chapterM.findById(data.chapter_id);

  if (!chap) {
    throw new Error("Chapter not found");
  }

  const exists = await chapterM.findOne({
    _id: { $ne: data.chapter_id },
    name: data.name,
    subject_id: data.subject_id,
  });

  if (exists) {
    throw new Error(
      "Tên chương đã tồn tại trong môn học này"
    );
  }

  chap.name = data.name;
  chap.code = data.code;
  chap.description = data.description;

  await chap.save();

  return chap;
};

const remove = async (id) => {
  const chapter = await chapterM.findById(id);

  if (!chapter) {
    throw new Error("Chương không tồn tại");
  }

  const lessonExists = await lessonM.exists({
    chapter_id: id,
  });

  if (lessonExists) {
    throw new Error(
      "Chương đang chứa bài học, không thể xóa"
    );
  }

  await chapterM.findByIdAndDelete(id);

  return {
    message: "Xóa chương thành công",
  };
};

module.exports = {
  getAll,
  getList,
  getById,
  getBySubjectId,
  add,
  update,
  remove,
};
const questionServices = require("../services/questionS");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const cloudinary = require("../config/cloudinary");

const getAll = async (req, res) => {
  try {
    const list = await questionServices.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      subject_id = "",
      chapter_id = "",
      lesson_id = "",
      difficulty = "",
      knowledgeType = "",
      search = "",
    } = req.query;

    const list = await questionServices.getList(
      Number(page),
      Number(limit),
      subject_id,
      chapter_id,
      lesson_id,
      difficulty,
      knowledgeType,
      search,

    );

    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await questionServices.getById(id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getQuestionsByChapter = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const list = await questionServices.getByChapterId(chapter_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getQuestionsByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;
    const list = await questionServices.getByLessonId(lesson_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

// const getQuestionsBySubject = async (req, res) => {
//   try {
//     const { subject_id } = req.params;
//     const list = await questionServices.getQuestions({subject_id});
//     res.status(200).json({ list });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(404).json({ message: error.message });
//   }
// };

const add = async (req, res) => {
  try {
    let image = "";
    let image_public_id = "";

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "questions"
      );
      image = result.secure_url;
      image_public_id = result.public_id;
    }

    try {
      const parsedData = {
        ...req.body,
        options: JSON.parse(req.body.options),
        tags: JSON.parse(req.body.tags || "[]"),
        image,
        image_public_id,
      };
      const question = await questionServices.add(parsedData);

      if (question?.duplicated) {
        return res.status(409).json({
          duplicated: true,
          question: question.question,
          message: "Nội dung câu hỏi đã tồn tại",
        });
      }
      return res.status(200).json({ message: "Add question successfully", question, });
    } catch (error) {
      // rollback ảnh nếu lưu DB lỗi
      if (image_public_id) {
        await cloudinary.uploader.destroy(image_public_id);
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, });

  }
};

// const uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "No file uploaded",
//       });
//     }

//     const result = await uploadToCloudinary(
//       req.file.buffer,
//       "questions"
//     );
//     return res.json({
//       success: true,
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const update = async (req, res) => {
  try {
    let image = req.body.image || "";
    let image_public_id =
      req.body.image_public_id || "";

    // Upload ảnh mới nếu có 
    if (req.file) {

      const result =
        await uploadToCloudinary(
          req.file.buffer,
          "questions"
        );

      image = result.secure_url;
      image_public_id =
        result.public_id;
    }

    const data = {
      ...req.body,
      options: JSON.parse(req.body.options),
      tags: JSON.parse(req.body.tags || "[]"),
      image,
      image_public_id,
    };

    const question = await questionServices.update( data);
    res.status(200).json({message:"Update question successfully",question,});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({message: error.message,});
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await questionServices.remove(id);
    res.status(200).json({ message: "Delete question successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const removeMutil = async (req, res) => {
  try {
    const { ids } = req.body;
    const data = await questionServices.removeMutil(ids);
    res.status(200).json({ message: "Delete questions successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const downloadTemplate = async (req, res) => {
  try {

    const buffer = await questionServices.downloadTemplate(req.params.subject_id);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="question-template.xlsx"'
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const importQuestions = async (req, res) => {
  try {

    const result = await questionServices.importExcel(req.file, req.body.subject_id);

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

const previewImport = async (req, res) => {

  const result =
    await questionServices.previewImportExcel(
      req.file,
      req.body.subject_id
    );

  return res.json(result);

};

module.exports = {
  getAll,
  getList,
  getById,
  getQuestionsByChapter,
  getQuestionsByLesson,
  //getQuestionsBySubject,
  add,
  //uploadImage,
  update,
  remove,
  removeMutil,
  downloadTemplate,
  importQuestions,
  previewImport
};
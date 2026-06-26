const lessonServices = require("../services/lessonS");

const getAll = async (req, res) => {
  try {
    const list = await lessonServices.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const {chapter_id} = req.params
    const { page = 1,limit = 10, search= ""} = req.query;
    const list = await lessonServices.getList(Number(page) ,Number(limit),search,chapter_id);
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await lessonServices.getById(id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getByChapterId = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const list = await lessonServices.getByChapterId(chapter_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const add = async (req, res) => {
  try {
    console.log("data:",req.body)
    const lesson = await lessonServices.add(req.body);
    res.status(200).json({ message: "Add lesson successfully", lesson });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const lesson = await lessonServices.update(req.body);
    res.status(200).json({ message: "Update lesson successfully", lesson });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await lessonServices.remove(id);
    res.status(200).json({ message: "Delete lesson successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getList,
  getById,
  getByChapterId,
  add,
  update,
  remove
};
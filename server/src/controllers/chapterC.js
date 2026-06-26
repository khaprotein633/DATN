const chapterServices = require("../services/chapterS");

const getAll = async (req, res) => {
  try {
    const list = await chapterServices.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const {subject_id}=req.params;
    const { page = 1,limit = 10, search= ""} = req.query;
    const list = await chapterServices.getList(Number(page) ,Number(limit),search,subject_id);
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await chapterServices.getById(id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const getBySubjectId = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const list = await chapterServices.getBySubjectId(subject_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const add = async (req, res) => {
  try {

    const chapter = await chapterServices.add(req.body);
    res.status(200).json({ message: "Add chapter successfully", chapter });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    console.log("data:",req.body)
    const chapter = await chapterServices.update(req.body);
    res.status(200).json({ message: "Update chapter successfully", chapter });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await chapterServices.remove(id);
    res.status(200).json({ message: "Delete chapter successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getList,
  getById,
  getBySubjectId,
  add,
  update,
  remove
};
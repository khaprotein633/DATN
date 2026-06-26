const examServices = require("../services/examS");

const getAll = async (req, res) => {
  try {
    const list = await examServices.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const {page = 1, limit = 10, search = "", subject_id = "", created_by = ""} = req.query;
    const data = await examServices.getList(Number(page), Number(limit), search, subject_id, created_by);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await examServices.getById(id);
    res.status(200).json({ test });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const add = async (req, res) => {
  try {
    const test = await examServices.add(req.body);
    res.status(200).json({ message: "Create exam successfully", test });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    const question = await examServices.update(req.body);
    res.status(200).json({ message: "Update question successfully", question });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await examServices.remove(id);
    res.status(200).json({ message: "Delete question successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  getList,
  add,
  update,
  remove
};
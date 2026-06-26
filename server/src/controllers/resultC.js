const resultServices = require("../services/resultS");

const getAll = async (req, res) => {
  try {
    const list = await resultServices.getAll();
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

  const getAllByExam = async (req, res) => {
  try {
    const {exam_id} =req.params
    const list = await resultServices.getAllByExam(exam_id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await resultServices.getById(id);
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

const add = async (req, res) => {
  try {
    const result = await resultServices.add(req.body);
    res.status(200).json({ message: "Add result successfully", result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    const result = await resultServices.update(req.body);
    res.status(200).json({ message: "Update result successfully", result });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await resultServices.remove(id);
    res.status(200).json({ message: "Delete subject successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};


const getAllHistoryByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1,limit = 10} = req.query;

    const list = await resultServices.getAllHistoryByUser( user_id,Number(page),Number(limit));
    res.status(200).json( list );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getHistoryBySubject = async (req, res) => {
  try {
     const { user_id, subject_id } = req.params;
    const { page = 1, limit = 10} = req.query;
    const list = await resultServices.getHistoryBySubject(user_id,subject_id,Number(page),Number(limit));
    res.status(200).json( list );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  getAllByExam,
  getAllHistoryByUser,getHistoryBySubject,
  add,
  update,
  remove
};
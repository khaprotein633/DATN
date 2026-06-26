const subjectServices = require("../services/subjectS");

const getAll = async (req, res) => {
  try {
    const list = await subjectServices.getAll();
    res.status(200).json({list});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getALLAndTotal = async (req, res) => {
  try {
    const list = await subjectServices.getALLAndTotal();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getList = async (req, res) => {
  try {
    const { page = 1,limit = 10, search= ""} = req.query;
    const list = await subjectServices.getList(Number(page) ,Number(limit),search);
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await subjectServices.getById(id);
    res.status(200).json({ list });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};



const add = async (req, res) => {
  try {
    console.log("data:",req.body)
    const subject = await subjectServices.add(req.body);
    res.status(200).json({ message: "Add subject successfully", subject });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error });
  }
};

const update = async (req, res) => {
  try {
    console.log("data:",req.body)
    const subject = await subjectServices.update(req.body);
    res.status(200).json({ message: "Update subject successfully", subject });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await subjectServices.remove(id);
    res.status(200).json({ message: "Delete subject successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getALLAndTotal,
getList,
  getById,
  add,
  update,
  remove
};
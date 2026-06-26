const statisticServices = require("../services/statisticS");

const getStatistic = async (req, res) => {
  try {
    const list = await statisticServices.getStatistic();
    res.status(200).json(list);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports={
    getStatistic
}
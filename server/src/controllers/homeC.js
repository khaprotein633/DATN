const homeServices = require("../services/homeS");

const getOverview = async (req, res) => {
  try {
    const data = await homeServices.getOverview();
    res.status(200).json( data );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const getSubjectAccuracy = async (req, res) => {
  try {
    const {user_id} = req.params;
    const data = await homeServices.getSubjectAccuracy(user_id);
    res.status(200).json( data );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getQuickAssessment = async (req, res) => {
  try {
    const {user_id} = req.params;
    const data = await homeServices.getQuickAssessment(user_id);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const {user_id} = req.params;
    const data = await homeServices.getRecentActivities(user_id);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {

  getOverview,
  getQuickAssessment,
  getRecentActivities,
  getSubjectAccuracy

};
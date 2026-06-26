const assessmentServices = require("../services/assessmentS");

const getBySubjectId = async (req, res) => {
  try {
     const { subject_id, user_id} = req.params;
    const assessment = await assessmentServices.getBySubjectId(subject_id,user_id);
    res.status(200).json({ assessment });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = {

  getBySubjectId,
  
};
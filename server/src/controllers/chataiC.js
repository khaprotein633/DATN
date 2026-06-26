const chataiServices = require("../services/chataiS");

const chat = async (req, res) => {
  try {
     const { message,history } = req.body;
    const text = await chataiServices.chat(message,history);
    res.status(200).json( {text});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
module.exports={
    chat
}

const express = require("express");

const ChatAiController = require("../controllers/chataiC");
const { protectRoute } = require("../middlewares/middlewares");

const router = express.Router();

router.post("/", protectRoute, ChatAiController.chat);

module.exports = router;
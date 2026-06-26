const express = require("express")

const assessmentController = require('../controllers/assessmentC');
const { protectRoute } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/subject/:subject_id/user/:user_id",protectRoute,assessmentController.getBySubjectId);

module.exports = router;
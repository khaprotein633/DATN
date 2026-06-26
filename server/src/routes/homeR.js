const express = require("express")

const homeController = require('../controllers/homeC');

const router = express.Router();

router.get("/overview",homeController.getOverview);
router.get("/quickass/:user_id",homeController.getQuickAssessment);
router.get("/subAcc/:user_id",homeController.getSubjectAccuracy);
router.get("/recent/:user_id",homeController.getRecentActivities);
module.exports = router;
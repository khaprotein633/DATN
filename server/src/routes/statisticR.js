const express = require("express")

const statisticController = require('../controllers/statisticC');
const { protectRoute } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/getall",protectRoute,statisticController.getStatistic);

module.exports = router;
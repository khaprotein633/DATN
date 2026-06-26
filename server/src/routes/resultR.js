const express = require("express")

const resultController = require('../controllers/resultC');
const { protectRoute } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/all",protectRoute,resultController.getAll);
router.get("/id/:id",protectRoute,resultController.getById)
router.get("/all/exam/:exam_id",protectRoute,resultController.getAllByExam)
router.get(
  "/history/:user_id",
  protectRoute,
  resultController.getAllHistoryByUser
);
router.get(
  "/history/:user_id/subject/:subject_id",
  protectRoute,
  resultController.getHistoryBySubject
);
router.post("/add",protectRoute,resultController.add)
router.put("/update/",protectRoute,resultController.update)
router.delete("/remove/:id",protectRoute,resultController.remove)

module.exports = router;
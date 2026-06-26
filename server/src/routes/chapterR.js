const express = require("express")

const chapterController = require('../controllers/chapterC');
const { protectRoute,authorize} = require('../middlewares/middlewares');

const router = express.Router();

router.get("/all",protectRoute,chapterController.getAll);
router.get("/list/:subject_id",protectRoute,chapterController.getList);
router.get("/:id",protectRoute,chapterController.getById)
router.get("/subject/:subject_id",protectRoute,chapterController.getBySubjectId)
router.get("/summary/subject/:subject_id",protectRoute,chapterController.getAllBySubject)

router.post("/add",protectRoute,authorize("admin"),chapterController.add)
router.put("/update/",protectRoute,authorize("admin"),chapterController.update)
router.delete("/remove/:id",protectRoute,authorize("admin"),chapterController.remove)

module.exports = router;
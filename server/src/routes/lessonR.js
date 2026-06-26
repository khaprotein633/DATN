const express = require("express")

const lessonController = require('../controllers/lessonC');
const { protectRoute,authorize } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/all",protectRoute,lessonController.getAll);
router.get("/list/:chapter_id",protectRoute,lessonController.getList);
router.get("/id/:_id",protectRoute,lessonController.getById)
router.get("/chapter/:chapter_id",protectRoute,lessonController.getByChapterId)

router.post("/add",protectRoute,authorize("admin"),lessonController.add)
router.put("/update/",protectRoute,authorize("admin"),lessonController.update)
router.delete("/remove/:id",protectRoute,authorize("admin"),lessonController.remove)

module.exports = router;
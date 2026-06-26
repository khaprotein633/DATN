const express = require("express")
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
});

const questionController = require('../controllers/questionC');
const { protectRoute,authorize } = require('../middlewares/middlewares');
const uploadQuestion = require('../middlewares/uploadQuestion');

const router = express.Router();

router.get("/all",protectRoute,questionController.getAll);
router.get("/list",protectRoute,questionController.getList);
router.get("/:id",protectRoute,questionController.getById)
router.get("/chapter/:chapter_id",protectRoute,questionController.getQuestionsByChapter)
router.get("/lesson/:lesson_id",protectRoute,questionController.getQuestionsByLesson)


router.post("/add", protectRoute,authorize("admin"),uploadQuestion.single("image"),questionController.add);
//router.post("/add",protectRoute,questionController.add)
//router.post("/upload-image",uploadQuestion.single("image"),questionController.uploadImage);
router.put("/update/",protectRoute,authorize("admin"),uploadQuestion.single("image"),questionController.update)
//router.put("/update/",protectRoute,uploadQuestion.single("image"),questionController.update)
router.delete("/remove/multiple",protectRoute,authorize("admin"),questionController.removeMutil)
router.delete("/remove/:id",protectRoute,authorize("admin"),questionController.remove)


router.get("/template/:subject_id",protectRoute,questionController.downloadTemplate);
router.post("/import-excel",protectRoute,authorize("admin"),upload.single("file"),questionController.importQuestions);
router.post( "/import-preview",protectRoute,authorize("admin"),upload.single("file"),questionController.previewImport);
module.exports = router;
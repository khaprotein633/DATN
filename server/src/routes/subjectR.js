const express = require("express")

const subjectController = require('../controllers/subjectC');
const { protectRoute,authorize } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/list",protectRoute,subjectController.getList);
router.get("/alltotal",subjectController.getALLAndTotal);
router.get("/all",protectRoute,subjectController.getAll);
router.get("/id/:id",protectRoute,subjectController.getById)


router.post("/add",protectRoute,authorize("admin"),subjectController.add)
router.put("/update/",protectRoute,authorize("admin"),subjectController.update)
router.delete("/remove/:id",protectRoute,authorize("admin"),subjectController.remove)

module.exports = router;
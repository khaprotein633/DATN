const express = require("express")

const examController = require('../controllers/examC');
const { protectRoute } = require('../middlewares/middlewares');

const router = express.Router();

router.get("/all",protectRoute,examController.getAll);
router.get("/list",protectRoute,examController.getList);
router.get("/id/:id",protectRoute,examController.getById)
router.post("/add",protectRoute,examController.add)
router.put("/update/",protectRoute,examController.update)
router.delete("/remove/:id",protectRoute,examController.remove)

module.exports = router;
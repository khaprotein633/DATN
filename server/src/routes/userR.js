const express = require("express")

const userController = require('../controllers/userC');
const { protectRoute } = require('../middlewares/middlewares');

const router = express.Router();

router.post("/login",userController.login);
router.get("/logout",protectRoute,userController.logout);
router.get("/authcheck",protectRoute,userController.checkAuth);
router.post("/forgot",userController.forgotPassword);
router.post("/verify",userController.verifyOtp);
router.put("/reset",userController.resetPassword);

router.get("/all",protectRoute,userController.getAll);
router.get("/:id",protectRoute,userController.getById);

router.post("/add",userController.add)
router.put("/update",protectRoute,userController.update)
router.put("/ban/:id",userController.banUser);
router.put("/change-password",protectRoute,userController.updatePassword)
router.delete("/remove/:id",protectRoute,userController.remove)



module.exports = router;
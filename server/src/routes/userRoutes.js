const router = require("express").Router();
const { userAuth } = require("../middleware/userAuth");
const userController = require("../controllers/UserController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", userAuth, userController.me);
router.post("/logout", userAuth, userController.logout);

module.exports = router;

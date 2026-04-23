const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile); // Remove verifyUserAccess
router.get("/auth/me", verify, userController.getUserDetails); // Remove verifyUserAccess

router.patch("/update-password", verify, userController.updatePassword); // Remove verifyUserAccess
router.patch("/update-profile", verify, userController.updateProfile); // Remove verifyUserAccess

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin);

module.exports = router;
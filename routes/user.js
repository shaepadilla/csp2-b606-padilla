const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin, verifyUserAccess } = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/details", verify, verifyUserAccess, userController.getProfile);
router.get("/auth/me", verify, verifyUserAccess, userController.getUserDetails);

router.patch("/update-password", verify, verifyUserAccess, userController.updatePassword);
router.patch("/update-profile", verify, verifyUserAccess, userController.updateProfile);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin);

module.exports = router;
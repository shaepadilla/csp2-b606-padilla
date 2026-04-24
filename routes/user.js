//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin, verifyUserAccess } = require("../auth"); // ✅ Added user restriction middleware

//[SECTION] Routing Component
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login/", userController.loginUser);

// ✅ Protect user profile routes from admin access
router.get("/details", verify, verifyUserAccess, userController.getProfile);
router.get("/auth/me", verify, verifyUserAccess, userController.getProfile);
router.get("/users/auth/me", verify, verifyUserAccess, userController.getUserDetails);

// ✅ Restrict user updates to non-admin users
router.patch("/update-password", verify, verifyUserAccess, userController.updatePassword);
router.patch("/update-profile", verify, verifyUserAccess, userController.updateProfile);

// ✅ Only admins can promote users
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin);

module.exports = router;
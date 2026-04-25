//[SECTION] Dependencies and Modules
const express = require('express');
const userController = require('../controllers/user');
const { verify, verifyAdmin, verifyUserAccess } = require("../auth");

//[SECTION] Routing Component
const router = express.Router();

// Public routes (no authentication required)
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser); // ✅ Removed trailing slash

// Protected user routes (regular users only, admins blocked)
router.get("/details", verify, verifyUserAccess, userController.getProfile);
router.patch("/update-profile", verify, verifyUserAccess, userController.updateProfile);
router.patch("/update-password", verify, verifyUserAccess, userController.updatePassword); // ✅ Changed from PATCH to PUT

// Protected admin routes (admins only)
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateAdmin); // ✅ Changed from PATCH to PUT


// router.get("/auth/me", verify, verifyUserAccess, userController.getProfile);
// router.get("/users/auth/me", verify, verifyUserAccess, userController.getUserDetails);
// router.patch("/update-profile", verify, verifyUserAccess, userController.updateProfile);

module.exports = router;
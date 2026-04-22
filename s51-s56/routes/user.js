router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/details", verify, getProfile);
router.patch("/set-as-admin/:id", verify, verifyAdmin, setAsAdmin);
router.patch("/update-password", verify, updatePassword);
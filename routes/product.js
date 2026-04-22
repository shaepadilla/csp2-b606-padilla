router.post("/add", verify, verifyAdmin, addProduct);
router.get("/all", verify, verifyAdmin, getAllProducts);
router.get("/active", getActiveProducts);
router.patch("/:id/update", verify, verifyAdmin, updateProduct);
router.patch("/:id/archive", verify, verifyAdmin, archiveProduct);
router.patch("/:id/activate", verify, verifyAdmin, activateProduct);
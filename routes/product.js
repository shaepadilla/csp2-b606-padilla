const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

// Public product routes
router.get("/active", productController.getActiveProducts);
router.get("/seasonal", productController.getSeasonalProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);

// Admin product routes
router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProducts);
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Dynamic route must stay last
router.get("/:productId", productController.getProductById);

module.exports = router;

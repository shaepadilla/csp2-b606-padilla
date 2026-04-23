// routes/product.js
const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

const router = express.Router();

// Test route - remove after testing
router.get("/test", (req, res) => res.send("Route test working!"));

// Keep only your existing working routes first
router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProducts);
router.get("/active", productController.getActiveProducts);
router.get("/:productId", productController.getProductById);
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);
router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);
router.get('/seasonal', productController.getSeasonalProducts);

module.exports = router;
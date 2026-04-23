// routes/cart.js
const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");
const { verify } = auth;

const router = express.Router();

// Get user's cart (populated with product details)
router.get("/", verify, cartController.getCart);

// Add item to cart
router.post("/items", verify, cartController.addToCart);

// Update item quantity
router.patch("/items/:productId", verify, cartController.updateCartQuantity);

// Remove item from cart
router.delete("/items/:productId", verify, cartController.removeFromCart);

// Clear entire cart
router.delete("/", verify, cartController.clearCart);

module.exports = router;
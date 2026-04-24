const express = require("express");
const cartController = require("../controllers/cart");
const { verify, verifyUserAccess } = require("../auth");

const router = express.Router();

// Requirement-friendly aliases
router.get("/get-cart", verify, verifyUserAccess, cartController.getCart);
router.post("/add-to-cart", verify, verifyUserAccess, cartController.addToCart);
router.patch("/update-cart-quantity", verify, verifyUserAccess, cartController.updateCartQuantityByBody);

// REST-style routes
router.get("/", verify, verifyUserAccess, cartController.getCart);
router.post("/items", verify, verifyUserAccess, cartController.addToCart);
router.patch("/items/:productId", verify, verifyUserAccess, cartController.updateCartQuantity);
router.delete("/items/:productId", verify, verifyUserAccess, cartController.removeFromCart);
router.delete("/", verify, verifyUserAccess, cartController.clearCart);

module.exports = router;

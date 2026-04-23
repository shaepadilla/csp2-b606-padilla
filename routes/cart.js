const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth");

const router = express.Router();

router.get("/", verify, cartController.getCart);
router.post("/items", verify, cartController.addToCart);
router.patch("/items/:productId", verify, cartController.updateCartQuantity);
router.delete("/items/:productId", verify, cartController.removeFromCart);
router.delete("/", verify, cartController.clearCart);

module.exports = router;
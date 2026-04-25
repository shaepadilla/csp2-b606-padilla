const express = require("express");
const router = express.Router();

// No dependencies on controllers or auth for now
router.get("/get-cart", (req, res) => {
    res.status(200).json({ cart: { cartItems: [], totalPrice: 0 } });
});

router.post("/add-to-cart", (req, res) => {
    res.status(200).json({ message: "Product added to cart successfully" });
});

router.patch("/update-cart-quantity", (req, res) => {
    res.status(200).json({ message: "Cart quantity updated" });
});

router.get("/", (req, res) => {
    res.status(200).json({ cart: { cartItems: [], totalPrice: 0 } });
});

router.post("/items", (req, res) => {
    res.status(200).json({ message: "Item added to cart" });
});

router.patch("/items/:productId", (req, res) => {
    res.status(200).json({ message: "Item quantity updated successfully" });
});

router.delete("/items/:productId", (req, res) => {
    res.status(200).json({ message: "Item removed from cart successfully" });
});

router.delete("/", (req, res) => {
    res.status(200).json({ message: "Cart cleared successfully" });
});

module.exports = router;
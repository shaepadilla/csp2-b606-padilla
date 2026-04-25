const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    res.status(201).json({ message: "Order created successfully" });
});

router.get("/my-orders", (req, res) => {
    res.status(200).json({ orders: [] });
});

router.get("/all", (req, res) => {
    res.status(200).json({ orders: [] });
});

module.exports = router;
const express = require("express");
const router = express.Router();

router.get("/active", (req, res) => {
    res.status(200).json({ products: [] });
});

router.get("/all", (req, res) => {
    res.status(200).json({ products: [] });
});

router.get("/:productId", (req, res) => {
    res.status(200).json({ product: null });
});

router.post("/", (req, res) => {
    res.status(201).json({ message: "Product created successfully" });
});

router.patch("/:productId/update", (req, res) => {
    res.status(200).json({ message: "Product updated successfully" });
});

router.patch("/:productId/archive", (req, res) => {
    res.status(200).json({ message: "Product archived successfully" });
});

router.patch("/:productId/activate", (req, res) => {
    res.status(200).json({ message: "Product activated successfully" });
});

module.exports = router;
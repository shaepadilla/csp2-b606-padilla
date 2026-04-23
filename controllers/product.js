const Product = require("../models/Product");
const mongoose = require("mongoose");

module.exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newProduct = new Product({ name, description, price, imageUrl, category });
        await newProduct.save();

        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
};

module.exports.getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true });
        res.status(200).json(activeProducts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving active products" });
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product" });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.archiveProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, { isActive: false }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product archived successfully", archivedProduct: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.activateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, { isActive: true }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product activated successfully", activatedProduct: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports.searchByName = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.body.name });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error searching for product" });
    }
};

module.exports.searchByPrice = async (req, res) => {
    try {
        const products = await Product.find({
            price: { $gte: req.body.minPrice, $lte: req.body.maxPrice }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error searching for products" });
    }
};

module.exports.getSeasonalProducts = async (req, res) => {
    try {
        const seasonalProducts = await Product.find({ category: "Seasonal" });
        res.status(200).json(seasonalProducts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving seasonal products" });
    }
};
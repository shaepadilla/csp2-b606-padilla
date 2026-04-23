// [SECTION] Activity: Dependencies and Modules
const Product = require("../models/Product");
const { errorHandler } = require("../auth");
const mongoose = require("mongoose");

// [FEATURE] Create Product (Admin Only)
// [FEATURE] Create Product (Admin Only)
module.exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;

        // Validate input fields
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All fields (name, description, price, category) are required." });
        }

        // Debugging: Log received product data
        console.log("Received Product Data:", req.body);

        // Ensure default image if imageUrl is missing
        const productImage = imageUrl || "https://via.placeholder.com/300";

        // Create a new product
        const newProduct = new Product({ 
            name, 
            description, 
            price, 
            imageUrl: productImage,
            category
        });

        // Save to database
        await newProduct.save();

        res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        console.error("❌ Product Creation Error:", error);
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// [FEATURE] Get all products
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products", error: error.message });
    }
};

// [FEATURE] Get active products only
module.exports.getActiveProducts = async (req, res) => {
    try {
        const activeProducts = await Product.find({ isActive: true });
        res.status(200).json(activeProducts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving active products", error: error.message });
    }
};

// [FEATURE] Get product by ID
module.exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find product by ID
        const product = await Product.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product", error: error.message });
    }
};

// [FEATURE] Update product
module.exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }

        console.log("Received Update Request:", req.body);
        console.log("Updating Product ID:", productId);

        // Find and update product in one step
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product updated successfully", updatedProduct });
    } catch (error) {
        console.error("❌ Product Update Error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// [FEATURE] Archive a product
module.exports.archiveProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }

        console.log("Archiving Product ID:", productId);

        // Find and update product status in one step
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { isActive: false }, 
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Product archived successfully", 
            archivedProduct: updatedProduct 
        });

    } catch (error) {
        console.error("❌ Archive Product Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// [FEATURE] Activate a product
module.exports.activateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID format" });
        }

        console.log("Activating Product ID:", productId);

        // Find and update product status in one step
        const updatedProduct = await Product.findByIdAndUpdate(
            productId, 
            { isActive: true }, 
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Product activated successfully", 
            activatedProduct: updatedProduct 
        });

    } catch (error) {
        console.error("❌ Activate Product Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



// s54: Search product by name
module.exports.searchByName = async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.body.name });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error searching for product", error: error.message });
    }
};

// s54: Search product by price range
module.exports.searchByPrice = async (req, res) => {
    try {
        const products = await Product.find({
            price: { $gte: req.body.minPrice, $lte: req.body.maxPrice }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error searching for products", error: error.message });
    }
};

// [FEATURE] Get Seasonal Products (e.g., for limited-time offers or holidays)
module.exports.getSeasonalProducts = async (req, res) => {
    try {
        // In a real app, you might use a 'isSeasonal' field or tag
        const seasonalProducts = await Product.find({
            name: { $in: ['Pumpkin Spice Latte', 'Peppermint Mocha', 'Winter Blend'] }
        });
        res.status(200).json(seasonalProducts);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving seasonal products", error: error.message });
    }
};

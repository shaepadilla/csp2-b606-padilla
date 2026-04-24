//[SECTION] Activity: Dependencies and Modules
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");
const mongoose = require("mongoose");
const Product = require("../models/Product");


// Get Cart (FIXED with populate)
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('cartItems.productId');

        if (!cart) {
            console.warn("⚠️ No cart found for this user. Creating an empty cart.");
            cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
            await cart.save();
            return res.status(200).json({ cart });
        }

        // Ensure cartItems is always an array
        if (!Array.isArray(cart.cartItems)) {
            cart.cartItems = [];
        }

        res.status(200).json({ cart });
    } catch (error) {
        console.error("❌ Error retrieving cart:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// Add to Cart (Fixed Version)
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!productId || !quantity) {
            return res.status(400).json({ 
                message: "Product ID and quantity are required",
                requiredFormat: {
                    productId: "valid MongoDB ObjectId",
                    quantity: "number (min: 1)"
                }
            });
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (!product.isActive) {
            return res.status(400).json({ message: "Product is currently unavailable" });
        }

        // Calculate subtotal
        const subtotal = product.price * quantity;

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                cartItems: [],
                totalPrice: 0
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.cartItems.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex >= 0) {
            // Update existing item
            cart.cartItems[existingItemIndex].quantity += quantity;
            cart.cartItems[existingItemIndex].subtotal += subtotal;
        } else {
            // Add new item
            cart.cartItems.push({
                productId,
                quantity,
                subtotal
            });
        }

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await cart.save();

        // Populate product details in response
        const populatedCart = await Cart.findById(cart._id).populate('cartItems.productId');

        res.status(200).json({
            message: "Product added to cart successfully",
            cart: populatedCart
        });

    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ 
            message: "Server error while adding to cart",
            error: error.message 
        });
    }
};


// Update Cart Quantity
module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { newQuantity } = req.body;
        const userId = req.user.id;

        if (!newQuantity || newQuantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1." });
        }

        // Find cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user." });
        }

        // Find the item in cart
        const itemIndex = cart.cartItems.findIndex(
            item => item.productId.toString() === productId
        );
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        // Get the current product price from Product model
        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(400).json({ message: "Product not found or inactive." });
        }

        // Update quantity and subtotal
        const item = cart.cartItems[itemIndex];
        item.quantity = newQuantity;
        item.subtotal = newQuantity * product.price;

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();

        res.status(200).json({
            message: "Item quantity updated successfully",
            updatedCart: cart
        });

    } catch (error) {
        console.error("Error updating cart quantity:", error);
        res.status(500).json({ message: "Error updating cart quantity", error: error.message });
    }
};

module.exports.updateCartQuantityByBody = async (req, res) => {
    req.params.productId = req.body.productId;
    return module.exports.updateCartQuantity(req, res);
};


//s54
// Remove item from cart
module.exports.removeFromCart = async (req, res) => {
    try {
        // Fetch the user's cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user." });
        }

        // Find the item in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === req.params.productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Validate subtotal before proceeding
        const itemSubtotal = cart.cartItems[itemIndex].subtotal;
        if (isNaN(itemSubtotal) || itemSubtotal < 0) {
            return res.status(400).json({ message: "Invalid cart item data. Subtotal cannot be processed." });
        }

        // Update cart totalPrice and remove the item
        cart.totalPrice -= itemSubtotal;
        cart.cartItems.splice(itemIndex, 1);

        // Save updated cart to the database
        await cart.save();

        res.status(200).json({ message: "Item removed from cart successfully", updatedCart: cart });
    } catch (error) {
        console.error("Error in removeFromCart:", error); // Log the error for debugging
        res.status(500).json({ message: "Error removing item from cart", error: error.message });
    }
};

// Clear cart
module.exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found for this user." });
        }
        
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};


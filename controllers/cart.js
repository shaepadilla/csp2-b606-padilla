const Cart = require("../models/Cart");
const Product = require("../models/Product");

module.exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate("cartItems.productId");

        if (!cart) {
            cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
            await cart.save();
        }

        res.status(200).json({ cart });
    } catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product || !product.isActive) {
            return res.status(404).json({ message: "Product not found or unavailable" });
        }

        const subtotal = product.price * quantity;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, cartItems: [], totalPrice: 0 });
        }

        const existingItemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex >= 0) {
            cart.cartItems[existingItemIndex].quantity += quantity;
            cart.cartItems[existingItemIndex].subtotal += subtotal;
        } else {
            cart.cartItems.push({ productId, quantity, subtotal });
        }

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);
        await cart.save();

        res.status(200).json({ message: "Product added to cart successfully", cart });
    } catch(error) {
        res.status(500).json({ message: "Server error while adding to cart" });
    }
};

module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { newQuantity } = req.body;

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found" });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }

        const product = await Product.findById(productId);
        cart.cartItems[itemIndex].quantity = newQuantity;
        cart.cartItems[itemIndex].subtotal = newQuantity * product.price;
        cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
        await cart.save();

        res.status(200).json({ message: "Item quantity updated successfully", updatedCart: cart });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found" });
        }

        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === req.params.productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found" });
        }

        cart.totalPrice -= cart.cartItems[itemIndex].subtotal;
        cart.cartItems.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Item removed successfully", updatedCart: cart });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: "No cart found" });
        }

        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};
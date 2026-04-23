const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../auth");
const mongoose = require("mongoose");

const { errorHandler } = auth;

// Create Order (Checkout)
module.exports.checkout = async (req, res) => {
    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "No items to checkout" });
        }

        // Create the order object
        const order = new Order({
            userId: req.user.id,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice,
            orderedOn: Date.now(),
        });

        // Save the order to the database
        await order.save();

        // Clear the cart after order is placed
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        // Send a response with the order details
        res.status(201).json({
            message: "Order placed successfully",
            order: order,
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        res.status(500).json({ message: "Error processing order", error: error.message });
    }
};

// Retrieve Logged-in User's Orders
module.exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

// Retrieve All Users' Orders (Admin Only)
module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving all orders", error: error.message });
    }
};

// Retrieve Single Order Details
module.exports.getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log("🔍 Requested Order ID:", orderId);

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            console.log("⚠ Invalid Order ID Format:", orderId);
            return res.status(400).json({ message: "Invalid order ID format" });
        }

        // Populate product details
        const order = await Order.findById(orderId).populate("productsOrdered.productId");
        console.log("📌 MongoDB Query Result:", order);

        if (!order) {
            console.log("❌ Order Not Found in Database");
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        console.error("🔥 Order Retrieval Error:", error);
        res.status(500).json({ message: "Error retrieving order details", error: error.message });
    }
};

// Update Order Status
module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate order ID
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid order ID" });
        }

        // Find and update order status
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        console.error("❌ Order update error:", error);
        res.status(500).json({ message: "Error updating order", error: error.message });
    }
};
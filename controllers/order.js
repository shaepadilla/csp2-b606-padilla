const Order = require("../models/Order");
const Cart = require("../models/Cart");

module.exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate("cartItems.productId");

        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: "No items to checkout" });
        }

        const order = new Order({
            userId: req.user.id,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice,
        });

        await order.save();
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error processing order" });
    }
};

module.exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate("productsOrdered.productId");
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders" });
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("productsOrdered.productId");
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving all orders" });
    }
};

module.exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate("productsOrdered.productId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order details" });
    }
};

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
};
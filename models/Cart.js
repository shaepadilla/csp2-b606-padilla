// models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required'],
        min: [0, 'Subtotal cannot be negative']
    }
}, { _id: false }); // Prevent automatic _id for subdocuments

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true
    },
    cartItems: {
        type: [cartItemSchema],
        default: []
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Total price cannot be negative']
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Auto-update lastUpdated timestamp
cartSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Validate cart items before saving
cartSchema.pre('save', function(next) {
    if (this.cartItems && this.cartItems.length > 0) {
        const calculatedTotal = this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
        if (this.totalPrice !== calculatedTotal) {
            throw new Error('Cart total does not match sum of item subtotals');
        }
    }
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// [SECTION] Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// [SECTION] Server Setup
const app = express();

// [SECTION] Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => {
    console.log("Now connected to MongoDB Atlas.");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// [SECTION] Routes
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);

// [SECTION] Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`API is now online on port ${PORT}`);
});

module.exports = app;
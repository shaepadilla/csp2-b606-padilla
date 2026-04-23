// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();

// [SECTION] CORS Configuration
const corsOptions = {
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection; 

db.on("error", console.error.bind(console, "connection error"));

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.')); 

// [SECTION] Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));


// [SECTION] Backend Routes with /b6 prefix
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);


module.exports = app;
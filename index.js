// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Route Imports
const userRoutes = require("./routes/user");      // Matches routes/user.js
const productRoutes = require("./routes/product"); // Matches routes/product.js 
const cartRoutes = require("./routes/cart");      // Matches routes/cart.js
const orderRoutes = require("./routes/order");    // Matches routes/order.js

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
const app = express();
const corsOptions = {
    origin: [
        'http://localhost:3000', // React default port
        'http://localhost:8000',
        'http://ec2-3-15-19-15.us-east-2.compute.amazonaws.com',
        'http://zuitt-bootcamp-prod-530-8627-gandollas.s3-website.us-east-1.amazonaws.com',
        'http://zuitt-bootcamp-prod-530-8600-hernandez.s3-website.us-east-1.amazonaws.com/'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// [SECTION] Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));
mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));

// [SECTION] Backend Routes with /b6 prefix
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`API is now online on port ${PORT}`);
        console.log(`AWS accessible at: http://ec2-3-15-19-15.us-east-2.compute.amazonaws.com:${PORT}/b6`);
    });
}

module.exports = { app, mongoose };
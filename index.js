// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// [SECTION] Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// [SECTION] Server Setup
const app = express();

// [SECTION] CORS Configuration
const corsOptions = {
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// [SECTION] Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));
mongoose.connection.on('error', (err) => console.error("MongoDB connection error:", err));

// [SECTION] Backend Routes with correct prefix for checker
app.use("/boodle/capstone/csp2/users", userRoutes);
app.use("/boodle/capstone/csp2/products", productRoutes);
app.use("/boodle/capstone/csp2/cart", cartRoutes);
app.use("/boodle/capstone/csp2/orders", orderRoutes);

// [SECTION] Health Check Route
app.get("/boodle/capstone/csp2/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// [SECTION] Server Gateway Response
if(require.main === module){
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`API is now online on port ${PORT}`);
        console.log(`Capstone2 URL: http://localhost:${PORT}/boodle/capstone/csp2`);
    });
}

module.exports = app;
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

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:8000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

// [SECTION] Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
    console.log("Now connected to MongoDB Atlas.");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

// [SECTION] Routes - WITH THE REQUIRED PREFIX
const API_PREFIX = "/boodle/capstone/csp2";
// [SECTION] Routes
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);


// [SECTION] Server
if (require.main === module) {
    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
        console.log(`API is now online on port ${PORT}`);
        console.log(`Test endpoint: http://localhost:${PORT}${API_PREFIX}/users/register`);
    });
}

module.exports = app;
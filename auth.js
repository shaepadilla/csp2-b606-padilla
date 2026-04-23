const jwt = require("jsonwebtoken");
// [SECTION] Environment Setup
// Import our .env for environment variables
require('dotenv').config();

//[SECTION] Token Creation

module.exports.createAccessToken = (user) => {
    if (!user || !user._id) {
        console.error("❌ User ID is missing or invalid:", user);
        throw new Error("Invalid user object. Cannot generate token.");
    }

    const data = {
        id: String(user._id), // ✅ Convert ObjectId to string safely
        email: user.email,
        isAdmin: user.isAdmin,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

//[SECTION] Token Verification

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        console.warn("❌ No Authorization Token Provided.");
        return res.status(403).json({ auth: "Failed", message: "No Token Provided" });
    }

    token = token.replace("Bearer ", "").trim();
    console.log("📜 Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            console.error("❌ JWT Verification Error:", err.message);
            return res.status(403).json({ auth: "Failed", message: "Invalid Token" });
        }

        console.log("📝 Decoded Token:", decodedToken);

        if (!decodedToken.id) {
            console.warn("⚠️ User ID is missing in token payload.");
            return res.status(403).json({ auth: "Failed", message: "Invalid Token Data" });
        }

        req.user = decodedToken; // ✅ Attach decoded user data to request
        console.log("🔑 User Attached to Request:", req.user);
        next();
    });
};

//[SECTION] Verify Admin Access

module.exports.verifyAdmin = (req, res, next) => {
    // Checks if the owner of the token is an admin.
    if (req.user.isAdmin) {
        // If it is, move to the next middleware/controller using next() method.
        next();
    } else {
        // Else, end the request-response cycle by sending the appropriate response and status code.
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }
};

//[SECTION] Restrict Admins from User-Only Routes

module.exports.verifyUserAccess = (req, res, next) => {
    try {
        // ✅ Ensure the request contains a valid user object
        if (!req.user || typeof req.user.isAdmin === "undefined") {
            console.warn("❌ Invalid User: Authentication required.");
            return res.status(401).json({ message: "Unauthorized: User authentication required." });
        }

        // ✅ Restrict admins from accessing user-only routes
        if (req.user.isAdmin) {
            console.warn(`🚫 Access Denied: Admin tried accessing user-only route -> ${req.originalUrl}`);
            return res.status(403).json({ message: "Forbidden: Admins cannot access user-only routes." });
        }

        console.log(`✅ User Verified: Access granted -> ${req.originalUrl}`);
        next();

    } catch (error) {
        console.error("❌ Middleware Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//[SECTION] Error Handler

module.exports.errorHandler = (err, req, res, next) => {
    // Log the error
    console.error(err);

    // Ensures there's always a clear error message, either from the error itself or a fallback
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';

    // Send a standardized error response
    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    });
};
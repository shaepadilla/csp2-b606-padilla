const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports.createAccessToken = (user) => {
    if (!user || !user._id) {
        throw new Error("Invalid user object. Cannot generate token.");
    }

    const data = {
        id: String(user._id),
        email: user.email,
        isAdmin: user.isAdmin || false,
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    token = token.replace("Bearer ", "").trim();

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decodedToken;
        next();
    });
};

module.exports.verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: "Admin access required" });
    }
};
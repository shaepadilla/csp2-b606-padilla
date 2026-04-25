const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

// User Registration
module.exports.registerUser = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase();

        // Email validation - MUST include 'email' field
        if (!email || !email.includes("@")) {
            return res.status(400).json({ 
                message: "Invalid email format",
                email: "Invalid"
            });
        }
        
        // Mobile number validation
        if (!req.body.mobileNo || req.body.mobileNo.length !== 11) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }
        
        // Password validation
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10),
            isAdmin: false
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// User Login
module.exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase();

        // Check email format first
        if (!email || !email.includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "No email found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Email and password do not match" });
        }

        const token = auth.createAccessToken(user);
        
        return res.status(200).json({
            message: "Login successful",
            data: { token: token }
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get User Profile
module.exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user.id).select("-password").lean();
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "User found",
            user: user 
        });

    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Admin
module.exports.updateAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: "User updated successfully" });

    } catch (error) {
        console.error("Admin Update Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update Password
module.exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new passwords are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password Update Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
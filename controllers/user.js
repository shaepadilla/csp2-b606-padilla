const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

// 🛡️ User Registration
module.exports.registerUser = async (req, res) => {
    try {
        // ✅ Normalize email to lowercase to ensure consistency
        const email = req.body.email.toLowerCase();

        if (!email.includes("@")) {
            return res.status(400).send({ message: "Email invalid" });
        } else if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ message: "Mobile number invalid" });
        } else if (req.body.password.length < 8) {
            return res.status(400).send({ message: "Password must be at least 8 characters" });
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email, // ✅ Store email in lowercase
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10),
        });

        const result = await newUser.save();
        return res.status(201).json({ message: "Registered successfully", user: result });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 🔐 User Login
module.exports.loginUser = async (req, res) => {
    try {
        // ✅ Convert email to lowercase to ensure case-insensitive match
        const email = req.body.email.toLowerCase();

        console.log("🔍 Checking MongoDB for email:", email);

        const user = await User.findOne({ email });
        console.log("✅ Retrieved User:", user);

        if (!user) {
            console.error("❌ Email not found in database:", email);
            return res.status(404).json({ message: "Email not found" });
        }

        // ✅ Securely compare passwords using bcrypt
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) {
            console.error("❌ Password mismatch for:", email);
            return res.status(401).json({ message: "Email and password do not match" });
        }

        // ✅ Ensure user ID is valid before generating token
        if (!user._id) {
            console.error("⚠️ Missing `user._id` in database object!");
            return res.status(500).json({ message: "Invalid user object. Cannot generate token." });
        }

        const token = auth.createAccessToken(user);
        return res.status(200).json({
            access: token,
            user: {
                id: user._id.toString(), // ✅ Convert ObjectId to string for consistency
                email: user.email,
                isAdmin: user.isAdmin,
            },
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 👤 Get User Profile
module.exports.getProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User authentication required" });
        }

        const user = await User.findOne({ email: req.user.email }).select("-password").lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("❌ Profile Fetch Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 🔧 Update Admin Role
module.exports.updateAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        const updatedUser = await user.save();

        res.status(200).json({ updatedUser });

    } catch (error) {
        console.error("❌ Admin Update Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// 🔑 Update Password
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

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("❌ Password Update Error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Update only provided fields
        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                user[key] = updates[key];
            }
        });

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("❌ Profile Update Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// 🔍 Get User Details
module.exports.getUserDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(400).json({ message: "User authentication required" });
        }

        const user = await User.findOne({ email: req.user.email }).select("-password").lean();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("❌ Error Fetching User Details:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();

        if (!email.includes("@")) {
            return res.status(400).send({ message: "Email invalid" });
        }

        if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ message: "Mobile number invalid" });
        }

        if (req.body.password.length < 8) {
            return res.status(400).send({ message: "Password must be at least 8 characters" });
        }

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const result = await newUser.save();
        return res.status(201).send({ message: "Registered successfully", user: result });

    } catch(error) {
        if (error.code === 11000) {
            return res.status(409).send({ message: "Email already exists" });
        }
        return res.status(500).send({ message: "Internal server error" });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Email and password do not match" });
        }

        const token = auth.createAccessToken(user);
        return res.status(200).json({
            access: token,
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) {
                user[key] = updates[key];
            }
        });

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).json({ message: "User is now an admin", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
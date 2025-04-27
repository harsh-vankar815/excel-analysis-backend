const User = require('../models/UserModel');
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/createToken");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || role !== 'admin') {
        return res.status(400).json({ message: "Name, email, password and role='admin' required" });
    }

    const existsUser = await User.findOne({ email }).exec();
    if (existsUser) return res.status(409).json({ message: "Admin already exists" });

    const hashedPwd = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name,
        email,
        password: hashedPwd,
        role: 'admin'
    });

    const token = generateToken(admin._id);

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(201).json({ success: true, message: "Admin registered successfully", data: admin });
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const admin = await User.findOne({ email }).exec();
    if (!admin || admin.role !== 'admin') return res.status(401).json({ message: "Admin not found or unauthorized" });

    const isMatched = await bcrypt.compare(password, admin.password);
    if (!isMatched) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ message: "Admin login successful", token });
});

const logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Admin logged out" });
});

const forgotAdminPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const admin = await User.findOne({ email });
    if (!admin || admin.role !== 'admin') {
        return res.status(404).json({ message: "Admin not found" });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await admin.save();

    res.status(200).json({
        success: true,
        message: "Admin reset token generated",
        resetToken
    });
});

const resetAdminPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const admin = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        admin.password = hashedPassword;

        await admin.save();

        res.json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(400).json({ message: "Invalid or expired token." });
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
})

const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role || 'user';
    await user.save();

    res.status(200).json({ message: 'User role updated', user });
})

module.exports = {
    getAllUsers,
    deleteUser,
    updateUserRole,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    forgotAdminPassword,
    resetAdminPassword,
};
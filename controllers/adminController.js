const User = require('../models/UserModel');
const asyncHandler = require("express-async-handler");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
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

module.exports = { getAllUsers, deleteUser, updateUserRole };
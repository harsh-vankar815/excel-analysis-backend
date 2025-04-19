const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/createToken");
const bcrypt = require('bcrypt');

//user registration
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) return res.status(400).json({ 'message': 'Email, password and username required!' })

  const existsUser = await User.findOne({ email }).exec();
  if (existsUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);

    const addUser = await User.create({
      name,
      email,
      password: hashedPwd,
      role: role || 'user'
    });

    console.log(addUser)

    res.status(201).json({ success: true, message: "User created successfully", data: addUser });
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
});


//userLogin

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ message: "email not found" });
  }

  const isMatched = await bcrypt.compare(password, foundUser.password);
  if (isMatched) {
    const token = generateToken(foundUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    res.status(200).json({ message: "login successfully", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});


//userLogout
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "user logged out" });
});

// controllers/UserController.js
const crypto = require('crypto');

// Forgot Password - Direct token generation
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate plain text token (for immediate use)
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set expiration (10 minutes)
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset token generated",
    resetToken // Send the plain token in response
  });
});

// Reset Password (unchanged)
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.token;

  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  });
});
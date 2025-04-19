const USER_SCHEMA=require("../models/UserModel");
const asyncHandler=require("express-async-handler");
const { generateToken } = require("../utils/createToken");
//user registration
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    const existsUser = await USER_SCHEMA.findOne({ email });
    if (existsUser) {
      res.status(400).json({ message: "user already exists" });
    }
  
    let addUser = await USER_SCHEMA.create({ name, email, password });
    res.status(201).json({ success: true, message: "user created successfully", data: addUser });
  });


  //userLogin

  exports.loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;
    let findUser = await USER_SCHEMA.findOne({ email });
  
    if (!findUser) {
      res.status(400).json({ message: "email not found" });
    }
  
    let isMatched = findUser.matchPassword(password);
  
    if (!isMatched) {
      res.status(400).json({ message: "password not matched" });
    }
  
    let token = generateToken(findUser._id);
  
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.status(200).json({ message: "login successfully", token });
  });

  
  //userLogout
  exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token", "", { expiresIn: 0 });
    res.status(200).json({ message: "user logged out" });
  });







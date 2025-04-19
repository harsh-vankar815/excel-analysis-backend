const jwt = require("jsonwebtoken");
const USER_SCHEMA = require("../models/userModel");
const { JWT_SECRET } = require("../config");

exports.protect = async (req, res, next) => {
  let token = "";
  if (req.cookies.token) {
    let cookie = req.cookies.token;
    // console.log(cookie);
    token = jwt.verify(cookie, JWT_SECRET);
    // console.log(token);
    let user = await USER_SCHEMA.findById(token.id);
    if (!user) return res.status(400).json({ message: "user not found" }); //todo
    req.user = user;
    // console.log(req.user);
    next();
  } else {
    res.status(400).json({ message: "no token found" });
  }
};

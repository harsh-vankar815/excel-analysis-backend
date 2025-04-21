const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} = require('../controllers/UserController');
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
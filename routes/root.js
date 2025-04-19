const express = require('express');
const router = express.Router();
const path = require('path');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword
} = require('../controllers/UserController');

// / endpoint
router.get(/^\/$|\/index(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
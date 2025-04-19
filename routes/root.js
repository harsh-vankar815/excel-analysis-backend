const express = require('express');
const router = express.Router();
const path = require('path');
const { registerUser, login, loginUser, logoutUser } = require('../controllers/UserContorller');

// / endpoint
router.get(/^\/$|\/index(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);

module.exports = router;
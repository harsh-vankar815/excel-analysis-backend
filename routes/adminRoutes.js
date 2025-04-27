const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
    getAllUsers,
    deleteUser,
    updateUserRole,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    forgotAdminPassword,
    resetAdminPassword,
    adminSession
} = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');

router.get('/me', verifyToken, (req, res) => {
    res.json(req.admin); // Or send essential info
});
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/forgot-password', forgotAdminPassword);
router.post('/reset-password/:token', resetAdminPassword);

// Protect admin-only routes
router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);
router.patch('/user/:id', updateUserRole);


module.exports = router;
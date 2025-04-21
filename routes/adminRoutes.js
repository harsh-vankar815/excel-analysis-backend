const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/adminController');


router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id', updateUserRole);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
createUser,
getUserById,
updateUser,
deleteUser
} = require('../controllers/userController');

// GET user by ID
router.get('/:id', getUserById);

// POST register new user
router.post('/register', createUser);

// POST login user
router.post('/login', loginUser);

// POST logout user
router.post('/logout', logoutUser);

// PUT update user by ID
router.put('/:id', updateUser);

// DELETE user by ID
router.delete('/:id', deleteUser);

module.exports = router;
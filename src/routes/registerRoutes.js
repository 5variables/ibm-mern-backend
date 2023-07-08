const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/new-user', userController.registerUser);
router.post('/login', userController.loginUser);

router.post('/verify-token', userController.verifyToken);

module.exports = router;
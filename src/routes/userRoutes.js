const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/get-all', userController.getAllUsers);

module.exports = router;
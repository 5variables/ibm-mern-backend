const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/get-notifications-of-user/:mail', userController.getNotifications);
router.get('/get-all', userController.getAllUsers);

module.exports = router;
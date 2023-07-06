const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.post('/create', eventController.createEvent);

router.post('/register', eventController.registerUser);
router.post('/login', eventController.loginUser);

router.post('/verify-token', eventController.verifyToken);

module.exports = router;


/* 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGE3MWQzYzE5N2YzMjViZTE4ODI3ODYiLCJpYXQiOjE2ODg2NzM2MjR9.v0Aj1-ifUV9fcl86p-UUNldjuAtk94aVxaofT-2yDdE
*/
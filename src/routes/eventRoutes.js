const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/display', eventController.getEvents);
router.post('/create', eventController.createEvent);

module.exports = router;
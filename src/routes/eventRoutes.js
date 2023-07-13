const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/display', eventController.getEvents);
router.post('/create-event', eventController.createEvent);
router.post('/confirmation/:eventId/:userMail', eventController.confirmation);

module.exports = router;
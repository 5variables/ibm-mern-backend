const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');


router.post('/create-group', groupController.createGroup);
router.post('/confirmation/:groupId/:userMail', groupController.confirmation);

module.exports = router;
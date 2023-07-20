const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');


router.post('/create-group', groupController.createGroup);
router.post('/confirmation/:groupId/:userMail', groupController.confirmation);
router.post('/confirmInvite/:groupId/:userMail', groupController.confirmInvite);
router.delete('/quitGroup:/groupId/:userMail', groupController.quitGroup);

router.put('/invite/:groupName/:userMail', groupController.invite);

router.get('/get-group-name-from-groupid/:groupId', groupController.getGroupNameFromGroupId);
router.get('/get-all', groupController.getAll);

module.exports = router;
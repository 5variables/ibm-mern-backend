const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/get-notifications-of-user/:mail', userController.getNotifications);
router.get('/get-all', userController.getAllUsers);

router.delete('/delete/:id', userController.delete);

router.put('/update-first-name/:id/:value', userController.updateFirstName);
router.put('/update-last-name/:id/:value', userController.updateLastName);
router.put('/update-mail/:id/:value', userController.updateMail);
router.put('/update-password/:id/:value', userController.updatePassword);
router.put('/update-user/:id/:firstName/:lastName/:email:/:password', userController.updateUser);



module.exports = router;
const express = require('express');
const router = express.Router();

const userCtrl   = require('../controllers/userCtrl');

// Users routes
router.post('/signup/', userCtrl.signup);
router.post('/login/', userCtrl.login);

router.get('/:id/', userCtrl.getUserProfile);
router.put('/:id/username', userCtrl.updateUsername);
router.delete('/:id/', userCtrl.deleteUserProfile);
router.put('/:id/', userCtrl.updateUserProfile);


module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl   = require('../controllers/userCtrl');

// Users routes
router.get('/', userCtrl.getAllUsers);
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);


router.get('/:id/', userCtrl.getUserProfile);
router.put('/:id/username', userCtrl.updateUsername);
router.delete('/:id/', userCtrl.deleteUserProfile);
router.put('/:id/', userCtrl.updateUserProfile);
router.put('/:id/grant', userCtrl.grantAdmin);
router.put('/:id/revoke', userCtrl.revokeAdmin);


module.exports = router;
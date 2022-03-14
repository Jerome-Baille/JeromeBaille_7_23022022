const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');

const userCtrl  = require('../controllers/userCtrl');

// Users routes
router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/logout', auth, userCtrl.logout);

router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id/', auth, userCtrl.getUserProfile);
router.put('/:id/', auth, userCtrl.updateUserProfile);
router.put('/:id/username', auth, userCtrl.updateUsername);
router.delete('/:id/', auth, userCtrl.deleteUserProfile);
router.put('/:id/grant', auth, userCtrl.grantAdmin);
router.put('/:id/revoke', auth, userCtrl.revokeAdmin);


module.exports = router;
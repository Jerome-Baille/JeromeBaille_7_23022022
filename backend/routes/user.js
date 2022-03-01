const express = require('express');
const router = express.Router();

const userCtrl   = require('../controllers/userCtrl');

// Users routes
router.post('/signup/', userCtrl.signup);
router.post('/login/', userCtrl.login);

router.get('/me/', userCtrl.getUserProfile);
router.put('/me/', userCtrl.updateUserProfile);

module.exports = router;
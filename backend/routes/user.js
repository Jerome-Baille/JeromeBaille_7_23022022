// Imports
const express   = require('express');
const router    = express.Router();

// Middlewares
const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer-config');

// Controllers
const userCtrl  = require('../controllers/userCtrl');

// Routes
router.post     ('/register',           multer, userCtrl.register);
router.post     ('/login',                      userCtrl.login);

router.get      ('/logout',       auth,         userCtrl.logout);

router.get      ('/isAuth',       auth,         userCtrl.isAuth);
router.get      ('/',             auth,         userCtrl.getAllUsers);
router.get      ('/:id/',         auth,         userCtrl.getOneUser);

router.get      ('/userPosts/:id',auth,         userCtrl.getUserPosts);

router.put      ('/:id/',         auth, multer, userCtrl.updateUserProfile);
router.put      ('/:id/password', auth,         userCtrl.updatePassword);
router.delete   ('/:id/',         auth,         userCtrl.deleteUserProfile);
router.put      ('/:id/grant',    auth,         userCtrl.grantAdmin);
router.put      ('/:id/revoke',   auth,         userCtrl.revokeAdmin);
router.put      ('/:id/picture',  auth, multer, userCtrl.deleteProfilePicture)


module.exports = router;
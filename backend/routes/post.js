// Imports
const express       = require("express");
const router        = express.Router();

// Middlewares
const auth          = require('../middleware/auth');
const multer        = require('../middleware/multer-config');

// Controllers
const postCtrl      = require('../controllers/postCtrl');

// Routes
router.post     ('/',                       auth, multer,    postCtrl.createPost);
router.get      ('/:id',                    auth,           postCtrl.getOnePost);
router.get      ('/',                       auth,           postCtrl.getAllPosts);
router.get      ('/report/all',             auth,           postCtrl.getSignaledPosts);
router.put      ('/report/:id',             auth,           postCtrl.reportPost);
router.put      ('/unreport/:id',           auth,           postCtrl.unreportPost);
router.put      ('/:id',                    auth, multer,   postCtrl.updatePost);
router.put      ('/:id/picture',            auth, multer,   postCtrl.removeImage);
router.delete   ('/:id',                    auth,           postCtrl.deletePost);

module.exports = router;
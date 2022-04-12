// Imports
const express       = require("express");
const router        = express.Router();

// Middlewares
const auth          = require('../middleware/auth');
const multer        = require('../middleware/multer-config');

// Controllers
const commentsCtrl  = require('../controllers/commentsCtrl');

// Routes
router.post     ('/new/:postId',                auth, multer,   commentsCtrl.createComment);
router.get      ('/:commentId',                 auth,           commentsCtrl.getOneComment);
router.get      ('/post/:postId',               auth,           commentsCtrl.getPostComments);
router.get      ('/get/all',                    auth,           commentsCtrl.getAllComments);
router.put      ('/update/:commentId',          auth, multer,   commentsCtrl.updateComment);
router.put      ('/:commentId/picture',         auth, multer,   commentsCtrl.deleteCommentPicture);
router.delete   ('/del/:commentId',             auth,           commentsCtrl.deleteComments);

// report comment
router.put      ('/report/:commentId',          auth,           commentsCtrl.reportComment);
router.put      ('/unreport/:commentId',        auth,           commentsCtrl.unreportComment);
router.get      ('/report/all',                 auth,           commentsCtrl.getReportedComments);

module.exports = router;
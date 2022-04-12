// Imports
const express       = require("express");
const router        = express.Router();

// Middlewares
const auth          = require('../middleware/auth');

// Controllers
const likeCtrl      = require('../controllers/likesCtrl');

// Routes
router.post     ('/like',               auth,           likeCtrl.likePost);
router.post     ('/dislike',            auth,           likeCtrl.dislikePost);

router.post     ('/likeComment',        auth,           likeCtrl.likeComment);
router.post     ('/dislikeComment',     auth,           likeCtrl.dislikeComment);

module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/postCtrl');
const likeCtrl = require('../controllers/likesCtrl');
const commentsCtrl = require('../controllers/commentsCtrl');

router.post('/', auth, multer, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.get('/', auth, postCtrl.getAllPosts);
router.put('/:id', auth, /* multer, */ postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

router.post('/:id/like', auth, likeCtrl.likePost);
router.post('/:id/dislike', auth, likeCtrl.dislikePost);

router.post('/:id/comment/new', auth, commentsCtrl.createComment);
router.get('/:id/comment/:commentId', auth, commentsCtrl.getOneComment);
router.get('/:id/comment', auth, commentsCtrl.getAllComments);
router.put('/:id/comment/:commentId', auth, commentsCtrl.updateComment);
router.delete('/:id/comment/:commentId', auth, commentsCtrl.deleteComments);

module.exports = router;
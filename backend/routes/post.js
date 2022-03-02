const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/postCtrl');


router.post('/', auth, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.get('/', auth, postCtrl.getAllPosts);
router.put('/:id', auth, /* multer, */ postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);
// router.post('/:id/like', auth, postCtrl.likePosts);

module.exports = router;
const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const messageCtrl = require('../controllers/messagesCtrl');


router.post('/', auth, messageCtrl.createMessage);
router.get('/:id', auth, messageCtrl.getOneMessage);
router.get('/', auth, messageCtrl.getAllMessages);
router.put('/:id', auth, /* multer, */ messageCtrl.updateMessage);
router.delete('/:id', auth, messageCtrl.deleteMessage);
// router.post('/:id/like', auth, sauceCtrl.likeSauces);

module.exports = router;
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg' : 'jpg',
  'image/jpeg': 'jpg',
  'image/png' : 'png',
  'image/gif' : 'gif',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
const fileFilter = (req, file, callback) => {
  if (file.mimetype in MIME_TYPES) {
    callback(null, true);
  } else {
    return callback(new Error (`Le format choisi n'est pas autorisé`), false);
  }
}
const limits = {fileSize: 5242880};
const upload = multer({storage: storage, fileFilter: fileFilter, limits: limits}).single('image');

module.exports = (req, res, next) => {
  const size = req.headers['content-length'] / 1024 / 1024;
  if(size > 5) {
    return res.status(400).json({message: `La taille de l'image est trop grande`});
  } else {
    upload(req, res, (err) => {
      if(err) {
        return res.status(400).json({message: err.message});
      } else {
        next();
      }
    });
  }
}
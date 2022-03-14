// Imports
const fs              = require ('fs');

// Models
const { Post, User }  = require('../models');


// Create a Post
exports.createPost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var title           = req.body.title;
  var content         = req.body.content;

  if (title == null || title.length <= 1) {
    return res.status(400).json({message: `Veuillez renseigner un titre d'une longueur d'au minimum 2 caractères.`})
  }

  if (tokenUserId){
      User.findOne({
          where: {id: tokenUserId}
      })
      .then(function(user){
          if (user){
            req.file != undefined
            ? (attachment = `${req.protocol}://${req.get('host')}/images/${req.file}`)
            : (attachment = null);

            Post.create({
              title  : title,
              content: content,
              attachment: attachment,
              UserId : user.id
            })
          .then(function(newPost){
              if (newPost) {
                  return res.status(201).json(newPost);
                } else {
                  return res.status(500).json({ message: `Une erreur est survenue, le post n'a pas pu être créé.` });
                }
              })
          .catch(function(err) {
              return res.status(500).json({ message: err });
              });
          } else {
              res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
          }
      })
      .catch(function(err){
          res.status(500).json({message: err});
      });
  } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
};

// Read one or all posts
exports.getOnePost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var paramId         = req.params.id;

  if (tokenUserId){
    Post.findOne({
      where : { id: paramId },
      include: [{model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}]
    }).then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: `Aucun post n'a été trouvé.` });
      }
    }).catch(function(err) {
      res.status(500).json({ message: err });
    });
  } else {
    return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
};

exports.getAllPosts = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;

    if (tokenUserId){
      Post.findAll({
        where: {isActive: true},
        order: [(order != null) ? order.split(':') : ['updatedAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}]
      })
        .then(function(posts) {
          if (posts) {
            res.status(200).json(posts);
          } else {
            res.status(404).json({ message: `Aucun post n'a été trouvé.` });
          }
        })
        .catch(function(err) {
          res.status(500).json({ message: err });
        });
    } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
};

// Update Post
exports.updatePost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramId         = req.params.id;

  Post.findOne({
    where: {id: paramId}
  })
    .then(function(postFound){
      if (postFound.userId == tokenUserId || tokenIsAdmin == true){
        const postObject = req.file
        ? {
            ...req.body.postFound,
            attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
          }
        : { ...req.body };

        Post.update(
          { ...postObject, id: paramId },
          { where: { id: paramId } }
        )
          .then(() => res.status(200).json({ message : `Post modifié !` }))
          .catch((err) => res.status(400).json({ message: err }));
      } else {
        return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.` })
      }
    })
  .catch(function(err) {
    return res.status(500).json ({ message : err })
  });
};

// Delete Post
exports.deletePost = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;
  

  Post.findOne({
    where: { id: paramId }
  })
    .then(function(postFound){
      if (postFound.userId == tokenUserId || tokenIsAdmin == true){
        var image = postFound.attachment;
        fs.unlink(`${image}`, () => {
          postFound.destroy()
        })
        return res.status(201).json({ message: `Le post a été supprimé avec succès.` });
      } else {
        return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.` })
      }
    })
    .catch(function(err) {
      return res.status(500).json ({ message : err })
  });
};
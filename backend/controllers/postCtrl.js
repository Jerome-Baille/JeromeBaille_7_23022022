// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
const fs = require ('fs');

// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;

// Create a Post
exports.createPost = (req, res, next) => {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var userId      = jwtUtils.getUserId(headerAuth);

      // Params
      var title      = req.body.title;
      var content    = req.body.content;

      if (title == null || content == null) {
          return res.status(400).json({'error': 'missing parameters'});
      }

      if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
          return res.status(400).json({'error': 'invalid parameters'});
      }

    models.User.findOne({
        where: { id: userId }
    })
    .then(function(userFound){
        if (userFound){
            models.Post.create({
                title  : title,
                content: content,
                UserId : userFound.id
              })
            .then(function(newPost){
                if (newPost) {
                    return res.status(201).json(newPost);
                  } else {
                    return res.status(500).json({ 'error': 'cannot create a post' });
                  }
                })
            .catch(function(err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
                });
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};

// Read one or all posts
exports.getOnePost = (req, res, next) => {
  models.Post.findOne({
    where : { id: req.params.id },
  }).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ "error": "no posts found" });
    }
  }).catch(function(err) {
    console.log(err);
    res.status(500).json({ "error": err });
  });
};

exports.getAllPosts = (req, res, next) => {
        var fields  = req.query.fields;
        var limit   = parseInt(req.query.limit);
        var offset  = parseInt(req.query.offset);
        var order   = req.query.order;

        models.Post.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
          })
          .then(function(posts) {
            if (posts) {
              res.status(200).json(posts);
            } else {
              res.status(404).json({ "error": "no posts found" });
            }
          })
          .catch(function(err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
          });
};

// Update Post
exports.updatePost = (req, res, next) => {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);
  var isAdmin = req.body.isAdmin;

  models.Post.findOne({
    where: {id: req.params.id}
  })

  .then(function(postFound){
    if (isAdmin === 1 || postFound.userId === userId){
      const postObject = req.file
      ? {
          ...req.body.post,
          postUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

      models.Post.update(
        { ...postObject, id: req.params.id },
        { where: { id: req.params.id } }
      )
        .then(() => res.status(200).json({ post: "Post modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json({error: `Vous n'êtes pas autorisé à modifier ce post`})
    }
  })
  .catch(function(err) {
    return res.status(500).json ({ error : `Impossible de vérifier l'utilisateur` + err })
  });
};

// Delete Post
exports.deletePost = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    models.Post.findOne({
      where: {id: req.params.id}
  })

  .then(function(postFound){
      if(postFound) {
          var isAdmin = req.body.isAdmin;
          if (isAdmin === 1 || postFound.userId === userId){
              var image = postFound.attachement;
              fs.unlink(`${image}`, () => {
                postFound.destroy()
              })
              return res.status(201).json({post: 'Post supprimé'});
          }else {
              return res.status(403).json({error: `Vous n'êtes pas autorisé à supprimer ce post`})
          }
      } else {
          return res.status(403).json({ error: `Ce post n'est pas dans notre base de donné`});
      }
  })
  .catch(function(err) {
      return res.status(500).json ({ error : `Impossible de vérifier l'utilisateur` })
  });
};
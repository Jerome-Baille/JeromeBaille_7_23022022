// Imports
const fs              = require ('fs');
const sharp           = require('sharp');

// Models
const { Post, User, Comment, Like }  = require('../models');

async function resizeImage(input) {
  try {
    await sharp(input.path)
      .resize({
        width: 150
      })
      .toFile('images/' +'thumbnails-' + input.filename);
  } catch (error) {
    console.log(error);
  }
}

// Create a Post
exports.createPost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var title           = req.body.title;
  var content         = req.body.content;

  if( title == null && content == null && req.file == null) {
    return res.status(400).json({ message: `Veuillez renseigner un message ou ajouter une image.` });
  }

  if(title != null && title.length <= 1 || content != null && content.length <= 1) {
    return res.status(400).json({ message: `Votre message doit avoir une longueur d'au minimum 2 caractères.` });
  }

  if (tokenUserId){
      User.findOne({
          where: {id: tokenUserId}
      })
      .then(function(user){
          if (user){
            if(req.file !== undefined){
              resizeImage(req.file);
              (attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`);
              (thumbnail = `${req.protocol}://${req.get('host')}/images/thumbnails-${req.file.filename}`);
            } else {
              attachment = null;
              thumbnail = null;
            }

            Post.create({
              title  : title,
              content: content,
              attachment: attachment,
              thumbnail: thumbnail,
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
      include: [
        {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
        {model: Comment, include: {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}},
        {model: Like, include: [{model: User, attributes: ['id', 'username', 'isAdmin']}]}
      ]
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
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [
          {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
          {model: Comment, include: {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}},
          {model: Like, include: [{model: User, attributes: ['id', 'username', 'isAdmin']}]}
      ],
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

exports.getSignaledPosts = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;

    if (tokenUserId){
      Post.findAll({
        where: {isSignaled: true},
        order: [(order != null) ? order.split(':') : ['updatedAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [
          {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
          {model: Comment, include: {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}},
          {model: Like, include: [{model: User, attributes: ['id', 'username', 'isAdmin']}]}
      ],
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
        if (req.file){
          if (postFound.attachment != null){
            const image = postFound.attachment.split("/images/")[1];
            fs.unlink(`images/${image}`, () => {
              fs.unlink(`images/thumbnails-${image}`, () => {
                resizeImage(req.file);
                const postObject = {
                  ...req.body,
                  attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                  thumbnail: `${req.protocol}://${req.get("host")}/images/thumbnails-${req.file.filename}`
                }
                Post.update(
                  { ...postObject, id: paramId },
                  { where: { id: paramId } }
                )
                  .then(() => res.status(200).json({ message : `Post modifié avec succès !`, post: postObject }))
                  .catch((err) => res.status(400).json({ message: err }));
              })
            });
          } else {
            resizeImage(req.file);
            const postObject = {
              ...req.body,
              attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
              thumbnail: `${req.protocol}://${req.get("host")}/images/thumbnails-${req.file.filename}`
            }
            Post.update(
              { ...postObject, id: paramId },
              { where: { id: paramId } }
            )
              .then(() => res.status(200).json({ message : `Post modifié avec succès !`, post: postObject }))
              .catch((err) => res.status(400).json({ message: err }));
          }

        } else {
          const postObject = {
            ...req.body,
          }
          Post.update(
            { ...postObject, id: paramId },
            { where: { id: paramId } }
          )
            .then(() => res.status(200).json({ message : `Post modifié avec succès !`, post: postObject }))
            .catch((err) => res.status(400).json({ message: err }));
        }        
      } else {
        return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.` })
      }
    })
  .catch(function(err) {
    return res.status(500).json ({ message : err })
  });
};

// Remove image from post
exports.removeImage = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramId         = req.params.id;

  Post.findOne({
    where: {id: paramId}
  })
    .then(function(postFound){
      if (postFound.userId == tokenUserId || tokenIsAdmin == true){
        if (postFound.attachment){
          const image = postFound.attachment.split("/images/")[1];
          fs.unlink(`images/${image}`, () => {
            fs.unlink(`images/thumbnails-${image}`, () => {
              postFound.update({ 
                attachment: null 
              })
                .then(() => res.status(200).json({ message : `Image supprimée !` }))
                .catch((err) => res.status(400).json({ message: err }));
            })
          })
        } else {
          return res.status(400).json({ message: `Aucune image n'a été trouvée.` })
        }
        
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
        if(postFound.attachment){
          const image = postFound.attachment.split("/images/")[1];
          fs.unlink(`images/${image}`, () => {
            fs.unlink(`images/thumbnails-${image}`, () => {
              postFound.destroy()
            })
          })
          return res.status(201).json({ message: `Le post a été supprimé avec succès.` });
        } else {
            postFound.destroy()
          return res.status(201).json({ message: `Le post a été supprimé avec succès.` });
        }
      } else {
        return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.` })
      }
    })
    .catch(function(err) {
      return res.status(500).json ({ message : err })
  });
};

// Report a post
exports.reportPost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var isAdmin         = req.auth.isAdmin;
  var paramId         = req.params.id;

  Post.findOne({
    where: { id: paramId }
  })
    .then(function(postFound){
      if(postFound.isSignaled == false){
        postFound.update({ isSignaled: true })
        .then(() => res.status(200).json({ message: `Le post a été signalé avec succès.` }))
        .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(401).json({ message: `Le post a déjà été signalé.` });
      }
    })
    .catch(function(err) {
      return res.status(500).json ({ message : err })
  });
}

// Unreport on post
exports.unreportPost = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var isAdmin         = req.auth.isAdmin;
  var paramId         = req.params.id;

  Post.findOne({
    where: { id: paramId }
  })
    .then(function(postFound){
      if (isAdmin == true){
        if(postFound.isSignaled == true){
          postFound.update({ isSignaled: false, isActive: true })
          .then(() => res.status(200).json({ message: `Le signalement a été supprimé avec succès.` }))
          .catch((error) => res.status(400).json({ error }));
        } else {
          return res.status(401).json({ message: `Le post n'est pas signalé.` });
        }
      } else {
        return res.status(401).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.` })
      }
    })
    .catch(function(err) {
      return res.status(500).json ({ message : err })
  });
}
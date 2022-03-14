// Imports

// Models
const { Post, User, Comment } = require('../models');

// Create a Comment
exports.createComment = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var paramId         = req.params.id;
    var content         = req.body.content;

    if (content == null || content.length <= 1) {
      return res.status(400).json({message: `Veuillez renseigner un message d'une longueur d'au minimum 2 caractères.`})
    }

    if (tokenUserId){
      Comment.create({
          content: content,
          userId: tokenUserId,
          postId: paramId
      })
      .then(function(newComment){
          if (newComment) {
              return res.status(201).json(newComment);
            } else {
              return res.status(500).json({ message: `Impossible de créer un nouveau commentaire.` });
            }
      })
      .catch(function(err) {
          return res.status(500).json({ message: err });
      })
    } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
};

// Read one or all comments
exports.getOneComment = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var paramComId      = req.params.commentId;

  if (tokenUserId){
    Comment.findOne({
      where : { id: paramComId },
      include : [{model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}]
    }).then((comment) => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({ message : `Aucun commentaire n'a été trouvé.` });
      }
    }).catch(function(err) {
      res.status(500).json({ message: err });
    });
  } else {
    return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
};

exports.getAllComments = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;
    
    if (tokenUserId){
      Comment.findAll ({
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include : [{model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}]
    })
    .then(function(comments) {
        if (comments) {
            res.status(200).json(comments);
        } else {
            res.status(404).json({ message : `Aucun commentaire n'a été trouvé.` });
        }
    })
    .catch(function(err) {
        console.log(err);
        res.status(500).json({ message: err});
      });
    } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
}

// Update a Comment
exports.updateComment = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramComId      = req.params.commentId;

  Comment.findOne({
    where: { id: paramComId }
  })
  .then(function(commentFound){
    if (commentFound.userId === tokenUserId || tokenIsAdmin == true){
      const commentObject = req.file
      ? {
          ...req.body.comment,
          commentUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

      Comment.update(
        { ...commentObject, id: paramComId },
        { where: { id: paramComId } }
      )
        .then(() => res.status(200).json({ message: `Commentaire modifié avec succès.` }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json({ message: `Vous n'êtes pas autorisé à modifier ce commentaire`})
    }
  })
  .catch(function(err) {
    return res.status(500).json ({ message: err })
  });
};

// Delete a Comment
exports.deleteComments = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramComId      = req.params.commentId;

  Comment.findOne({
      where: {id: paramComId}
  }) 
  .then(function(commentsFound){
    if (commentsFound.userId === tokenUserId || tokenIsAdmin == true){            
        commentsFound.destroy();
        return res.status(201).json({ message: `Le commentaire a été supprimé avec succès.` });  
    } else {
      return res.status(403).json({ message: `Vous n'êtes pas autorisé à suprimer ce commentaire`})
    }
  })
  .catch(function(err) {
      return res.status(500).json ({ message: err})
  });
}
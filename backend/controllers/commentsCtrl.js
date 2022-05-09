// Imports
const fs              = require ('fs');

// Models
const { Post, User, Comment, ComLike } = require('../models');

// Create a Comment
exports.createComment = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var postId          = req.params.postId;
    var content         = req.body.content;

    if (content == null && req.file == null) {
      return res.status(400).json({ message: `Veuillez renseigner un message ou ajouter une image.` });
    }

    if (tokenUserId){
      req.file !== undefined
      ? (attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`)
      : (attachment = null);

      Comment.create({
          content: content,
          userId: tokenUserId,
          postId: postId,
          attachment: attachment
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
      include : [
        {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
        {model: ComLike}
      ]
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

exports.getPostComments = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var postId         = req.params.postId;
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;

  if (tokenUserId){
    Post.findOne({
      where : { id: postId },
      include : [
        {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
      ]
    }).then((postFound) => {
      if (postFound) {
        Comment.findAll({
          order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          where: {postId: postFound.id },
          include : [
            {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
            {model: ComLike}
          ]
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
        res.status(404).json({ message : `Aucun post n'a été trouvé.` });
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
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;
    var tokenIsAdmin    = req.auth.isAdmin;
    
    if (tokenIsAdmin){
      Comment.findAll ({
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include : [
          {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
          {model: ComLike},
        ]
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

// Get all reported comments
exports.getReportedComments = (req, res, next) => {
    // Params
    var fields          = req.query.fields;
    var limit           = parseInt(req.query.limit);
    var offset          = parseInt(req.query.offset);
    var order           = req.query.order;
    var tokenIsAdmin    = req.auth.isAdmin;
    
    if (tokenIsAdmin){
      Comment.findAll ({
        where: {isSignaled: true},
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include : [
          {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
          {model: ComLike}
        ]
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
      if (req.file){
        if(commentFound.attachment != null){
          const image = commentFound.attachment.split("/images/")[1];
          fs.unlink(`images/${image}`, () => {
            const commentObject = {
              ...req.body,
              attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            }
            Comment.update(
              { ...commentObject, id: paramComId },
              { where: { id: paramComId } }
            )
              .then(() => res.status(200).json({ message : `Commentaire modifié avec succès !`,  body: commentObject }))
              .catch((err) => res.status(400).json({ message: err }));
          });
        } else {
            const commentObject = {
              ...req.body,
              attachment: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            }
            Comment.update(
              { ...commentObject, id: paramComId },
              { where: { id: paramComId } }
            )
              .then(() => res.status(200).json({ message : `Commentaire modifié avec succès !`,  body: commentObject }))
              .catch((err) => res.status(400).json({ message: err }));
        }
      } else {
        const commentObject = {
          ...req.body,
          id: paramComId,
        }
        Comment.update(
          { ...commentObject },
          { where: { id: paramComId } }
        )
          .then(() => res.status(200).json({ message : `Commentaire modifié avec succès !`, body: commentObject }))
          .catch((err) => res.status(400).json({ message: err }));
      }
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
      if(commentsFound.attachment){
        const image = commentsFound.attachment.split("/images/")[1];
        fs.unlink(`images/${image}`, () => {
          commentsFound.destroy();
        })
        return res.status(201).json({ message: `Le commentaire a été supprimé avec succès.` }); 
      } else {
        commentsFound.destroy();
        return res.status(201).json({ message: `Le commentaire a été supprimé avec succès.` }); 
      }       
    } else {
      return res.status(403).json({ message: `Vous n'êtes pas autorisé à suprimer ce commentaire`})
    }
  })
  .catch(function(err) {
      return res.status(500).json ({ message: err})
  });
}

// Report a Comment
exports.reportComment = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramComId      = req.params.commentId;

  Comment.findOne({
      where: {id: paramComId}
  }) 
  .then(function(commentsFound){
    if (commentsFound.isSignaled == false){            
        commentsFound.update({ isSignaled: true })
        .then(() => res.status(200).json({ message: `Le commentaire a été signalé avec succès.` }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json({ message: `Le commentaire a déjà été signalé.`})
    }
  })
  .catch(function(err) {
      return res.status(500).json ({ message: err})
  });
}

// Unreport a Comment
exports.unreportComment = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var isAdmin         = req.auth.isAdmin;
  var paramComId      = req.params.commentId;

  Comment.findOne({
      where: {id: paramComId}
  }) 
  .then(function(commentsFound){
    if(isAdmin == true){
      if (commentsFound.isSignaled == true){            
        commentsFound.update({ isSignaled: false })
        .then(() => res.status(200).json({ message: `Le signalement a été supprimé avec succès.` }))
        .catch((error) => res.status(400).json({ error }));
      } else {
        return res.status(403).json({ message: `Le commentaire n'a pas été signalé.`})
      }
    } else {
      return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
  })
  .catch(function(err) {
      return res.status(500).json ({ message: err})
  });
}

// Delete picture attached to a Comment
exports.deleteCommentPicture = (req, res, next) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var tokenIsAdmin    = req.auth.isAdmin;
  var paramComId      = req.params.commentId;

  Comment.findOne({
      where: {id: paramComId}
  }) 
  .then(function(commentsFound){
    if (commentsFound.userId === tokenUserId || tokenIsAdmin == true){  
      if (commentsFound.attachment){
        const filename = commentsFound.attachment.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          commentsFound.update({
            attachment: null,
          })
        .then(() => res.status(200).json({ message: `L'image a été supprimée avec succès.` }))
        .catch((error) => res.status(400).json({ message : error }));
        });
      } else {
        return res.status(403).json({ message: `Aucune image n'est associée à ce commentaire.`})
      }
    } else {
      return res.status(403).json({ message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
  })
  .catch(function(err) {
      return res.status(500).json ({ message: err})
  });
}
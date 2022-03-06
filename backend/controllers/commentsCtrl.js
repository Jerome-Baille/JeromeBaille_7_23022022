// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');

exports.createComment = (req, res, next) => {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var userId      = jwtUtils.getUserId(headerAuth);

        //Paramètres
        var content = req.body.content;

        if (content == null) {
            return res.status(400).json({ 'error' : 'missing parameters'});
        }

        models.User.findOne({
            where: {id: userId}
        })
        .then(function(userFound) {
            if (userFound) {
                models.Comment.create({
                    content: content,
                    userId: userFound.id,
                    postId: req.params.id
                })
                .then(function(newComment){
                    if (newComment) {
                        return res.status(201).json(newComment);
                      } else {
                        return res.status(500).json({ 'error': 'cannot create a post' });
                      }
                })
                .catch(function(err) {
                    return res.status(500).json({ 'error': 'unable to verify user' });
                })
            } else {
                return res.status(404).json({'error' : 'user not found'});
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'unable to verify user' });
        })
};

exports.getAllComments = (req, res, next) => {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        
        models.Comment.findAll ({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
        })
        .then(function(comments) {
            if (comments) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ "error": "no posts found" });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
          });
}

exports.updateComment = (req, res, next) => {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);
  var isAdmin = req.body.isAdmin;

  models.Comment.findOne({
    where: {id: req.params.commentId}
  })

  .then(function(commentFound){
    if (isAdmin === 1 || commentFound.userId === userId){
      const commentObject = req.file
      ? {
          ...req.body.comment,
          commentUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

      models.Comment.update(
        { ...commentObject, id: req.params.commentId },
        { where: { id: req.params.commentId } }
      )
        .then(() => res.status(200).json({ post: "Comment modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json({error: `Vous n'êtes pas autorisé à modifier ce commentaire`})
    }
  })
  .catch(function(err) {
    return res.status(500).json ({ error : `Impossible de vérifier l'utilisateur` + err })
  });
};

exports.deleteComments = (req, res, next) => {
        // récupérer l'autorisation
        var headerAuth  = req.headers['authorization'];
        var userId      = jwtUtils.getUserId(headerAuth);

        models.Comment.findOne({
            where: {id: req.params.commentId}
        }) 

        .then(function(commentsFound){
            if(commentsFound) {
                var isAdmin = req.body.isAdmin;
                if (isAdmin === 1 || commentsFound.userId === userId){
                    
                    commentsFound.destroy();

                    return res.status(201).json({msg: 'commentaire supprimé'});
                }else {
                    return res.status(403).json({msg: 'vous n\'êtes pas autorisé à supprimer ce commentaire'})
                }
                
            }else {
                return res.status(403).json({ msg: 'ce commentaire n\'est pas dans notre base de donné' +err });
            }
        })
        .catch(function(err) {
            return res.status(500).json ({ msg : 'impossible de vérifier l\'utilisateur' + err})
        });
}
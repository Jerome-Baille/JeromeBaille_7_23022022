// Imports
const models = require("../models/");
var jwtUtils = require('../utils/jwt.utils');

exports.likePost = (req, res) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    models.Like.findOne({where:{userId: userId, postId: req.params.id}})
    .then((Like) => {
      if(Like) {
        if(!Like.isLiked){
          Like.update({isLiked: true})
          .then(() => res.status(201).json({message : `J'ai changé d'avis, j'aime ce post`}))
          .catch(error => res.status(400).json({ error }))
        } else {
          models.Like.destroy({where:{userId: userId, postId: req.params.id}})
          .then(() => res.status(201).json({message : `Je supprime mon like`}))
          .catch(error => res.status(400).json({ error }))
        }
      } else{
            models.Like.create({userId: userId, postId: req.params.id, isLiked: true,})
            .then((Like) => res.status(201).json({message : `J'aime ce post`, Like}))
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
}

exports.dislikePost = (req, res) => {
      // Getting auth header
      var headerAuth  = req.headers['authorization'];
      var userId      = jwtUtils.getUserId(headerAuth);
  
      models.Like.findOne({where:{userId: userId, postId: req.params.id}})
      .then((disLike) => {
        if(disLike) {
          if(disLike.isLiked){
            disLike.update({isLiked: false})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, je n'aime pas ce post`}))
            .catch(error => res.status(400).json({ error }))
          } else {
            models.Like.destroy({where:{userId: userId, postId: req.params.id}})
            .then(() => res.status(201).json({message : `Je supprime mon dislike`}))
            .catch(error => res.status(400).json({ error }))
          }
        } else{
              models.Like.create({userId: userId, postId: req.params.id, isLiked: false,})
              .then((disLike) => res.status(201).json({message : `Je n'aime pas ce post`, disLike}))
              .catch(error => res.status(400).json({ error }))
          }
      })
      .catch(error => res.status(400).json({ error }))
}
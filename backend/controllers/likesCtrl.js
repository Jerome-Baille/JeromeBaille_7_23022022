// Imports

// Models
const { Like } = require("../models/");


// Like a post
exports.likePost = (req, res) => {
  // Params
  var tokenUserId     = req.auth.userId;
  var paramId         = req.params.id;

  if (tokenUserId){
    Like.findOne({
      where:{ 
        userId: tokenUserId, 
        postId: paramId
      }
    })
    .then((likeFound) => {
      if(likeFound) {
        if(!likeFound.isLiked){
          likeFound.update({isLiked: true})
          .then(() => res.status(201).json({message : `J'ai changé d'avis, j'aime ce post`}))
          .catch(err => res.status(400).json({ message: err }))
        } else {
          Like.destroy({where:{ userId: tokenUserId, postId: paramId }})
          .then(() => res.status(201).json({message : `Je supprime mon like`}))
          .catch(error => res.status(400).json({ error }))
        }
      } else{
            Like.create({userId: tokenUserId, postId: paramId, isLiked: true,})
            .then((likeFound) => res.status(201).json({message : `J'aime ce post`, likeFound}))
            .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(400).json({ error }))
  } else {
    return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
}


// Dislike a post
exports.dislikePost = (req, res) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var paramId         = req.params.id;
  
    if (tokenUserId){
      Like.findOne({
        where:{
          userId: tokenUserId, 
          postId: paramId
        }
      })
      .then((disLikeFound) => {
        if(disLikeFound) {
          if(disLikeFound.isLiked){
            disLikeFound.update({isLiked: false})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, je n'aime pas ce post`}))
            .catch(err => res.status(400).json({ message: err }))
          } else {
            Like.destroy({where:{ userId: tokenUserId, postId: paramId }})
            .then(() => res.status(201).json({message : `Je supprime mon dislike`}))
            .catch(error => res.status(400).json({ error }))
          }
        } else{
              models.Like.create({userId: tokenUserId, postId: paramId, isLiked: false,})
              .then((disLikeFound) => res.status(201).json({message : `Je n'aime pas ce post`, disLikeFound}))
              .catch(error => res.status(400).json({ error }))
          }
      })
      .catch(error => res.status(400).json({ error }))
    } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
}
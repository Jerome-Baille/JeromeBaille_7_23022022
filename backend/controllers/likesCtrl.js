// Imports

// Models
const { Like, Post, ComLike, Comment } = require("../models/");


// Like a post
exports.likePost = (req, res) => {
  // Params
  var postId  = req.body.postId;
  var userId  = req.auth.userId;
  
  if (userId){
    Like.findOne({
      where:{ 
        userId: userId, 
        postId: postId
      }
    })
    .then((likeFound) => {
      if(likeFound) {
        if(!likeFound.isLiked){
          likeFound.update({isLiked: true})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, j'aime ce post`}))
            .catch(err => res.status(400).json({ message: err }))
          
          Post.findOne({
            where:{
              id: postId
            }
          })
          .then((postFound) => {
            postFound.update({points: postFound.points + 2})
          })
          .catch(error => res.status(400).json({ error }))
        } else {
          Like.destroy({where:{ userId: userId, postId: postId }})
            .then(() => res.status(201).json({message : `Je supprime mon like`}))
            .catch(error => res.status(400).json({ error }))

            Post.findOne({
              where:{
                id: postId
              }
            })
            .then((postFound) => {
              postFound.update({points: postFound.points - 1 })
            })
            .catch(error => res.status(400).json({ error }))
        }
      } else{
            Like.create({userId: userId, postId: postId, isLiked: true,})
              .then((likeFound) => res.status(201).json({message : `J'aime ce post`, likeFound}))
              .catch(error => res.status(400).json({ error }))
            
              Post.findOne({
                where:{
                  id: postId
                }
              })
              .then((postFound) => {
                postFound.update({points: postFound.points + 1})
              })
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
    var postId  = req.body.postId;
    var userId  = req.auth.userId;
  
    if (userId){
      Like.findOne({
        where:{
          userId: userId, 
          postId: postId
        }
      })
      .then((disLikeFound) => {
        if(disLikeFound) {
          if(disLikeFound.isLiked){
            disLikeFound.update({isLiked: false})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, je n'aime pas ce post`}))
            .catch(err => res.status(400).json({ message: err }))

            Post.findOne({
              where:{
                id: postId
              }
            })
            .then((postFound) => {
              postFound.update({points: postFound.points - 2})
            })
            .catch(error => res.status(400).json({ error }))
          } else {
            Like.destroy({where:{ userId: userId, postId: postId }})
              .then(() => res.status(201).json({message : `Je supprime mon dislike`}))
              .catch(error => res.status(400).json({ error }))
            
              Post.findOne({
                where:{
                  id: postId
                }
              })
              .then((postFound) => {
                postFound.update({points: postFound.points + 1})
              })
              .catch(error => res.status(400).json({ error }))
          }
        } else{
              Like.create({userId: userId, postId: postId, isLiked: false,})
                .then((disLikeFound) => res.status(201).json({message : `Je n'aime pas ce post`, disLikeFound}))
                .catch(error => res.status(400).json({ error }))
              
                Post.findOne({
                  where:{
                    id: postId
                  }
                })
                .then((postFound) => {
                  postFound.update({points: postFound.points - 1})
                })
                .catch(error => res.status(400).json({ error }))
          }
      })
      .catch(error => res.status(400).json({ error }))
    } else {
      return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
}

// Like a comment
exports.likeComment = (req, res) => {
  // Params
  var commentId  = req.body.commentId;
  var userId  = req.auth.userId;
  
  if (userId){
    ComLike.findOne({
      where:{ 
        userId: userId, 
        commentId: commentId
      }
    })
    .then((likeFound) => {
      if(likeFound) {
        if(!likeFound.isLiked){
          likeFound.update({isLiked: true})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, j'aime ce commentaire`, likeFound}))
            .catch(err => res.status(400).json({ message: err }))
          
          Comment.findOne({
            where:{
              id: commentId
            }
          })
          .then((commentFound) => {
            commentFound.update({points: commentFound.points + 2})
          })
          .catch(error => res.status(400).json({ error }))
        } else {
          ComLike.destroy({where:{ userId: userId, commentId: commentId }})
            .then(() => res.status(201).json({message : `Je supprime mon like`}))
            .catch(error => res.status(400).json({ error }))

            Comment.findOne({
              where:{
                id: commentId
              }
            })
            .then((commentFound) => {
              commentFound.update({points: commentFound.points - 1 })
            })
            .catch(error => res.status(400).json({ error }))
        }
      } else{
          ComLike.create({userId: userId, commentId: commentId, isLiked: true,})
              .then((likeFound) => res.status(201).json({message : `J'aime ce commentaire`, likeFound}))
              .catch(error => res.status(400).json({ error }))
            
              Comment.findOne({
                where:{
                  id: commentId
                }
              })
              .then((commentFound) => {
                commentFound.update({points: commentFound.points + 1})
              })
              .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
  } else {
    return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
}

// Dislike a comment
exports.dislikeComment = (req, res) => {
  // Params
  var commentId  = req.body.commentId;
  var userId  = req.auth.userId;
  
  if (userId){
    ComLike.findOne({
      where:{
        userId: userId, 
        commentId: commentId
      }
    })
    .then((disLikeFound) => {
      if(disLikeFound) {
        if(disLikeFound.isLiked){
          disLikeFound.update({isLiked: false})
            .then(() => res.status(201).json({message : `J'ai changé d'avis, je n'aime pas ce commentaire`, disLikeFound}))
            .catch(err => res.status(400).json({ message: err }))

          Comment.findOne({
            where:{
              id: commentId
            }
          })
          .then((commentFound) => {
            commentFound.update({points: commentFound.points - 2})
          })
          .catch(error => res.status(400).json({ error }))
        } else {
          ComLike.destroy({where:{ userId: userId, commentId: commentId }})
            .then(() => res.status(201).json({message : `Je supprime mon dislike`}))
            .catch(error => res.status(400).json({ error }))

            Comment.findOne({
              where:{
                id: commentId
              }
            })
            .then((commentFound) => {
              commentFound.update({points: commentFound.points + 1})
            })
            .catch(error => res.status(400).json({ error }))
        }
      } else{
          ComLike.create({userId: userId, commentId: commentId, isLiked: false,})
              .then((disLikeFound) => res.status(201).json({message : `Je n'aime pas ce commentaire`, disLikeFound}))
              .catch(error => res.status(400).json({ error }))
            
              Comment.findOne({
                where:{
                  id: commentId
                }
              })
              .then((commentFound) => {
                commentFound.update({points: commentFound.points - 1 })
              })
              .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
  } else {
    return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
  }
}
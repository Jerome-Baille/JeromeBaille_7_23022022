// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');


// Constants


// Routes
module.exports = {
    likePost: function(req, res) {
         // Getting auth header
         var headerAuth  = req.headers['authorization'];
         var userId      = jwtUtils.getUserId(headerAuth);

         // Params
         var messageId = req.query.messageId;

         if (messageId <= 0) {
             return res.status(400).json({'error': 'invalid parameters'});
         }

         
        models.Like.findOne({
            where: { 
                userId: req.body.userId,
                postId: messageId
             }
        })
        .then(function(like){
            if(like !== null) {
                if (req.body.like === 0 && req.body.like !== like.like) {
                    like.update({
                        like: req.body.like
                    })
                    .then(() => res.status(201).json({'message':  `J'annule mon vote`}))
                    .catch(error => res.status(400).json({error}));
                } else if (req.body.like === -1 && req.body.like != like.like) {
                    like.update({
                        like: req.body.like
                    })
                    .then(() => res.status(201).json({'message': `Je n'aime pas`}))
                    .catch(error => res.status(400).json({error}));
                }else if (req.body.like === 1 && req.body.like !== like.like) {
                    like.update({
                        like: req.body.like
                    })
                    .then(() => res.status(201).json({'message': `J'aime`}))
                    .catch(error => res.status(400).json({error}));
                } else {
                    res.send('already liked');
                }
                } else {
                    if (req.body.like === 1) {
                        models.Like.create({
                            like: req.body.like,
                            idusers : userId(req),
                            idMessages : req.body.idMessage
                        })
                        .then(() => res.status(201).json({'message': `vote registered`}))
                        .catch(error => res.status(400).json({error}));
                    } else {
                        console.log('unauthorized value');
                        res.send('unauthorized value');
                    }
                }

        })
        .catch(function(err){
            return res.status(500).json({'error': 'unable to verify message'});
        });
},
}
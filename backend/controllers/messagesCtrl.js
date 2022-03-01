// Imports
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
const fs = require ('fs');

// Constants
const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;

// Create a Post
exports.createMessage = (req, res, next) => {
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
            models.Message.create({
                title  : title,
                content: content,
                likes  : 0,
                UserId : userFound.id
              })
            .then(function(newMessage){
                if (newMessage) {
                    return res.status(201).json(newMessage);
                  } else {
                    return res.status(500).json({ 'error': 'cannot post message' });
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

// Read one or all messages
exports.getOneMessage = (req, res, next) => {
  models.Message.findOne({
    where : { id: req.params.id },
  }).then((message) => {
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ "error": "no messages found" });
    }
  }).catch(function(err) {
    console.log(err);
    res.status(500).json({ "error": err });
  });
};

exports.getAllMessages = (req, res, next) => {
        var fields  = req.query.fields;
        var limit   = parseInt(req.query.limit);
        var offset  = parseInt(req.query.offset);
        var order   = req.query.order;

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['title', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
              model: models.User,
              attributes: [ 'username' ]
            }]
          }).then(function(messages) {
            if (messages) {
              res.status(200).json(messages);
            } else {
              res.status(404).json({ "error": "no messages found" });
            }
          }).catch(function(err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
          });
};

// Update Message
exports.updateMessage = (req, res, next) => {
  // Getting auth header
  var headerAuth  = req.headers['authorization'];
  var userId      = jwtUtils.getUserId(headerAuth);
  var isAdmin = req.body.isAdmin;

  models.Message.findOne({
    where: {id: req.params.id}
  })

  .then(function(messageFound){
    if (isAdmin === 1 || messageFound.userId === userId){
      const messageObject = req.file
      ? {
          ...req.body.message,
          messageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

      models.Message.update(
        { ...messageObject, id: req.params.id },
        { where: { id: req.params.id } }
      )
        .then(() => res.status(200).json({ message: "Message modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      return res.status(403).json({error: `Vous n'êtes pas autorisé à modifier ce message`})
    }
  })
  .catch(function(err) {
    return res.status(500).json ({ error : `Impossible de vérifier l'utilisateur` + err })
  });
};

// Delete Message
exports.deleteMessage = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    models.Message.findOne({
      where: {id: req.params.id}
  })

  .then(function(messageFound){
      if(messageFound) {
          var isAdmin = req.body.isAdmin;
          if (isAdmin === 1 || messageFound.userId === userId){
              var image = messageFound.attachement;
              fs.unlink(`${image}`, () => {
                  messageFound.destroy()
              })
              return res.status(201).json({message: 'Message supprimé'});
          }else {
              return res.status(403).json({error: `Vous n'êtes pas autorisé à supprimer ce message`})
          }
      } else {
          return res.status(403).json({ error: `Ce message n'est pas dans notre base de donné` + err});
      }
  })
  .catch(function(err) {
      return res.status(500).json ({ error : `Impossible de vérifier l'utilisateur` + err })
  });
};
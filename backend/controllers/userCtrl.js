// Imports
var bcrypt      = require('bcrypt');
var jwtUtils    = require('../utils/jwt.utils');
const User = require('../models').User;
const passwordValidator = require('password-validator'); // A library to simplify the rules of password validation, by taking away all the repeated parts and by providing a readable and maintainable API to use
const emailValidator = require("email-validator"); // Makes sure that the email address is valid
const jwt = require('jsonwebtoken');

// Create a schema for the passwords
var schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
.is().min(8)                    // Minimum length 8
.is().max(100)                  // Maximum length 100
.has().uppercase()              // Must have uppercase letters
.has().lowercase()              // Must have lowercase letters
.has().digits(1)                // Must have at least 1 digit

// Signup
exports.signup = (req, res, next) => {
    // Params
    var email       = req.body.email;
    var username    = req.body.username;
    var password    = req.body.password;
    var bio         = req.body.bio;

    User.findOne({
        where: {username: username}
    })
    .then(function(userFound){
        if (!userFound) {
            if (emailValidator.validate(email)) {
                if (schemaPassword.validate(password)) {
                    User.findOne({
                        attributes: ['email'],
                        where: {email: email}
                    })
                    .then(function(userFound) {
                        if (!userFound) {
                            bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                                var newUser = User.create({
                                    email       : email,
                                    username    : username,
                                    password    : bcryptedPassword,
                                    bio         : bio,
                                    isAdmin     : 0
                                })
                                .then(function(newUser){
                                    return res.status(201).json({
                                        'userId': newUser.id
                                    })
                                })
                                .catch(function(err){
                                    return res.status(500).json({'error': 'cannot add user'});
                                });
                            });
                        } else {
                            return res.status(409).json({'error': `L'adresse e-mail est déjà utilisée`});
                        }
                    })
                    .catch(function(err){
                        return res.status(500).json({'error': 'unable to verify user'});
                    });
                } else {
                    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`}); 
                }
            } else {
                return res.status(401).json({message : `L'adresse e-mail saisie est invalide. Veuillez entrer une adresse e-mail valide.`}); 
            }
        } else {
            return res.status(500).json({'error': `Le pseudo choisi existe déjà. Merci d'en choisir un autre.`});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'unable to verify user'});
    });

    

};

// Login
exports.login = (req, res, next) => {
    // Params
    var email       = req.body.email;
    var password    = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({'error': 'missing parameters'});
    }

    // TODO verify mail regex and password length
    User.findOne({
        where: {email: email}
    })
    .then(function(userFound){
        if (userFound) {
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                if (resBycrypt) {
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateTokenForUser(userFound)
                    });
                } else {
                    return res.status(403).json({'error': 'invalid password'});
                }
            });
        } else {
            return res.status(404).json({'error': 'user not exists in DB'});
        }
    })
    .catch(function(err){
        return res.status(500).json({'error': 'unable to verify user'});
    });
};


// Read user profile
exports.getUserProfile = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    if (userId < 0)
        return res.status(400).json({'error': 'wrong token'});

    User.findOne({
        attributes: ['id', 'email', 'username', 'bio'],
        where: {id: userId}
    }).then(function(user){
        if (user){
            res.status(201).json(user);
        } else {
            res.status(404).json({'error': 'user not found'})
        }
    }).catch(function(err){
        res.status(500).json({'error': 'cannot fetch user'});
    });
};

// Update user profile
exports.updateUserProfile = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var bio = req.body.bio;

    // TODO
    User.findOne({
        attributes: ['id', 'bio'],
        where: {id: userId}
    })
    .then(function (userFound){
        if (userFound){
            userFound.update({
                bio: (bio ? bio : userFound.bio)
            })
            return res.status(201).json(userFound);
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};
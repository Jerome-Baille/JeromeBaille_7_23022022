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
exports.register = (req, res, next) => {
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
        return res.status(400).json({message: `Veuillez renseigner les champs 'Email' et 'Password'`});
    }

    User.findOne({
        where: {email: email}
    })
    .then(function(userFound){
        if (!userFound){
            return res.status(401).json({message: `Nous n'avons pas trouvé de compte correspondant à l'adresse e-mail renseignée.`});
        }
        bcrypt.compare(password, userFound.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({message : `Le mot de passe renseigné est incorrect.` });
          }
          const token = jwt.sign({
                userId: userFound.id,
                isAdmin: userFound.isAdmin
            },
            "RANDOM_TOKEN_SECRET",
            { expiresIn: '1h' }
            );
            res.cookie('jwt', token)
            res.status(200).json({
                'userId': userFound.id,
                'token': token
            })
        })
        .catch(error => res.status(500).json({ error }));


                // return res.status(200).json({
                //     'userId': userFound.id,
                //     'token': jwtUtils.generateTokenForUser(userFound)
                // });
        //     }
        // });

    })
    .catch(function(err){
        return res.status(500).json({message: 'unable to verify user'});
    });
};

// Logout
exports.logout = (req, res, next) => {
    return res
        .clearCookie("jwt", {domain: 'localhost', path: '/'})
        .status(200)
        .json({message : `Compte déconnecté avec succès`});
};

// Grant admin privileges
exports.grantAdmin = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var isAdmin = req.isAdmin;
    
    User.findOne({
        where: {id: userId}
    })
    .then(function (user){
        if (user){
            if (user.isAdmin === true) {
                User.findOne({
                    where: {id: req.params.id}
                })
                .then(function(userKing){
                    userKing.update({
                        isAdmin: true,
                    })
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'Unable to give the admin rights to this user'});
                })
                return res.status(200).json({'message': `the user has now admin rights`});
            } else {
                return res.status(403).json({'error': 'You cannot access this profile'});
            }
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};

// Revoke admin privileges
exports.revokeAdmin = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var isAdmin = req.isAdmin;
    
    User.findOne({
        where: {id: userId}
    })
    .then(function (user){
        if (user){
            if (user.isAdmin === true) {
                User.findOne({
                    where: {id: req.params.id}
                })
                .then(function(userKing){
                    userKing.update({
                        isAdmin: false,
                    })
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'Unable to give the admin rights to this user'});
                })
                return res.status(200).json({'message': `the user lost admin rights`});
            } else {
                return res.status(403).json({'error': 'You cannot access this profile'});
            }
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};

// Get all users
exports.getAllUsers = (req, res, next) => {
    User.findAll({
        attributes: ['id', 'email', 'username', 'bio', 'isAdmin']
    })
    .then(function(userFound){
        if (userFound) {
            return res.status(200).json(userFound)
        } else {
            return res.status(404).json({'error': 'No users found'})
        }
    })
    .catch(function(err){
        return res.status(500).json(err)
    })
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
        where: {id: req.params.id}
    })
    .then(function(user){
        if (user){
            User.findOne({
                where: {id: userId}
            })
            .then(function(userFound){
                if (user.id === userId || userFound.isAdmin === true) {
                    res.status(201).json(user);
                } else {
                    res.status(403).json({'error': 'You cannot access this profile'});
                }
            })
            .catch(function(err){
                return res.status(500).json({ 'error': 'unable to verify user' });
            })
            
        } else {
            res.status(404).json({'error': 'user not found'})
        }
    })
    .catch(function(err){
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
    var email = req.body.email;
    var password = req.body.password;
    var isAdmin = req.body.isAdmin;

    User.findOne({
        attributes: ['id', 'email', 'password', 'bio'],
        where: {id: req.params.id}
    })
    .then(function (userFound){
        if (userFound){
            if (userFound.id === userId || isAdmin === true) {
                if (email) {
                    if (emailValidator.validate(email)) {
                        userFound.update({
                            email: (email ? email : userFound.email)
                        })
                    } else {
                        return res.status(401).json({message : `L'adresse e-mail saisie est invalide. Veuillez entrer une adresse e-mail valide.`}); 
                    }
                } else if (password) {
                    if (schemaPassword.validate(password)) {
                        bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                            userFound.update({
                                password: (password ? bcryptedPassword : userFound.password)
                            })
                        })
                    } else {
                        return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`}); 
                    }
                } else {
                    userFound.update({
                        bio: (bio ? bio : userFound.bio),
                    })
                }
                return res.status(201).json({'message': 'Profile has been updated', userFound});
            } else {
                return res.status(403).json({'error': 'You cannot access this profile'}); 
            }
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};

exports.updateUsername = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    // Params
    var username    = req.body.username;
    var isAdmin = req.body.isAdmin;
    
    User.findOne({
        attributes: ['id', 'username'],
        where: {id: req.params.id}
    })
    .then(function (user){
        if (user){
            if (user.id === userId || isAdmin === true) {
                User.findOne({
                    where: {username: username}
                })
                .then(function(userAlreadyExists){
                    if (!userAlreadyExists) {
                        user.update({
                            username: (username ? username : user.username ),
                        })
                        return res.status(201).json({'message': 'Profile has been updated', user});
                    } else {
                        return res.status(500).json({'error': `Le pseudo choisi existe déjà. Merci d'en choisir un autre.`});
                    }
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'unable to verify user'});
                });
            } else {
                return res.status(403).json({'error': 'You cannot access this profile'});
            }
        } else {
            return res.status(404).json({'error' : 'user not found'});
        }
    })
    .catch(function(err){
        return res.status(500).json({ 'error': 'unable to verify user' });
    })
};


// Delete User profile
exports.deleteUserProfile = (req, res, next) => {
    // Getting auth header
    var headerAuth  = req.headers['authorization'];
    var userId      = jwtUtils.getUserId(headerAuth);

    User.findOne({
        where: {id: req.params.id}
    })
    .then(function (userFound){
        if (userFound){
            User.findOne({
                where: {id: userId}
            })
            .then(function(userRight){
                if (userFound.id === userId || userRight.isAdmin === true) {
                    userFound.destroy()
                    return res.status(200).json({'message': `Your account has been deleted`});
                } else {
                    return res.status(403).json({'error': 'You cannot access this profile'});
                }
            })
            .catch(function(err){
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
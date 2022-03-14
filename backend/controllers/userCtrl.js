// Imports
const jwt               = require('jsonwebtoken'); // Authentification system
const bcrypt            = require('bcrypt'); // Encrypts the password sent to the database
const passwordValidator = require('password-validator'); // A library to simplify the rules of password validation, by taking away all the repeated parts and by providing a readable and maintainable API to use
const emailValidator    = require("email-validator"); // Makes sure that the email address is valid

// Models
const { User }          = require('../models');

// Create a schema for the passwords
var schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
.is().min(8)                    // Minimum length 8
.is().max(100)                  // Maximum length 100
.has().uppercase()              // Must have uppercase letters
.has().lowercase()              // Must have lowercase letters
.has().digits(1)                // Must have at least 1 digit

// Register
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
                                    return res.status(500).json({message: `Création du compte impossible. Veuillez rééssayer.`});
                                });
                            });
                        } else {
                            return res.status(409).json({message: `L'adresse e-mail est déjà utilisée`});
                        }
                    })
                    .catch(function(err){
                        return res.status(500).json({message: err});
                    });
                } else {
                    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`}); 
                }
            } else {
                return res.status(401).json({message : `L'adresse e-mail saisie est invalide. Veuillez entrer une adresse e-mail valide.`}); 
            }
        } else {
            return res.status(500).json({message: `Le pseudo choisi existe déjà. Merci d'en choisir un autre.`});
        }
    })
    .catch(function(err){
        return res.status(500).json({message: err});
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
            return res
                .cookie('jwt', token /*, {httpOnly: true}*/)
                .status(200)
                .json({
                    message: 'Vous êtes connecté',
                    'userId': userFound.id,
                    'token': token
                })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(function(err){
        return res.status(500).json({message: err});
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
    // Params
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;

    if (tokenIsAdmin == true){
        User.findOne({
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                user.update({
                    isAdmin: true,
                })
                return res.status(200).json({message: `L'utilisateur dispose à présent des droits administrateurs.`})
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
};

// Revoke admin privileges
exports.revokeAdmin = (req, res, next) => {
    // Params
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;

    if (tokenIsAdmin == true){
        User.findOne({
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                user.update({
                    isAdmin: false,
                })
                return res.status(200).json({message: `Les droits administrateurs ont été retiré à l'utilisateur.`})
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
};

// Get all users
exports.getAllUsers = (req, res, next) => {
    // Params
    var tokenIsAdmin    = req.auth.isAdmin;

    if (tokenIsAdmin == true){
        User.findAll({
            attributes: ['id', 'email', 'username', 'bio', 'isAdmin'],
        })
        .then(function(user){
            if (user){
                return res.status(200).json(user); 
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }
};

// Read user profile
exports.getUserProfile = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                return res.status(201).json(user); 
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à accéder à ce profil`})
    }
};

// Update user profile
exports.updateUserProfile = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;
    var bio             = req.body.bio;
    var email           = req.body.email;
    var password        = req.body.password;

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'email', 'password', 'bio'],
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                if (email) {
                    if (emailValidator.validate(email)) {
                        user.update({
                            email: (email ? email : user.email)
                        })
                    } else {
                        return res.status(401).json({message : `L'adresse e-mail saisie est invalide. Veuillez entrer une adresse e-mail valide.`}); 
                    }
                } else if (password) {
                    if (schemaPassword.validate(password)) {
                        bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                            user.update({
                                password: (password ? bcryptedPassword : user.password)
                            })
                        })
                    } else {
                        return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`}); 
                    }
                } else if (bio) {
                    user.update({
                        bio: (bio ? bio : user.bio),
                    })
                }
                return res.status(201).json({message: `Le profil a été mis à jour avec succès`, user});
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à modifier ce profil`})
    }
};

exports.updateUsername = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;
    var username        = req.body.username;

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'username'],
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                User.findOne({
                    where: {username: username}
                })
                .then(function(userAlreadyExists){
                    if (!userAlreadyExists) {
                        user.update({
                            username: (username ? username : user.username ),
                        })
                        return res.status(201).json({message: 'Profile has been updated', user});
                    } else {
                        return res.status(500).json({message: `Le pseudo choisi existe déjà. Merci d'en choisir un autre.`});
                    }
                })
                .catch(function(err){
                    return res.status(500).json({message: err});
                });
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à accéder à ce profil`})
    }
};


// Delete User profile
exports.deleteUserProfile = (req, res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                user.destroy()
                return res.status(200).json({message: `Le compte a été supprimé avec succès.`})
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a été trouvé`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à accéder à ce profil`})
    }
};
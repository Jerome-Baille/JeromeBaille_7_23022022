// Imports
const jwt               = require('jsonwebtoken'); // Authentification system
const bcrypt            = require('bcrypt'); // Encrypts the password sent to the database
const passwordValidator = require('password-validator'); // A library to simplify the rules of password validation, by taking away all the repeated parts and by providing a readable and maintainable API to use
const emailValidator    = require("email-validator"); // Makes sure that the email address is valid
const fs                = require('fs');

// Models
const { User, Post, Comment, Like }          = require('../models');

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

                                User.create({
                                    email       : email,
                                    username    : username,
                                    password    : bcryptedPassword,
                                    bio         : bio,
                                    avatar      : null,
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
            { expiresIn: '14d' }
            );
            return res
                .cookie('jwt', token /*, {httpOnly: true}*/)
                .status(200)
                .json({
                    message: 'Vous êtes connecté',
                    'userId': userFound.id,
                    'isAdmin': userFound.isAdmin,
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
    var userId          = req.params.id;
    var isAdmin         = req.body.isAdmin;

    if (tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'isAdmin'],
            where: {id: userId}
        })
        .then(function(user){
            if (user){
                user.update({
                    isAdmin: (isAdmin ? isAdmin : user.isAdmin)
                    // isAdmin: true,
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
    var userId          = req.params.id;
    var isAdmin         = req.body.isAdmin;

    if (tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'isAdmin'],
            where: {id: userId}
        })
        .then(function(user){
            if (user){
                user.update({
                    isAdmin: (!isAdmin ? isAdmin : user.isAdmin)
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
    var paramId         = req.params.id;

    User.findOne({
        attributes: ['id', 'email', 'username', 'bio', 'avatar', 'isAdmin', 'createdAt'],
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
};

// Update user profile (bio, email, avatar)
exports.updateUserProfile = (req, res, next) => {
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;
    var username        = req.body.username;
    var email           = req.body.email;


    // Validators 
    if (email && !emailValidator.validate(email)){
        return res.status(400).json({message: `L'adresse email est invalide`});
    } 

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            where: {id: paramId}
            })
            .then(function(userFound){
                if (req.file){
                    if(userFound.avatar != null){
                        const image = userFound.avatar.split("/images/")[1];
                        fs.unlink(`images/${image}`, () => {
                            const userObject = {
                                ...req.body,
                                avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                            }
                            User.update(
                                { ...userObject },
                                { where: { id: paramId} }
                            )
                                .then(() => res.status(200).json({ message : `L'utilisateur a été modifié avec succès !` }))
                                .catch((err) => {
                                    if (err.errors[0].validatorKey == `not_unique`){
                                        return res.status(500).json({ message: `Le pseudo choisi existe déjà. Merci d'en choisir un autre.` });
                                    } else {
                                        return res.status(400).json({ message: `Une erreur s'est produite, veuillez rééssayer ultérieurement.` });
                                    }
                                })
                        });
                    } else {
                        const userObject = {
                            ...req.body,
                            avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                        }
                        User.update(
                            { ...userObject },
                            { where: { id: paramId} }
                        )
                            .then(() => res.status(200).json({ message : `L'utilisateur a été modifié avec succès !` }))
                            .catch((err) => {
                                if (err.errors[0].validatorKey == `not_unique`){
                                    return res.status(500).json({ message: `Le pseudo choisi existe déjà. Merci d'en choisir un autre.` });
                                } else {
                                    return res.status(400).json({ message: `Une erreur s'est produite, veuillez rééssayer ultérieurement.` });
                                }
                            })
                    } 
                } else {
                    const userObject = {
                        ...req.body,
                    }
                    User.update(
                        { ...userObject },
                        { where: { id: paramId} }
                    )
                        .then(() => res.status(200).json({ message : `L'utilisateur a été modifié avec succès !` }))
                        .catch((err) => {
                            if (err.errors[0].validatorKey == `not_unique`){
                                return res.status(500).json({ message: `Le pseudo choisi existe déjà. Merci d'en choisir un autre.` });
                            } else {
                                return res.status(400).json({ message: `Une erreur s'est produite, veuillez rééssayer ultérieurement.` });
                            }
                        })    
                }                    
            })
            .catch(function(err) {
            return res.status(500).json ({ message : `Une erreur s'est produite, veuillez rééssayer ultérieurement.` })
            });
    } else {
        return res.status(403).json({message: `Vous n'êtes pas autorisé à effectuer cette action.`})
    }

};

exports.updatePassword = (req, res, next) => {
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;
    var paramId         = req.params.id;
    var password        = req.body.password;

    if (tokenUserId == paramId || tokenIsAdmin == true){
        User.findOne({
            attributes: ['id', 'email', 'password', 'bio'],
            where: {id: paramId}
        })
        .then(function(user){
            if (user){
                if (schemaPassword.validate(password)) {
                    bcrypt.hash(password, 5, function(err, bcryptedPassword) {
                        user.update({
                            password: (password ? bcryptedPassword : user.password)
                        })
                    })
                    return res.status(201).json({message: `Le mot de passe a été mis à jour avec succès`, user});
                } else {
                    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caractères et être composé d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`});
                }
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
                if(user.avatar){
                    const filename = user.avatar.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        user.destroy()
                        return res
                            .clearCookie("jwt", {domain: 'localhost', path: '/'})
                            .status(200)
                            .json({message: `Le compte a été supprimé avec succès.`})
                    })
                } else {
                    user.destroy()
                    return res
                        .clearCookie("jwt", {domain: 'localhost', path: '/'})
                        .status(200)
                        .json({message: `Le compte a été supprimé avec succès.`})
                }
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


// Check if the user is authenticated
exports.isAuth = (req,res, next) => {
    // Params
    var tokenUserId     = req.auth.userId;
    var tokenIsAdmin    = req.auth.isAdmin;

    if (tokenUserId) {
        var isAuth = {
            userId: tokenUserId,
            isAdmin: tokenIsAdmin
        }
        return res.status(200).json(isAuth)
    } 
};

// Delete profile picture
exports.deleteProfilePicture = (req, res, next) => {
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
                if(user.avatar){
                    const filename = user.avatar.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        user.update({
                            avatar: null
                        })
                        return res.status(200).json({message: `L'image a été supprimée avec succès.`})
                    })
                } else {
                    return res.status(200).json({message: `Aucune image n'a été trouvée.`})
                }
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
}

// Get all the posts from one user
exports.getUserPosts = (req, res, next) => {
    // Params
    var paramId         = req.params.id;

    Post.findAll({
        where: {userId: paramId},
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']},
            {model: Comment, include: {model: User, attributes: ['id', 'username', 'bio', 'isAdmin']}},
            {model: Like, include: [{model: User, attributes: ['id', 'username', 'isAdmin']}]}
        ],
    })
    .then(function(posts){
        if (posts){
            return res.status(200).json(posts)
        } else {
            res.status(404).json({message: `Aucun post n'a été trouvé`})
        }
    })
    .catch(function(err){
        res.status(500).json({message: err});
    });
}
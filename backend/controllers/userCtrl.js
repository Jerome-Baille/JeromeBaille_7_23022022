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
                                    return res.status(500).json({message: `Cr??ation du compte impossible. Veuillez r????ssayer.`});
                                });
                            });
                        } else {
                            return res.status(409).json({message: `L'adresse e-mail est d??j?? utilis??e`});
                        }
                    })
                    .catch(function(err){
                        return res.status(500).json({message: err});
                    });
                } else {
                    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caract??res et ??tre compos?? d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`}); 
                }
            } else {
                return res.status(401).json({message : `L'adresse e-mail saisie est invalide. Veuillez entrer une adresse e-mail valide.`}); 
            }
        } else {
            return res.status(500).json({message: `Le pseudo choisi existe d??j??. Merci d'en choisir un autre.`});
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
            return res.status(401).json({message: `Nous n'avons pas trouv?? de compte correspondant ?? l'adresse e-mail renseign??e.`});
        }
        bcrypt.compare(password, userFound.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({message : `Le mot de passe renseign?? est incorrect.` });
          }
          const accessToken = jwt.sign({
                userId: userFound.id,
                isAdmin: userFound.isAdmin
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: '30s' }
            );

          const refreshToken = jwt.sign({
                userId: userFound.id,
                isAdmin: userFound.isAdmin
            },
            process.env.REFRESH_TOKEN,
            { expiresIn: '30d' }
            );

            return res
                .cookie('accessToken', accessToken /*, {httpOnly: true}*/)
                .cookie('refreshToken', refreshToken)
                .status(200)
                .json({
                    message: 'Vous ??tes connect??',
                    'userId': userFound.id,
                    'isAdmin': userFound.isAdmin,
                    'accessToken': accessToken
                })
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(function(err){
        return res.status(500).json({message: err});
    });
};

// Generate a new access token with a refresh token
exports.refreshToken = (req, res, next) => {
    // Params
    const refreshToken = req.cookies.refreshToken;  // The refresh token sent by the client

    if (refreshToken == null) {
        return res.status(400).json({message: `Veuillez renseigner le champ 'refreshToken'`});
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, function(err, decoded) {
        if (err) {
            return res.status(401).json({message: `Le token de r??actualisation est invalide.`});
        }
        const accessToken = jwt.sign({
            userId: decoded.userId,
            isAdmin: decoded.isAdmin
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '30s' }
        );

        return res
            .cookie('accessToken', accessToken)
            .status(200)
            .json({
                message: 'Vous ??tes connect??',
                'userId': decoded.userId,
                'isAdmin': decoded.isAdmin,
                'accessToken': accessToken
            })
    });
};

// Logout
exports.logout = (req, res, next) => {
    return res
        .clearCookie("accessToken", {domain: 'localhost', path: '/'})
        .clearCookie("refreshToken", {domain: 'localhost', path: '/'})
        .status(200)
        .json({message : `Compte d??connect?? avec succ??s`});
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
                return res.status(200).json({message: `L'utilisateur dispose ?? pr??sent des droits administrateurs.`})
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? effectuer cette action.`})
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
                return res.status(200).json({message: `Les droits administrateurs ont ??t?? retir?? ?? l'utilisateur.`})
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? effectuer cette action.`})
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
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? effectuer cette action.`})
    }
};

// Read user profile
exports.getOneUser = (req, res, next) => {
    // Params
    var paramId         = req.params.id;

    User.findOne({
        attributes: ['id', 'email', 'username', 'bio', 'avatar', 'isAdmin', 'createdAt'],
        where: {id: paramId},
        include: [{model: Post}]
    })
    .then(function(user){
        if (user){
            return res.status(201).json(user); 
        } else {
            res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
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
                                .then(() => res.status(200).json({ message : `L'utilisateur a ??t?? modifi?? avec succ??s !`, userFound }))
                                .catch((err) => {
                                    if (err.errors[0].validatorKey == `not_unique`){
                                        return res.status(500).json({ message: `Le pseudo choisi existe d??j??. Merci d'en choisir un autre.` });
                                    } else {
                                        return res.status(400).json({ message: `Une erreur s'est produite, veuillez r????ssayer ult??rieurement.` });
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
                            .then(() => res.status(200).json({ message : `L'utilisateur a ??t?? modifi?? avec succ??s !`, userFound }))
                            .catch((err) => {
                                if (err.errors[0].validatorKey == `not_unique`){
                                    return res.status(500).json({ message: `Le pseudo choisi existe d??j??. Merci d'en choisir un autre.` });
                                } else {
                                    return res.status(400).json({ message: `Une erreur s'est produite, veuillez r????ssayer ult??rieurement.` });
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
                        .then(() => res.status(200).json({ message : `L'utilisateur a ??t?? modifi?? avec succ??s !`, userFound }))
                        .catch((err) => {
                            if (err.errors[0].validatorKey == `not_unique`){
                                return res.status(500).json({ message: `Le pseudo choisi existe d??j??. Merci d'en choisir un autre.` });
                            } else {
                                return res.status(400).json({ message: `Une erreur s'est produite, veuillez r????ssayer ult??rieurement.` });
                            }
                        })    
                }                    
            })
            .catch(function(err) {
            return res.status(500).json ({ message : `Une erreur s'est produite, veuillez r????ssayer ult??rieurement.` })
            });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? effectuer cette action.`})
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
                    return res.status(200).json({message: `Le mot de passe a ??t?? mis ?? jour avec succ??s`});
                } else {
                    return res.status(401).json({message : `Le mot de passe doit contenir au moins 8 caract??res et ??tre compos?? d'au moins 1 majuscule, 1 minuscule et 1 chiffre.`});
                }
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? modifier ce profil`})
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

                        // check if the user liked any posts
                        Like.findAll({
                            where: {userId: paramId}
                        })
                        .then(function(likes){
                            // for each likes/dislikes of the user, we remove/add the corresponding amount of point to the post
                            likes.forEach(function(like){
                                if(like.isLiked){
                                    Post.findOne({
                                        where: {id: like.PostId}
                                    })
                                    .then((postFound) =>{
                                        postFound.update({
                                            points: postFound.points - 1
                                        })
                                    })
                                    .catch((err) =>{
                                        console.log(err)
                                    })
                                } else {
                                    Post.findOne({
                                        where: {id: like.PostId}
                                    })
                                    .then((postFound) => {
                                        postFound.update({
                                            points: postFound.points + 1
                                        })
                                    })
                                    .catch(function(err){
                                        console.log(err)
                                    })
                                }
                            })
                        })
                        .then(() => {
                            user.destroy()
                            return res
                                .status(200)
                                .json({message: `Le compte a ??t?? supprim?? avec succ??s.`})
                        })
                        .catch(function(err){
                            console.log(err)
                        })
                    })
                } else {
                    // check if the user liked any posts
                    Like.findAll({
                        where: {userId: paramId}
                    })
                    .then(function(likes){
                        // for each likes/dislikes of the user, we remove/add the corresponding amount of point to the post
                        likes.forEach(function(like){
                            if(like.isLiked){
                                Post.findOne({
                                    where: {id: like.PostId}
                                })
                                .then((postFound) => {
                                    postFound.update({
                                        points: postFound.points - 1
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            } else {
                                Post.findOne({
                                    where: {id: like.PostId}
                                })
                                .then((postFound) =>{
                                    postFound.update({
                                        points: postFound.points + 1
                                    })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            }
                        })
                    })
                    .then(() => {
                        user.destroy()
                        return res
                            .clearCookie("jwt", {domain: 'localhost', path: '/'})
                            .status(200)
                            .json({message: `Le compte a ??t?? supprim?? avec succ??s.`})
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? acc??der ?? ce profil`})
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
                        return res.status(200).json({message: `L'image a ??t?? supprim??e avec succ??s.`})
                    })
                } else {
                    return res.status(200).json({message: `Aucune image n'a ??t?? trouv??e.`})
                }
            } else {
                res.status(404).json({message: `Aucun utilisateur n'a ??t?? trouv??`})
            }
        })
        .catch(function(err){
            res.status(500).json({message: err});
        });
    } else {
        return res.status(403).json({message: `Vous n'??tes pas autoris?? ?? acc??der ?? ce profil`})
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
            res.status(404).json({message: `Aucun post n'a ??t?? trouv??`})
        }
    })
    .catch(function(err){
        res.status(500).json({message: err});
    });
}
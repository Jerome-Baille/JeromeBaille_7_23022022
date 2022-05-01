const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(403).json({'error': `Token d'authentification non trouvé`});
  }
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    req.auth = { userId, isAdmin };  
    if (req.body.userId && req.body.userId !== userId) {
      throw `L'ID de l'utilisateur n'est pas conforme`;
    } else {
      return next();
    }
  } catch {
    res.status(418).json({
      error: new Error(`Le token a expiré`)
    });
  }
};
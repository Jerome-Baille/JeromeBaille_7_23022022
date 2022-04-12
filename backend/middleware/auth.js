const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(403).json({'error': `Token d'authentification non trouvé`});
  }
  try {
    // const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    const isAdmin = decodedToken.isAdmin;
    req.auth = { userId, isAdmin };  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      return next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
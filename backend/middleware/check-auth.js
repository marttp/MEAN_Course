const jwt = require('jsonwebtoken');



module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    // pass token its get from header and send it to verify with secret
    const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
    // add new field on the body
    // because the middleware is executing fist. they can add a new field
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    });
  }
};

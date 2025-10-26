const jwt = require('jsonwebtoken');

// This function will be our route protector
module.exports = function (req, res, next) {
  // Get the token from the http-only cookie
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user payload (id, email) to the request object
    req.user = decoded.user;
    next(); // Move on to the next function (the route handler)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
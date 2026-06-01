const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Get the token from the request header (Authorization: Bearer <token>)
  const authHeader = req.header('Authorization');

  // 2. Check if no token is provided
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 3. Extract the token (removing "Bearer " if present)
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  // 4. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach the decoded user payload to the request object
    req.user = decoded.user;
    
    // 6. Move to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

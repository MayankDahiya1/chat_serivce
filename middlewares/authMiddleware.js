/*
 * IMPORTS
 */
import jwt from 'jsonwebtoken';

/*
 * VERIFY TOKEN UTILITY
 */
const verifyToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    _AuthLog('Token verification failed: %s', err.message);
    return null;
  }
};

/*
 * EXPRESS MIDDLEWARE
 */
const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    _AuthLog('No token provided for request: %s %s', req.method, req.path);
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Authentication token required',
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    _AuthLog('Invalid token provided for request: %s %s', req.method, req.path);
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Invalid or expired authentication token',
    });
  }

  // Validate token payload structure
  if (!decoded.id || typeof decoded.id !== 'string') {
    _AuthLog('Invalid token payload structure');
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Invalid authentication token format',
    });
  }

  _AuthLog('User authenticated: %s for %s %s', decoded.id, req.method, req.path);
  req.user = decoded;
  next();
};

/*
 * EXPORTS
 */
export default AuthMiddleware;

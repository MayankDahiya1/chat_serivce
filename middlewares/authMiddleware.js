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
    return null;
  }
};

/*
 * EXPRESS MIDDLEWARE
 */
const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ status: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

/*
 * EXPORTS
 */
export default AuthMiddleware;

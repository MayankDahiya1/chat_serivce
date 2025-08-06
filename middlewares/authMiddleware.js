/*
* IMPORTS
*/
import jwt from "jsonwebtoken"; // NPM: Token verification for security measures


/*
* FUNCTION
*/
const _AuthMiddleware = (req, res, next) => {
    // Getting header
    const _AuthHeader = req.headers.authorization;

    // If auth headers is not there
    if (!_AuthHeader) return res.status(401).json({ 'status': 'NO_TOKEN_FOUND', 'message': 'No token found' });

    // Getting token from auth header
    const _Token = _AuthHeader.split(" ")[1];

    // Verifying token through jwt
    jwt.verify(_Token, process.env.JWT_SECRET, (err, decoded) => {
        // If error persists
        if (err) return res.status(401).json({ 'status': 'TOKEN_EXPIRED', 'message': 'Token is expired' });

        // decoded payload ka access har route me
        req.user = decoded;

        next();
    });
};


/*
* EXPORTS
*/
export default _AuthMiddleware;

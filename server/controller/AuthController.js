

const jwt = require('jsonwebtoken');



const isAuthenticated = (req, res, next) => {
   const token = req.cookies.token;
    if (!token) {
         return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        
        // Handle specific token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token has expired. Please login again.',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token.',
                code: 'INVALID_TOKEN'
            });
        }
        
        return res.status(401).json({ 
            message: 'Authentication failed.',
            code: 'AUTH_FAILED'
        });
    }
}

module.exports = isAuthenticated;



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
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = isAuthenticated;

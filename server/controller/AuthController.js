const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    // Check token from cookie OR Authorization header
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user info to request
        req.user = decoded;

        next(); // Proceed
    } catch (error) {
        console.error('Token verification failed:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }

        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = isAuthenticated;

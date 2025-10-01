const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAuthToken = (user) => {
    // Payload with only necessary fields
    const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user'   // Optional: add role for authorization
    };

    // Expiry can be configured in .env (default 1h)
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
        algorithm: 'HS256'  // Explicit algorithm for security
    });

    return { 
        token, 
        expiresIn 
    };
};

module.exports = generateAuthToken;

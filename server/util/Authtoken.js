const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { 
            expiresIn: '1h', // Helps prevent CSRF attacks   
    });
    return token;
}

module.exports = generateAuthToken;

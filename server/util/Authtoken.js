const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1day' // Token expiration time
    });
    return token;
}

module.exports = generateAuthToken;

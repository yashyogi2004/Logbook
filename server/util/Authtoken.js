import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { generateResetToken, verifyResetToken } from "../util/resetToken.js";

const generateAuthToken = (user) => {
    // We generate a token containing the user's ID, username, and email
    const token = jwt.sign(
        { 
            id: user._id, 
            username: user.username, 
            email: user.email 
        }, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: '1h', // Token expiration for security
        }
    );
    return token;
}

// Use export default instead of module.exports
export default generateAuthToken;
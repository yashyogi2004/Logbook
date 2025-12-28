import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { generateResetToken, verifyResetToken } from "../util/resetToken.js";

const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { 
            expiresIn: '1h', // Helps prevent CSRF attacks   
    });
    return token;
}

// Use export default instead of module.exports
export default generateAuthToken;
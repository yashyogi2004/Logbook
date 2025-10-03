const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();
const transporter =require('../controller/transporter');

const sendEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.user,
            to: email,
            subject: "OTP Verification",
            text: `Your OTP is: ${otp}`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;
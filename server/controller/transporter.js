const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.host,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

module.exports = transporter;
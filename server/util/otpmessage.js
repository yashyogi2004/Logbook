import "dotenv/config";
import transporter from "../controller/transporter.js";

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);
  return info;
};

export default sendEmail;
import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateResetToken = (user) => {
  // keep payload minimal
  return jwt.sign(
    { id: user._id, purpose: "password_reset" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const verifyResetToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.purpose !== "password_reset") {
    throw new Error("Invalid token purpose");
  }
  return decoded; // {id, purpose, iat, exp}
};
// utils/payloadUtils.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Generate a JWT payload with user data.
 * @param {Object} user - User object from the database.
 * @returns {Object} - Payload for JWT.
 */
const generatePayload = (user) => {
  return {
    userId: user._id,
    phone: user.phone,
    role: user.Role || "user",
  };
};

/**
 * Generate a JWT token.
 * @param {Object} user - User object from the database.
 * @returns {String} - JWT token.
 */
const generateToken = (user) => {
  const payload = generatePayload(user);
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Token expires in 1 day
  );
};

/**
 * Verify a JWT token.
 * @param {String} token - JWT token from the client.
 * @returns {Object} - Decoded payload.
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generatePayload,
  generateToken,
  verifyToken,
};

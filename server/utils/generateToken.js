const jwt = require('jsonwebtoken');

const generateToken = () => {
  return jwt.sign({}, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = { generateToken };

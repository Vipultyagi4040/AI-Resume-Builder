const jwt = require('jsonwebtoken');

const generateToken = () => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
  if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET not set. Using default secret. Set JWT_SECRET in production!');
  }
  return jwt.sign({}, secret, {
    expiresIn: '7d',
  });
};

module.exports = { generateToken };

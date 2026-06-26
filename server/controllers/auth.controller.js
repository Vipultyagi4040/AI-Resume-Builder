const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const AuthUser = require('../models/AuthUser');
const emailService = require('../services/email.service');
const { generateToken } = require('../utils/generateToken');

const authResponse = (message, user) => {
  return {
    message,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      avatar: user.avatarUrl,
    },
    accessToken: generateToken(),
  };
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const safeName = (name || '').trim();
    const safeEmail = (email || '').trim().toLowerCase();
    const safePassword = password || '';

    if (!safeName) throw new Error('Name is required');
    if (!safeEmail) throw new Error('Email is required');
    if (safePassword.length < 6) throw new Error('Password must be at least 6 characters');

    const existingUser = await AuthUser.findByEmail(safeEmail);
    if (existingUser) throw new Error('Account already exists with this email');

    const passwordHash = await bcrypt.hash(safePassword, 10);

    const user = await AuthUser.create({
      name: safeName,
      email: safeEmail,
      passwordHash,
      provider: 'local',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeEmail}`,
    });

    return res.status(200).json(authResponse('Signup successful', user));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const safeEmail = (email || '').trim().toLowerCase();
    const safePassword = password || '';

    if (!safeEmail || !safePassword) throw new Error('Invalid email or password');

    const user = await AuthUser.findRawByEmail(safeEmail);
    if (!user) throw new Error('Invalid email or password');

    if (user.provider !== 'local') {
      throw new Error('Please continue with Google for this account');
    }

    const isMatch = await bcrypt.compare(safePassword, user.password_hash);
    if (!isMatch) throw new Error('Invalid email or password');

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      provider: user.provider,
      avatarUrl: user.avatar_url,
    };

    return res.status(200).json(authResponse('Login successful', publicUser));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const safeEmail = (email || '').trim().toLowerCase();

    const user = await AuthUser.findRawByEmail(safeEmail);
    if (!user) throw new Error('No account found with this email');

    if (user.provider !== 'local') {
      throw new Error('Google accounts do not support password reset here');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    await AuthUser.updateResetCode(safeEmail, code, expiry);

    try {
      await emailService.sendResetCodeEmail(safeEmail, user.name, code);
    } catch (mailError) {
      throw new Error('Could not send reset email. Check SMTP configuration.');
    }

    const response = {
      message: 'Reset code sent to your email.',
      email: safeEmail,
      debugResetCode: code,
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const safeEmail = (email || '').trim().toLowerCase();
    const safeCode = (code || '').trim();
    const safePassword = newPassword || '';

    if (!safeEmail || !safeCode || !safePassword) throw new Error('All fields are required');
    if (safePassword.length < 6) throw new Error('Password must be at least 6 characters');

    const user = await AuthUser.findRawByEmail(safeEmail);
    if (!user) throw new Error('Account not found');

    if (user.provider !== 'local') {
      throw new Error('Google accounts do not support password reset here');
    }

    if (!user.reset_code || user.reset_code !== safeCode) {
      throw new Error('Invalid reset code');
    }

    if (!user.reset_code_expiry || Date.now() > new Date(user.reset_code_expiry).getTime()) {
      throw new Error('Reset code expired. Request a new one.');
    }

    const passwordHash = await bcrypt.hash(safePassword, 10);
    await AuthUser.update(user.id, {
      password_hash: passwordHash,
    });
    await AuthUser.clearResetCode(user.id);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.google = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new Error('Google token is required');

    const tokenInfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const googleResponse = await require('axios').get(tokenInfoUrl);
    const payload = googleResponse.data;

    const aud = String(payload.aud || '');
    const email = String(payload.email || '').toLowerCase().trim();
    const name = String(payload.name || '').trim();
    const picture = String(payload.picture || '').trim();
    const emailVerified = String(payload.email_verified || '').trim();

    if (emailVerified !== 'true') {
      throw new Error('Google email is not verified');
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (googleClientId && googleClientId !== aud) {
      throw new Error('Google token audience mismatch');
    }

    let user = await AuthUser.findByEmail(email);
    if (user) {
      await AuthUser.update(user.id, {
        provider: 'google',
        name: name || user.name,
        avatar_url: picture || user.avatarUrl,
      });
      user = {
        ...user,
        provider: 'google',
        name: name || user.name,
        avatarUrl: picture || user.avatarUrl,
      };
    } else {
      user = await AuthUser.create({
        name: name || 'Google User',
        email,
        provider: 'google',
        avatarUrl: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      });
    }

    return res.status(200).json(authResponse('Google login successful', user));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@airesumebuilder.com';
  }

  async sendResetCodeEmail(toEmail, name, resetCode) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Mail service is not configured. Set EMAIL_USER and EMAIL_PASS.');
    }

    const displayName = name?.trim() || 'User';
    const subject = 'Your AI Resume password reset code';
    const text = `Hello ${displayName},\n\nWe received a request to reset your password.\nYour reset code is: ${resetCode}\n\nThis code expires in 10 minutes.\nUse this code in the Reset Password screen.\n\nIf you did not request this, please ignore this email.\n\n- AI Resume Builder`;

    await this.transporter.sendMail({
      from: this.fromEmail,
      to: toEmail,
      subject,
      text,
    });
  }
}

module.exports = new EmailService();

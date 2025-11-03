// services/email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Account Verification',
    html: `
      <h2>Verify Your Account</h2>
      <p>Your verification OTP is:</p>
      <h3>${otp}</h3>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendReminderEmail = async (email: string, subject: string, htmlBody: string): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html: htmlBody,
  };

  await transporter.sendMail(mailOptions);
};
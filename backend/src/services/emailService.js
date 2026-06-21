import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      html
    });
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

export const sendOrderConfirmation = async (order) => {
  const html = `
    <h1>Order Confirmation</h1>
    <p>Thank you for your order #${order.id}!</p>
    <p>Total: $${order.total_amount}</p>
    <p>USDT Amount: ${order.crypto_amount} USDT</p>
    <p>Please send payment to: ${order.wallet_address}</p>
  `;
  await sendEmail(order.guest_email || (order.user?.email), `Order #${order.id} Confirmation`, html);
};

export const sendStatusUpdate = async (order, status) => {
  const html = `
    <h1>Order Status Update</h1>
    <p>Your order #${order.id} status has been updated to: ${status}</p>
  `;
  await sendEmail(order.guest_email || (order.user?.email), `Order #${order.id} Status Update`, html);
};

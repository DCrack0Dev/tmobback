import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100);

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later' }
});

export const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { error: 'Too many admin login attempts, please try again later' }
});

export const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many orders, please try again later' }
});

export const generalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later' }
});

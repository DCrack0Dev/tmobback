import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  login
);

router.get('/me', authenticateToken, getMe);

export default router;

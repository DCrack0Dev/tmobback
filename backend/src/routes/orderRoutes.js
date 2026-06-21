import express from 'express';
import { body } from 'express-validator';
import { createOrder, getOrders, getOrder, submitTransactionHash } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/',
  orderLimiter,
  [
    body('items').isArray({ min: 1 }),
    body('shipping_address').isObject(),
    body('guest_email').isEmail(),
    body('guest_name').notEmpty()
  ],
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateToken(req, res, next);
    } else {
      next();
    }
  },
  createOrder
);

router.get('/', authenticateToken, getOrders);
router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    authenticateToken(req, res, next);
  } else {
    next();
  }
}, getOrder);

router.post(
  '/:id/transaction-hash',
  [
    body('transaction_hash').notEmpty()
  ],
  (req, res, next) => {
    if (req.headers.authorization) {
      authenticateToken(req, res, next);
    } else {
      next();
    }
  },
  submitTransactionHash
);

export default router;

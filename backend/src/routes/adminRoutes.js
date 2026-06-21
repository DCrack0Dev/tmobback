import express from 'express';
import { body } from 'express-validator';
import { getStats, getAllOrders, updateOrderStatus, verifyPayment, getCustomers, getCustomerOrders } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticateToken, requireAdmin, getStats);
router.get('/orders', authenticateToken, requireAdmin, getAllOrders);
router.put(
  '/orders/:id/status',
  authenticateToken,
  requireAdmin,
  [
    body('status').isIn(['pending_payment', 'payment_submitted', 'paid', 'shipped', 'delivered', 'cancelled'])
  ],
  updateOrderStatus
);
router.put('/orders/:id/verify-payment', authenticateToken, requireAdmin, verifyPayment);
router.get('/customers', authenticateToken, requireAdmin, getCustomers);
router.get('/customers/:id/orders', authenticateToken, requireAdmin, getCustomerOrders);

export default router;

import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.put('/:productId', authenticateToken, updateCartItem);
router.delete('/:productId', authenticateToken, removeFromCart);

export default router;

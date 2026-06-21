import express from 'express';
import { body } from 'express-validator';
import { getProductReviews, createReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post(
  '/',
  authenticateToken,
  [
    body('rating').isInt({ min: 1, max: 5 })
  ],
  createReview
);

export default router;

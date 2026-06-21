import db from '../config/db.js';
import { validationResult } from 'express-validator';

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await db.query(
      'SELECT r.*, u.name as user_name FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
      [req.params.id]
    );
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, guest_name } = req.body;
    const productId = req.params.id;

    const userId = req.user?.id || null;

    const result = await db.run(
      'INSERT INTO reviews (product_id, user_id, guest_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [productId, userId, guest_name || null, parseInt(rating), comment || null]
    );

    res.status(201).json({ id: result.lastID, product_id: productId, user_id: userId, guest_name, rating, comment });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

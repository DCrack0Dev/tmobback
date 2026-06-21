import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('name').notEmpty(),
    body('brand').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 })
  ],
  createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  [
    body('name').notEmpty(),
    body('brand').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 })
  ],
  updateProduct
);

router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

router.post(
  '/:id/images',
  authenticateToken,
  requireAdmin,
  upload.array('images', 10),
  uploadProductImages
);

export default router;

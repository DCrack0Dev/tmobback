import express from 'express';
import { getCurrencyRates } from '../controllers/currencyController.js';

const router = express.Router();

router.get('/rates', getCurrencyRates);

export default router;

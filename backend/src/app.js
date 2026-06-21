import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { updateUsdtRate, updateCurrencyRates } from './services/exchangeRateService.js';
import { generalLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: [process.env.STOREFRONT_URL, process.env.ADMIN_URL],
  credentials: true
}));
app.use(express.json());
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:id/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Vercel Cron endpoint
app.post('/api/cron/update-rates', async (req, res) => {
  // Verify cron secret if provided
  if (process.env.CRON_SECRET && req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  await updateUsdtRate();
  await updateCurrencyRates();
  res.json({ status: 'Rates updated' });
});

app.use(errorHandler);

// Only run cron in development (Vercel handles cron via vercel.json)
if (process.env.NODE_ENV === 'development') {
  cron.schedule('*/5 * * * *', async () => {
    await updateUsdtRate();
    await updateCurrencyRates();
  });
}

updateUsdtRate();
updateCurrencyRates();

export default app;

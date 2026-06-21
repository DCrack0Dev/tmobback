import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
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

// Temporary seed endpoint (remove after use)
app.get('/api/seed', async (req, res) => {
  try {
    // Read and run schema.sql
    const schemaPath = new URL('../../database/schema.sql', import.meta.url);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }

    // Check if already seeded
    const existingProducts = await db.query('SELECT * FROM products LIMIT 1');
    if (existingProducts.length > 0) {
      return res.json({ message: 'Already seeded' });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['TechNow Admin', 'admin@technowmobile.com', hashedPassword, 'admin']
    );

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro Max', brand: 'Apple', description: 'The most powerful iPhone ever with A17 Pro chip', price: 1199.99, stock: 50, images: JSON.stringify(['https://images.unsplash.com/photo-1592275342103-c966f3c9a834?w=400']), specifications: JSON.stringify({
          display: '6.7" Super Retina XDR',
          chip: 'A17 Pro',
          storage: '256GB',
          camera: '48MP Pro camera system'
        }), is_featured: 1 },
      {
        name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', description: 'Galaxy AI is here. The ultimate Galaxy experience', price: 1299.99, stock: 45, images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff03220?w=400']), specifications: JSON.stringify({
          display: '6.8" Dynamic AMOLED 2X',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '200MP Pro camera system'
        }), is_featured: 1 },
      {
        name: 'Google Pixel 8 Pro', brand: 'Google', description: 'The best of Google, powered by Google AI', price: 999.99, stock: 35, images: JSON.stringify(['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400']), specifications: JSON.stringify({
          display: '6.7" Google Tensor G3',
          chip: 'Tensor G3',
          storage: '256GB',
          camera: '50MP Pro camera system'
        }), is_featured: 0 },
      {
        name: 'iPhone 15', brand: 'Apple', description: 'All new dynamic Island. A magical way to interact.', price: 799.99, stock: 60, images: JSON.stringify(['https://images.unsplash.com/photo-1592275342103-c966f3c9a834?w=400']), specifications: JSON.stringify({
          display: '6.1" Super Retina XDR',
          chip: 'A16 Bionic',
          storage: '128GB',
          camera: '48MP Main camera'
        }), is_featured: 0 },
      {
        name: 'Samsung Galaxy S24', brand: 'Samsung', description: 'Galaxy AI is here. Epic photos. Epic power.', price: 799.99, stock: 55, images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff03220?w=400']), specifications: JSON.stringify({
          display: '6.2" Dynamic AMOLED 2X',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '50MP camera system'
        }), is_featured: 0 },
      {
        name: 'OnePlus 12', brand: 'OnePlus', description: 'Never Settle. Flagship killer returns', price: 799.99, stock: 40, images: JSON.stringify(['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400']), specifications: JSON.stringify({
          display: '6.82" 2K AMOLED',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '50MP Triple camera'
        }), is_featured: 0 }
    ];

    for (const product of products) {
      await db.run(
        'INSERT INTO products (name, brand, description, price, stock, images, specifications, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.brand, product.description, product.price, product.stock, product.images, product.specifications, product.is_featured]
      );
    }

    res.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
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

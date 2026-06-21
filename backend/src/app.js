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
  res.json({ 
    status: 'ok',
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT
  });
});

// Temporary seed endpoint (remove after use)
app.get('/api/seed', async (req, res) => {
  try {
    // Hardcoded schema to avoid path issues
    const schema = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT,
  specifications TEXT,
  is_featured TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_name ON products(name);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER,
  guest_email VARCHAR(255),
  guest_name VARCHAR(255),
  guest_phone VARCHAR(20),
  total_amount DECIMAL(10,2) NOT NULL,
  crypto_amount DECIMAL(10,8) NOT NULL,
  exchange_rate_used DECIMAL(10,8) NOT NULL,
  wallet_address VARCHAR(255) NOT NULL,
  transaction_hash VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER,
  guest_name VARCHAR(255),
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS carts (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  admin_user_id INTEGER NOT NULL,
  action VARCHAR(255) NOT NULL,
  order_id INTEGER,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);`;
    
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

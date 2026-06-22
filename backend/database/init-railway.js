import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDatabase = async () => {
  try {
    console.log('Connecting to MySQL database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });
    console.log('Connected!');

    // 1. Run schema.sql
    console.log('Creating tables...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schema);
    console.log('Tables created!');

    // 2. Seed data
    console.log('Seeding data...');

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['TechNow Admin', 'admin@technowmobile.com', hashedPassword, 'admin']
    );

    // Create sample products
    const products = [
      {
        name: 'iPhone 15 Pro Max', brand: 'Apple', description: 'The most powerful iPhone ever with A17 Pro chip', price: 1199.99, stock: 50, images: JSON.stringify(['https://images.unsplash.com/photo-1592275342103-c966f3c9a834?w=400']), specifications: JSON.stringify({
          display: '6.7\" Super Retina XDR',
          chip: 'A17 Pro',
          storage: '256GB',
          camera: '48MP Pro camera system'
        }), is_featured: 1 },
      {
        name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', description: 'Galaxy AI is here. The ultimate Galaxy experience', price: 1299.99, stock: 45, images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff03220?w=400']), specifications: JSON.stringify({
          display: '6.8\" Dynamic AMOLED 2X',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '200MP Pro camera system'
        }), is_featured: 1 },
      {
        name: 'Google Pixel 8 Pro', brand: 'Google', description: 'The best of Google, powered by Google AI', price: 999.99, stock: 35, images: JSON.stringify(['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400']), specifications: JSON.stringify({
          display: '6.7\" Google Tensor G3',
          chip: 'Tensor G3',
          storage: '256GB',
          camera: '50MP Pro camera system'
        }), is_featured: 0 },
      {
        name: 'iPhone 15', brand: 'Apple', description: 'All new dynamic Island. A magical way to interact.', price: 799.99, stock: 60, images: JSON.stringify(['https://images.unsplash.com/photo-1592275342103-c966f3c9a834?w=400']), specifications: JSON.stringify({
          display: '6.1\" Super Retina XDR',
          chip: 'A16 Bionic',
          storage: '128GB',
          camera: '48MP Main camera'
        }), is_featured: 0 },
      {
        name: 'Samsung Galaxy S24', brand: 'Samsung', description: 'Galaxy AI is here. Epic photos. Epic power.', price: 799.99, stock: 55, images: JSON.stringify(['https://images.unsplash.com/photo-1511707171634-5f897ff03220?w=400']), specifications: JSON.stringify({
          display: '6.2\" Dynamic AMOLED 2X',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '50MP camera system'
        }), is_featured: 0 },
      {
        name: 'OnePlus 12', brand: 'OnePlus', description: 'Never Settle. Flagship killer returns', price: 799.99, stock: 40, images: JSON.stringify(['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400']), specifications: JSON.stringify({
          display: '6.82\" 2K AMOLED',
          chip: 'Snapdragon 8 Gen 3',
          storage: '256GB',
          camera: '50MP Triple camera'
        }), is_featured: 0 }
    ];

    for (const product of products) {
      await connection.execute(
        'INSERT INTO products (name, brand, description, price, stock, images, specifications, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.brand, product.description, product.price, product.stock, product.images, product.specifications, product.is_featured]
      );
    }

    console.log('Data seeded successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
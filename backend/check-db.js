import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'database/technow_mobile.db');

const db = new sqlite3.Database(dbPath);

console.log('Checking products in database...');
db.all('SELECT * FROM products LIMIT 5', (err, products) => {
  if (err) {
    console.error('Error querying products:', err);
  } else {
    console.log('Number of products:', products.length);
    console.log('Products:', products);
  }
  db.close();
});

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'technow_mobile.db');
const schemaPath = join(__dirname, 'schema.sql');

// Delete existing DB if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Old database deleted');
}

const db = new sqlite3.Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
  console.log('Database and tables created successfully!');
  db.close();
});

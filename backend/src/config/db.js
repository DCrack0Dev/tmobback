import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let query, run, db;

if (process.env.DB_HOST) {
  // MySQL mode (production)
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log('Connected to MySQL database');

  query = async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  };

  run = async (sql, params = []) => {
    const [result] = await pool.execute(sql, params);
    return { lastID: result.insertId, changes: result.affectedRows };
  };

  db = pool;
} else {
  // SQLite mode (local development)
  const dbPath = join(__dirname, '../../database/technow_mobile.db');

  const sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });

  query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  };

  run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  };

  db = sqliteDb;
}

export default { query, run, db };

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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
  // We'll handle this in a way that doesn't require sqlite3 at import time
  // but for now, let's just throw an error if MySQL isn't configured
  throw new Error('Please configure MySQL database connection (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)');
}

export default { query, run, db };

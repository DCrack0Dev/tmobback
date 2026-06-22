import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let query, run, db;

let pool;
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.MYSQL_PUBLIC_URL ||
  process.env.MYSQL_URL;

if (databaseUrl) {
  // Using full connection URL
  pool = mysql.createPool({
    uri: databaseUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: false // Required for Railway's public endpoint
    }
  });
  console.log('Connected to MySQL database via URL');
} else if (process.env.DB_HOST) {
  // MySQL mode (production)
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
      rejectUnauthorized: false // Required for Railway's public endpoint
    }
  });
  console.log('Connected to MySQL database');
} else {
  // SQLite mode (local development)
  // We'll handle this in a way that doesn't require sqlite3 at import time
  // but for now, let's just throw an error if MySQL isn't configured
  throw new Error('Please configure MySQL database connection (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)');
}

// Define functions for either case
query = async (sql, params = []) => {
  console.log('Executing query:', sql, 'with params:', params);
  const [rows] = await pool.query(sql, params);
  return rows;
};

run = async (sql, params = []) => {
  console.log('Executing run:', sql, 'with params:', params);
  const [result] = await pool.query(sql, params);
  return { lastID: result.insertId, changes: result.affectedRows };
};

db = pool;

export default { query, run, db };

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    const schemaSQL = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schemaSQL);
    console.log('Database schema created successfully');
  } catch (err) {
    console.error('Error creating database schema:', err);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
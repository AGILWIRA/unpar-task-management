import { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Account not activated. Please contact administrator.' 
      });
    }

    // Always return "Account not activated" message for security
    return res.status(401).json({ 
      error: 'Account not activated. Please contact administrator.' 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
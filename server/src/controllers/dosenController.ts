import { Request, Response } from 'express';
import pool from '../config/database';
import bcrypt from 'bcrypt';

export const createDosen = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { email, password, nip, nama_lengkap, departemen } = req.body;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user account
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, passwordHash, 'dosen']
    );
    
    // Create dosen profile
    await client.query(
      'INSERT INTO dosen_profiles (user_id, nip, nama_lengkap, departemen) VALUES ($1, $2, $3, $4)',
      [userResult.rows[0].id, nip, nama_lengkap, departemen]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({ message: 'Dosen account created successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating dosen:', error);
    res.status(500).json({ error: 'Failed to create dosen account' });
  } finally {
    client.release();
  }
};

export const getAllDosen = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT u.email, dp.nip, dp.nama_lengkap, dp.departemen, dp.is_active 
      FROM users u 
      JOIN dosen_profiles dp ON u.id = dp.user_id 
      WHERE u.role = 'dosen'
      ORDER BY dp.nama_lengkap ASC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching dosen:', error);
    res.status(500).json({ error: 'Failed to fetch dosen list' });
  }
};

export const updateDosen = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { nama_lengkap, departemen, is_active } = req.body;
    
    await client.query(
      'UPDATE dosen_profiles SET nama_lengkap = $1, departemen = $2, is_active = $3 WHERE user_id = $4',
      [nama_lengkap, departemen, is_active, id]
    );
    
    await client.query('COMMIT');
    
    res.json({ message: 'Dosen updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating dosen:', error);
    res.status(500).json({ error: 'Failed to update dosen' });
  } finally {
    client.release();
  }
};
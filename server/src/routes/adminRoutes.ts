import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const router = express.Router();

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'unpar_task_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Middleware untuk verifikasi admin (sesuaikan dengan auth system Anda)
const verifyAdmin = (req: Request, res: Response, next: Function) => {
  // TODO: Implementasi JWT verification
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Verify JWT dan check role = 'admin'
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
  next();
};

// ==================== MAHASISWA ROUTES ====================

// POST /api/admin/mahasiswa - Create new mahasiswa account
router.post('/mahasiswa', verifyAdmin, async (req: Request, res: Response) => {
  const { email, nim, nama_lengkap, angkatan } = req.body;

  // Validasi input
  if (!email || !nim || !nama_lengkap || !angkatan) {
    return res.status(400).json({ 
      message: 'Semua field wajib diisi' 
    });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Format email tidak valid' 
    });
  }

  // Validasi NIM (10 digit)
  if (!/^\d{10}$/.test(nim)) {
    return res.status(400).json({ 
      message: 'NIM harus 10 digit angka' 
    });
  }

  // Validasi angkatan
  if (!/^20\d{2}$/.test(angkatan)) {
    return res.status(400).json({ 
      message: 'Format angkatan tidak valid (contoh: 2023)' 
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check apakah email sudah terdaftar
    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        message: 'Email sudah terdaftar' 
      });
    }

    // Check apakah NIM sudah terdaftar
    const nimCheck = await client.query(
      'SELECT id FROM mahasiswa_profiles WHERE nim = $1',
      [nim]
    );

    if (nimCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        message: 'NIM sudah terdaftar' 
      });
    }

    // Generate default password (NIM)
    const defaultPassword = nim;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Insert ke table users
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [email, hashedPassword, 'mahasiswa']
    );

    const userId = userResult.rows[0].id;

    // Insert ke table mahasiswa_profiles
    const mahasiswaResult = await client.query(
      `INSERT INTO mahasiswa_profiles (user_id, nim, nama_lengkap, angkatan, is_active) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, nim, nama_lengkap, angkatan, true]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Akun mahasiswa berhasil dibuat',
      data: {
        id: mahasiswaResult.rows[0].id,
        email,
        nim,
        nama_lengkap,
        angkatan,
        default_password: defaultPassword
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating mahasiswa:', error);
    res.status(500).json({ 
      message: 'Gagal membuat akun mahasiswa',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
});

// GET /api/admin/mahasiswa - Get all mahasiswa
router.get('/mahasiswa', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        m.id, 
        m.nim, 
        m.nama_lengkap, 
        m.angkatan, 
        m.is_active,
        u.email, 
        m.created_at
       FROM mahasiswa_profiles m
       JOIN users u ON m.user_id = u.id
       ORDER BY m.angkatan DESC, m.nama_lengkap ASC`
    );

    res.json({
      message: 'Success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data mahasiswa' 
    });
  }
});

// GET /api/admin/mahasiswa/:id - Get mahasiswa by ID
router.get('/mahasiswa/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        m.id, 
        m.nim, 
        m.nama_lengkap, 
        m.angkatan, 
        m.is_active,
        u.email, 
        m.created_at
       FROM mahasiswa_profiles m
       JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Mahasiswa tidak ditemukan' 
      });
    }

    res.json({
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching mahasiswa:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data mahasiswa' 
    });
  }
});

// PUT /api/admin/mahasiswa/:id - Update mahasiswa
router.put('/mahasiswa/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, nim, nama_lengkap, angkatan, is_active } = req.body;

  if (!email || !nim || !nama_lengkap || !angkatan) {
    return res.status(400).json({ 
      message: 'Semua field wajib diisi' 
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get user_id
    const mahasiswaCheck = await client.query(
      'SELECT user_id FROM mahasiswa_profiles WHERE id = $1',
      [id]
    );

    if (mahasiswaCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        message: 'Mahasiswa tidak ditemukan' 
      });
    }

    const userId = mahasiswaCheck.rows[0].user_id;

    // Update users table
    await client.query(
      'UPDATE users SET email = $1 WHERE id = $2',
      [email, userId]
    );

    // Update mahasiswa_profiles table
    await client.query(
      `UPDATE mahasiswa_profiles 
       SET nim = $1, nama_lengkap = $2, angkatan = $3, is_active = $4
       WHERE id = $5`,
      [nim, nama_lengkap, angkatan, is_active ?? true, id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Data mahasiswa berhasil diupdate',
      data: { id, email, nim, nama_lengkap, angkatan, is_active }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating mahasiswa:', error);
    res.status(500).json({ 
      message: 'Gagal mengupdate data mahasiswa' 
    });
  } finally {
    client.release();
  }
});

// DELETE /api/admin/mahasiswa/:id - Delete mahasiswa
router.delete('/mahasiswa/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get user_id
    const mahasiswaCheck = await client.query(
      'SELECT user_id FROM mahasiswa_profiles WHERE id = $1',
      [id]
    );

    if (mahasiswaCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        message: 'Mahasiswa tidak ditemukan' 
      });
    }

    const userId = mahasiswaCheck.rows[0].user_id;

    // Delete mahasiswa_profiles (will cascade to users due to ON DELETE CASCADE on user_id)
    await client.query('DELETE FROM mahasiswa_profiles WHERE id = $1', [id]);
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await client.query('COMMIT');

    res.json({
      message: 'Mahasiswa berhasil dihapus'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting mahasiswa:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus mahasiswa' 
    });
  } finally {
    client.release();
  }
});

// ==================== DOSEN ROUTES ====================

// POST /api/admin/dosen - Create new dosen account
router.post('/dosen', verifyAdmin, async (req: Request, res: Response) => {
  const { email, nip, nama_lengkap, departemen } = req.body;

  // Validasi input
  if (!email || !nip || !nama_lengkap || !departemen) {
    return res.status(400).json({ 
      message: 'Semua field wajib diisi' 
    });
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Format email tidak valid' 
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check apakah email sudah terdaftar
    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        message: 'Email sudah terdaftar' 
      });
    }

    // Check apakah NIP sudah terdaftar
    const nipCheck = await client.query(
      'SELECT id FROM dosen_profiles WHERE nip = $1',
      [nip]
    );

    if (nipCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        message: 'NIP sudah terdaftar' 
      });
    }

    // Generate default password (NIP)
    const defaultPassword = nip;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Insert ke table users
    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [email, hashedPassword, 'dosen']
    );

    const userId = userResult.rows[0].id;

    // Insert ke table dosen_profiles
    const dosenResult = await client.query(
      `INSERT INTO dosen_profiles (user_id, nip, nama_lengkap, departemen, is_active) 
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [userId, nip, nama_lengkap, departemen, true]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Akun dosen berhasil dibuat',
      data: {
        id: dosenResult.rows[0].id,
        email,
        nip,
        nama_lengkap,
        departemen,
        default_password: defaultPassword
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating dosen:', error);
    res.status(500).json({ 
      message: 'Gagal membuat akun dosen',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    client.release();
  }
});

// GET /api/admin/dosen - Get all dosen
router.get('/dosen', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        d.id, 
        d.nip, 
        d.nama_lengkap, 
        d.departemen,
        d.is_active,
        u.email, 
        d.created_at
       FROM dosen_profiles d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.nama_lengkap ASC`
    );

    res.json({
      message: 'Success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching dosen:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data dosen' 
    });
  }
});

// GET /api/admin/dosen/:id - Get dosen by ID
router.get('/dosen/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
        d.id, 
        d.nip, 
        d.nama_lengkap, 
        d.departemen,
        d.is_active,
        u.email, 
        d.created_at
       FROM dosen_profiles d
       JOIN users u ON d.user_id = u.id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Dosen tidak ditemukan' 
      });
    }

    res.json({
      message: 'Success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching dosen:', error);
    res.status(500).json({ 
      message: 'Gagal mengambil data dosen' 
    });
  }
});

// PUT /api/admin/dosen/:id - Update dosen
router.put('/dosen/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, nip, nama_lengkap, departemen, is_active } = req.body;

  if (!email || !nip || !nama_lengkap || !departemen) {
    return res.status(400).json({ 
      message: 'Semua field wajib diisi' 
    });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get user_id
    const dosenCheck = await client.query(
      'SELECT user_id FROM dosen_profiles WHERE id = $1',
      [id]
    );

    if (dosenCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        message: 'Dosen tidak ditemukan' 
      });
    }

    const userId = dosenCheck.rows[0].user_id;

    // Update users table
    await client.query(
      'UPDATE users SET email = $1 WHERE id = $2',
      [email, userId]
    );

    // Update dosen_profiles table
    await client.query(
      `UPDATE dosen_profiles 
       SET nip = $1, nama_lengkap = $2, departemen = $3, is_active = $4
       WHERE id = $5`,
      [nip, nama_lengkap, departemen, is_active ?? true, id]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Data dosen berhasil diupdate',
      data: { id, email, nip, nama_lengkap, departemen, is_active }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating dosen:', error);
    res.status(500).json({ 
      message: 'Gagal mengupdate data dosen' 
    });
  } finally {
    client.release();
  }
});

// DELETE /api/admin/dosen/:id - Delete dosen
router.delete('/dosen/:id', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get user_id
    const dosenCheck = await client.query(
      'SELECT user_id FROM dosen_profiles WHERE id = $1',
      [id]
    );

    if (dosenCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        message: 'Dosen tidak ditemukan' 
      });
    }

    const userId = dosenCheck.rows[0].user_id;

    // Delete dosen_profiles and users
    await client.query('DELETE FROM dosen_profiles WHERE id = $1', [id]);
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    await client.query('COMMIT');

    res.json({
      message: 'Dosen berhasil dihapus'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting dosen:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus dosen' 
    });
  } finally {
    client.release();
  }
});

export default router;
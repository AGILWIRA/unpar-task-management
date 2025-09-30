-- Create users table with role-based authentication
CREATE TYPE user_role AS ENUM ('admin', 'dosen', 'mahasiswa');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles tables
CREATE TABLE dosen_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    departemen VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mahasiswa_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    npm VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    angkatan INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create courses and assignments tables
CREATE TABLE mata_kuliah (
    id SERIAL PRIMARY KEY,
    kode VARCHAR(10) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    semester VARCHAR(6) NOT NULL,
    tahun_ajaran VARCHAR(9) NOT NULL,
    dosen_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tugas_besar (
    id SERIAL PRIMARY KEY,
    mata_kuliah_id INTEGER REFERENCES mata_kuliah(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create groups management tables
CREATE TABLE kelompok (
    id SERIAL PRIMARY KEY,
    tugas_besar_id INTEGER REFERENCES tugas_besar(id) ON DELETE CASCADE,
    nama_kelompok VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anggota_kelompok (
    id SERIAL PRIMARY KEY,
    kelompok_id INTEGER REFERENCES kelompok(id) ON DELETE CASCADE,
    mahasiswa_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create assessment components tables
CREATE TABLE komponen_penilaian (
    id SERIAL PRIMARY KEY,
    tugas_besar_id INTEGER REFERENCES tugas_besar(id) ON DELETE CASCADE,
    nama VARCHAR(100) NOT NULL,
    bobot DECIMAL(5,2) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nilai (
    id SERIAL PRIMARY KEY,
    komponen_id INTEGER REFERENCES komponen_penilaian(id) ON DELETE CASCADE,
    mahasiswa_id INTEGER REFERENCES users(id),
    nilai DECIMAL(5,2) NOT NULL,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user with hashed password 'admin123'
INSERT INTO users (email, password_hash, role)
VALUES ('admin@unpar.ac.id', '$2b$10$PEKUgvH1sYUplPqHCGbWP.A/RQ1nN9XjwNvRYGIJsc8xv6EjZGSt.', 'admin');
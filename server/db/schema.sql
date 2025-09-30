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

-- Create dosen_profiles table for additional dosen information
CREATE TABLE dosen_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    departemen VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dosen_profiles_updated_at
    BEFORE UPDATE ON dosen_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE mahasiswa_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nim VARCHAR(10) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    angkatan VARCHAR(4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for mahasiswa_profiles
CREATE TRIGGER update_mahasiswa_profiles_updated_at
    BEFORE UPDATE ON mahasiswa_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_mahasiswa_nim ON mahasiswa_profiles(nim);
CREATE INDEX idx_mahasiswa_angkatan ON mahasiswa_profiles(angkatan);
CREATE INDEX idx_mahasiswa_user_id ON mahasiswa_profiles(user_id);
CREATE INDEX idx_dosen_nip ON dosen_profiles(nip);
CREATE INDEX idx_dosen_user_id ON dosen_profiles(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
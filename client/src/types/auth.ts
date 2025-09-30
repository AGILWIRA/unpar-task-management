export type UserRole = 'admin' | 'dosen' | 'mahasiswa';

export interface User {
  email: string;
  role: UserRole;
  name: string;
}
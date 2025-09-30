import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CreateMahasiswaFormProps {
  onClose: () => void;
  onSuccess?: () => void; // Callback untuk refresh data
}

const CreateMahasiswaForm: React.FC<CreateMahasiswaFormProps> = ({ 
  onClose, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      nim: '',
      nama_lengkap: '',
      angkatan: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email tidak valid')
        .required('Email wajib diisi'),
      nim: Yup.string()
        .required('NIM wajib diisi')
        .matches(/^\d{10}$/, 'NIM harus 10 digit angka'),
      nama_lengkap: Yup.string()
        .required('Nama lengkap wajib diisi')
        .min(3, 'Nama minimal 3 karakter'),
      angkatan: Yup.string()
        .required('Angkatan wajib diisi')
        .matches(/^20\d{2}$/, 'Format tahun tidak valid (contoh: 2023)'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Ambil token dari localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('Anda harus login terlebih dahulu');
          return;
        }

        const response = await fetch('http://localhost:5000/api/admin/mahasiswa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Tambahkan token untuk autentikasi
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          alert('Akun mahasiswa berhasil dibuat!');
          formik.resetForm();
          onSuccess?.(); // Refresh data di parent component
          onClose();
        } else {
          alert(data.message || 'Gagal membuat akun mahasiswa');
        }
      } catch (error) {
        console.error('Error creating mahasiswa:', error);
        alert('Terjadi kesalahan saat membuat akun mahasiswa');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
          placeholder="contoh@student.unpar.ac.id"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
          NIM <span className="text-red-500">*</span>
        </label>
        <input
          id="nim"
          type="text"
          {...formik.getFieldProps('nim')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
          placeholder="2023730001"
          maxLength={10}
        />
        {formik.touched.nim && formik.errors.nim ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.nim}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          id="nama_lengkap"
          type="text"
          {...formik.getFieldProps('nama_lengkap')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
          placeholder="Nama Lengkap Mahasiswa"
        />
        {formik.touched.nama_lengkap && formik.errors.nama_lengkap ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.nama_lengkap}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="angkatan" className="block text-sm font-medium text-gray-700">
          Angkatan <span className="text-red-500">*</span>
        </label>
        <input
          id="angkatan"
          type="text"
          placeholder="2023"
          {...formik.getFieldProps('angkatan')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
          maxLength={4}
        />
        {formik.touched.angkatan && formik.errors.angkatan ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.angkatan}</div>
        ) : null}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Buat Akun'}
        </button>
      </div>
    </form>
  );
};

export default CreateMahasiswaForm;
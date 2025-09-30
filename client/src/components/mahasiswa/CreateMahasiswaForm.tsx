import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface CreateMahasiswaFormProps {
  onClose: () => void;
}

const CreateMahasiswaForm: React.FC<CreateMahasiswaFormProps> = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      email: '',
      nim: '',
      nama_lengkap: '',
      angkatan: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      nim: Yup.string().required('Required'),
      nama_lengkap: Yup.string().required('Required'),
      angkatan: Yup.string()
        .required('Required')
        .matches(/^20\d{2}$/, 'Invalid year format'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/mahasiswa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          alert('Mahasiswa account created successfully');
          onClose();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to create mahasiswa account');
        }
      } catch (error) {
        alert('Error creating mahasiswa account');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
          NIM
        </label>
        <input
          id="nim"
          type="text"
          {...formik.getFieldProps('nim')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.nim && formik.errors.nim ? (
          <div className="text-red-500 text-sm">{formik.errors.nim}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="nama_lengkap" className="block text-sm font-medium text-gray-700">
          Nama Lengkap
        </label>
        <input
          id="nama_lengkap"
          type="text"
          {...formik.getFieldProps('nama_lengkap')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.nama_lengkap && formik.errors.nama_lengkap ? (
          <div className="text-red-500 text-sm">{formik.errors.nama_lengkap}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="angkatan" className="block text-sm font-medium text-gray-700">
          Angkatan
        </label>
        <input
          id="angkatan"
          type="text"
          placeholder="2023"
          {...formik.getFieldProps('angkatan')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {formik.touched.angkatan && formik.errors.angkatan ? (
          <div className="text-red-500 text-sm">{formik.errors.angkatan}</div>
        ) : null}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default CreateMahasiswaForm;